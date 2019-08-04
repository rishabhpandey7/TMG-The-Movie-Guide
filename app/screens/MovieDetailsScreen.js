import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { fontSizeResponsive } from '../utils/Metric.js';
import { Feather } from '@expo/vector-icons';
import ReadMore from 'react-native-read-more-text';
import { Alert } from '../components/common/Alert.js';
import { Share } from '../components/common/Share.js';
import Spinner from '../components/common/Spinner.js';
import NotificationCard from '../components/cards/NotificationCard.js';
import PosterRow from '../components/cards/rows/PosterRow.js';
import PersonModal from '../components/modals/PersonModal.js';
import PersonListRow from '../components/cards/rows/PersonListRow.js';
import PersonRow from '../components/cards/rows/PersonRow.js';
import SectionRow from '../components/cards/rows/SectionRow.js';
import MainInfoRow from '../components/cards/rows/MainInfoRow.js';
import { TouchableOpacity } from '../components/common/TouchableOpacity.js';
import request from '../services/Api.js';
import language from '../assets/language/iso.json';



const uninformed = 'Uninformed';

const renderTruncatedFooter = handlePress => (
  <TouchableOpacity onPress={handlePress}>
    <Text style={styles.readMore}>Read more</Text>
  </TouchableOpacity>
);

const renderRevealedFooter = handlePress => (
  <TouchableOpacity onPress={handlePress}>
    <Text style={styles.readMore}>Read less</Text>
  </TouchableOpacity>
);


export default class MovieDetailsScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: 'Movie details',
      headerRight: (
        <TouchableOpacity
          style={styles.buttonShare}
          onPress={params.actionShare}
        >
          <Feather name="share" size={23} color={'#273c75'} />
        </TouchableOpacity>
      )
    };
  };

  

  state = {
    isLoading: true,
    isError: false,
    isVisible: false,
    showImage: false,
    creditId: null
  };

  componentDidMount() {
    this.props.navigation.setParams({ actionShare: this.actionShare });
    this.requestMoviesInfo();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isVisible !== nextState.isVisible ||
      this.state.showImage !== nextState.showImage ||
      this.state.isLoading !== nextState.isLoading ||
      this.state.isError !== nextState.isError
    ) {
      return true;
    }
    return false;
  }

  requestMoviesInfo = async () => {
    try {
      this.setState({ isLoading: true });

      const { id } = this.props.navigation.state.params;

      const data = await request(`movie/${id}`, {
        include_image_language: 'en,null',
        append_to_response: 'credits,videos,images'
      });

      this.setState({
        isLoading: false,
        isError: false,
        id,
        backdropPath: data.backdrop_path || '',
        title: data.title || '',
        voteAverage: data.vote_average || 0,
        video: data.videos.results[0] || [],
        overview: data.overview || uninformed,
        cast: this.sliceArrayLength(data.credits.cast, 15),
        crew: this.sliceArrayLength(data.credits.crew, 15),
        productionCompanies: this.sliceArrayLength(
          data.production_companies,
          10
        ),
        images: this.formatImageUrl(data.images.backdrops),
        infosDetail: this.getInfosDetail(data)
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  };

  
  getInfosDetail = ({
    runtime,
    genres,
    original_language,
    release_date,
    budget,
    revenue,
    adult
  }) => {
    return {
      Duration: this.convertMinsToHrsMins(runtime || 0),
      Genre: this.convertToGenre(this.sliceArrayLength(genres, 2) || ''),
      Language: this.convertToUpperCaseFirstLetter(
        language[original_language] || ''
      ),
      Release: this.convertToDate(release_date || ''),
      Budget: this.convertToDollar(budget || 0),
      Revenue: this.convertToDollar(revenue || 0),
      Adult: this.convertAdult(adult || '')
    };
  };


  formatImageUrl = images => {
    return this.sliceArrayLength(images, 15).map(item => {
      return { url: `https://image.tmdb.org/t/p/original/${item.file_path}` };
    });
  };

  sliceArrayLength = (arr, num) => {
    return arr.length > num ? arr.slice(0, num) : arr;
  };

  convertToDollar = value => {
    return (
      `$${value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` ||
      uninformed
    );
  };

  convertAdult = adult => (adult === false ? 'Yes' : 'No' || uninformed);

  convertMinsToHrsMins = runtime => {
    let h = Math.floor(runtime / 60);
    let m = runtime % 60;
    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    return h && m ? `${h}h ${m}m` : uninformed;
  };

  convertToGenre = genre => {
    return genre.length > 0
      ? genre.length > 1
        ? `${genre[0].name}, ${genre[1].name}`
        : genre[0].name
      : uninformed;
  };

  convertToUpperCaseFirstLetter = originalLanguage => {
    return originalLanguage.charAt(0).toUpperCase() + originalLanguage.slice(1);
  };

  convertToDate = releaseDate => {
    const date = new Date(releaseDate);
    return (
      `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}` ||
      uninformed
    );
  };

  actionPerson = (creditId = '') => {
    this.setState(({ isVisible }) => {
      return { creditId, isVisible: !isVisible };
    });
  };

  actionImage = () => {
    this.setState(({ showImage }) => {
      return { showImage: !showImage };
    });
  };

  actionShare = () => {
    const { isError, title, id } = this.state;

    if (isError) {
      Alert({
        title: 'Attention',
        description: 'Something wrong has happened, please try again later.'
      });
    } else {
      Share({
        message: `${title}, know everything about this movie`,
        url: `https://www.themoviedb.org/movie/${id}`,
        dialogTitle: `${title}, know everything about this movie`
      });
    }
  };

  renderItem = (item, type, actionTeamDetail) => (
    <PersonRow item={item} type={type} actionTeamDetail={actionTeamDetail} />
  );

  renderListEmpty = () => (
    <View>
      <Text style={styles.subTitleInfo}>Uninformed</Text>
    </View>
  );

  render() {
    const {
      isLoading,
      isError,
      backdropPath,
      voteAverage,
      video,
      title,
      infosDetail,
      overview,
      cast,
      crew,
      productionCompanies,
      images,
      creditId,
      isVisible,
      showImage
    } = this.state;

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <NotificationCard
            icon="alert-octagon"
            action={this.requestMoviesInfo}
          />
        ) : (
          <ScrollView>
            <PosterRow
              title={title}
              backdropPath={backdropPath}
              voteAverage={voteAverage}
              images={images}
              video={video}
              navigate={navigate}
              showImage={showImage}
              onPress={this.actionImage}
            />
            <View style={styles.containerMovieInfo}>
              <MainInfoRow data={infosDetail} />
              <SectionRow title="Synopsis">
                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={renderTruncatedFooter}
                  renderRevealedFooter={renderRevealedFooter}
                >
                  <Text style={styles.subTitleInfo}>{overview}</Text>
                </ReadMore>
              </SectionRow>
              <SectionRow title="Main cast">
                <PersonListRow
                  data={cast}
                  type="character"
                  keyItem="creditId"
                  ListEmptyComponent={this.renderListEmpty}
                  actionTeamDetail={this.actionPerson}
                  renderItem={this.renderItem}
                />
              </SectionRow>
              <SectionRow title="Main technical team">
                <PersonListRow
                  data={crew}
                  type="job"
                  keyItem="creditId"
                  ListEmptyComponent={this.renderListEmpty}
                  actionTeamDetail={this.actionPerson}
                  renderItem={this.renderItem}
                />
              </SectionRow>
              <SectionRow title="Producer" isLast>
                <PersonListRow
                  data={productionCompanies}
                  type="production"
                  keyItem="id"
                  ListEmptyComponent={this.renderListEmpty}
                  actionTeamDetail={this.actionPerson}
                  renderItem={this.renderItem}
                />
              </SectionRow>
            </View>
          </ScrollView>
        )}
        <PersonModal
          isVisible={isVisible}
          creditId={creditId}
          actionClose={this.actionPerson}
          style={styles.bottomModal}
        />
      </View>
    );
   };

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa'
  },
  buttonShare: {
    paddingRight: 15,
    paddingLeft: 20
  },
  containerMovieInfo: {
    margin: 20,
    marginTop: 35
  },
  subTitleInfo: {
    fontSize: fontSizeResponsive(2.1),
    color: '#487eb0',
    textAlign: 'justify'
  },
  readMore: {
    color: '#fd79a8',
    marginTop: 5,
    textAlign: 'right'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
});
