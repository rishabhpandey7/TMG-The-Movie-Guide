import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizeResponsive } from '../utils/Metric.js';
import { Asset } from 'expo-asset';
import { Feather } from '@expo/vector-icons';
import { Assets as StackAssets } from 'react-navigation-stack';
import Spinner from '../components/common/Spinner.js';
import NotificationCard from '../components/cards/NotificationCard.js';
import FilterModal from '../components/modals/FilterModal.js';
import MovieListRow from '../components/cards/rows/MovieListRow.js';
import MovieRow from '../components/cards/rows/MovieRow.js';
import { TouchableOpacity } from '../components/common/TouchableOpacity.js';
import request from '../services/Api.js';
import { getItem } from '../utils/AsyncStorage.js';


export default class MovieListScreen extends React.Component{
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return{
      headerRight: (
        <TouchableOpacity style = {styles.buttonFilter} onPress = {params.actionFilter} >
        <Feather size = {23} name = 'filter' color = '#273c75' />
        </TouchableOpacity>
        )
    };
  };

  state = {
    isVisible: false,
    isLoading: false,
    isRefresh: false,
    isLoadingMore: false,
    isError: false,
    filterType: 'popularity.desc',
    filterName: 'Most popular',
    results: [],
    page: 1,
    numColumns: 1,
    keyGrid: 1
  };

  async componentDidMount() {
    try {
      Asset.loadAsync(StackAssets);
      this.props.navigation.setParams({ actionFilter: this.actionFilter });

      this.setState({ hasAdultContent }, () => {
        this.requestMoviesList();
      });
    } catch (error) {
      this.requestMoviesList();
    }
  };

   shouldComponentUpdate(nextProps, nextState) {
    const {
      results,
      isVisible,
      isLoading,
      isRefresh,
      isLoadingMore,
      isError,
      keyGrid
    } = this.state;

    if (
      results !== nextState.results ||
      isVisible !== nextState.isVisible ||
      isLoading !== nextState.isLoading ||
      isRefresh !== nextState.isRefresh ||
      isLoadingMore !== nextState.isLoadingMore ||
      isError !== nextState.isError ||
      keyGrid !== nextState.keyGrid
    ) {
      return true;
    }
    return false;
  };



  requestMoviesList = async () => {
    try {
      this.setState({ isLoading: true });

      const { page, filterType, hasAdultContent } = this.state;
      const dateRelease = new Date().toISOString().slice(0, 10);

      const data = await request('discover/movie', {
        page,
        'release_date.lte': dateRelease,
        sort_by: filterType,
        with_release_type: '1|2|3|4|5|6|7',
        include_adult: hasAdultContent
      });

      this.setState(({ isRefresh, results }) => ({
        isLoading: false,
        isRefresh: false,
        isLoadingMore: false,
        isError: false,
        totalPages: data.total_pages,
        results: isRefresh ? data.results : [...results, ...data.results]
      }));
    } catch (err) {
      this.setState({
        isLoading: false,
        isRefresh: false,
        isLoadingMore: false,
        isError: true
      });
    }
  };

  renderItem = (item, type, isSearch, numColumns, navigate) => (
    <MovieRow
      item={item}
      type={type}
      isSearch={isSearch}
      numColumns={numColumns}
      navigate={navigate}
    />
  );


  renderFooter = () => {
    const { isLoadingMore, totalPages, page, results } = this.state;

    if (isLoadingMore) 
      return <Spinner size="small" />;

    if (totalPages !== page && results.length > 0) {
      return (
        <View style={styles.loadingMore}>
          <TouchableOpacity
            style={styles.loadingButton}
            onPress={this.actionLoadMore}
          >
            <Text style={styles.loadingText}>Load more</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (results.length > 0) 
      return <View style={styles.loadingMore} />;

    return null;
  };

  actionRefresh = () => {
    this.setState(
      {
        isRefresh: true,
        page: 1
      },
      () => {
        this.requestMoviesList();
      }
    );
  };

  actionLoadMore = () => {
    this.setState(
      ({ page }) => ({
        isLoadingMore: true,
        page: page + 1
      }),
      () => {
        this.requestMoviesList();
      }
    );
  };

  actionGrid = () => {
    this.setState(({ numColumns, keyGrid }) => {
      return { numColumns: numColumns === 1 ? 2 : 1, keyGrid: keyGrid + 1 };
    });
  };

  actionFilter = () => {
    this.setState(({ isVisible }) => {
      return { isVisible: !isVisible };
    });
  };

  actionSwitchMovie = (filterType, filterName, isVisible) => {
    if (this.state.filterType !== filterType) {
      this.setState(
        { filterType, filterName, isVisible, page: 1, results: [] },
        () => {
          this.requestMoviesList();
        }
      );
    } else {
      this.setState({ isVisible });
    }
  };

   render() {
    const { navigate } = this.props.navigation;
    const {
      isLoading,
      isRefresh,
      isLoadingMore,
      isError,
      results,
      filterName,
      isVisible,
      filterType,
      numColumns,
      keyGrid
    } = this.state;

    return (
      <View style={styles.container}>
        {isLoading && !isRefresh && !isLoadingMore ? (
          <Spinner />
        ) : isError ? (
          <NotificationCard
            icon="alert-octagon"
            action={this.requestMoviesList}
          />
        ) : results.length === 0 ? (
          <NotificationCard
            icon="thumbs-down"
            textError="No results available."
          />
        ) : (
          <View style={styles.containerList}>
            {results.length > 0 && (
              <View style={styles.containerMainText}>
                <Text style={styles.textMain} numberOfLines={1}>
                  {filterName}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.buttonGrid,
                    numColumns === 2 && styles.buttonGridActive
                  ]}
                  onPress={this.actionGrid}
                >
                  <Feather name="grid" size={22} color={'#273c75'} />
                </TouchableOpacity>
              </View>
            )}
            <MovieListRow
              data={results}
              type="normal"
              isSearch={false}
              keyGrid={keyGrid}
              numColumns={numColumns}
              refreshing={isRefresh}
              onRefresh={this.actionRefresh}
              ListFooterComponent={this.renderFooter}
              navigate={navigate}
              renderItem={this.renderItem}
            />
          </View>
        )}
        <FilterModal
          isVisible={isVisible}
          filterType={filterType}
          filterName={filterName}
          actionFilter={this.actionFilter}
          actionSwitchMovie={this.actionSwitchMovie}
          style={styles.bottomModal}
        />
      </View>
    );
  };

}



const styles = StyleSheet.create({
  buttonFilter: {
    paddingRight: 15,
    paddingLeft: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center'
  },
  containerList: {
    justifyContent: 'center',
    flex: 1
  },
  containerMainText: {
    paddingVertical: 25,
    paddingHorizontal: 20
  },
  textMain: {
    fontSize: fontSizeResponsive(3),
    fontWeight: 'bold',
    color: '#2d3436',
    width: '80%'
  },
  buttonGrid: {
    position: 'absolute',
    right: 12,
    top: 18,
    padding: 8,
    borderRadius: 100
  },
  buttonGridActive: {
    backgroundColor: '#7f8fa6'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  loadingMore: {
    paddingTop: 20,
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingButton: {
    padding: 10,
    width: '50%',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#7f8fa6'
  },
  loadingText: {
    fontSize: fontSizeResponsive(2.1),
    color: '#2d3436',
    textAlign: 'center'
  },
});