import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizeResponsive } from '../utils/Metric.js';
import { Feather } from '@expo/vector-icons';
import Spinner from '../components/common/Spinner.js';
import NotificationCard from '../components/cards/NotificationCard.js';
import MovieListRow from '../components/cards/rows/MovieListRow.js';
import MovieRow from '../components/cards/rows/MovieRow.js';
import { TouchableOpacity } from '../components/common/TouchableOpacity.js';
import request from '../services/Api.js';
import { getItem } from '../utils/AsyncStorage.js';



export default class SearchResultsScreen extends React.Component{

    static navigationOptions = () => {
    return {
      title: 'Search results'
    };
  };

  state = {
    isLoading: false,
    isLoadingMore: false,
    isError: false,
    results: [],
    page: 1,
    numColumns: 1,
    hasAdultContent: false,
    keyGrid: 1,
    id: this.props.navigation.state.params.id,
    name: this.props.navigation.state.params.name,
    typeRequest: this.props.navigation.state.params.typeRequest
  };

  async componentDidMount() {
    try {
      const hasAdultContent = await getItem('@ConfigKey', 'hasAdultContent');

      this.setState({ hasAdultContent }, () => {
        this.requestMoviesList();
      });
    } catch (error) {
      this.requestMoviesList();
    }
  };


  shouldComponentUpdate(nextProps, nextState) {
    const { results, isLoading, isLoadingMore, isError, keyGrid } = this.state;

    if (
      results !== nextState.results ||
      isLoading !== nextState.isLoading ||
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

      const { page, name, id, typeRequest, hasAdultContent } = this.state;
      const dateRelease = new Date().toISOString().slice(0, 10);
      const query =
        typeRequest === 'search'
          ? { query: `${name.trim()}` }
          : { with_genres: `${id}` };

      const data = await request(`${typeRequest}/movie`, {
        page,
        'release_date.lte': dateRelease,
        with_release_type: '1|2|3|4|5|6|7',
        include_adult: hasAdultContent,
        ...{ ...query }
      });

      this.setState(({ results }) => ({
        isLoading: false,
        isLoadingMore: false,
        isError: false,
        totalPages: data.total_pages,
        results: [...results, ...data.results]
      }));
    } catch (err) {
      this.setState({
        isLoading: false,
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
            <Text style={styles.loadingText}>
            Load more</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (results.length > 0) 
      return <View style={styles.loadingMore} />;

    return null;
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

  render() {
    const { navigate } = this.props.navigation;
    const {
      name,
      typeRequest,
      isLoading,
      isLoadingMore,
      isError,
      results,
      numColumns,
      keyGrid
    } = this.state;

    return (
      <View style={styles.container}>
        {isLoading && !isLoadingMore ? (
          <Spinner />
        ) : isError ? (
          <NotificationCard
            icon="alert-circle"
            action={this.requestMoviesList}
          />
        ) : results.length === 0 ? (
          <NotificationCard
            icon="slash"
            textError="No results available"
          />
        ) : (
          <View style={styles.containerList}>
            {results.length > 0 && (
              <View style={styles.containerMainText}>
                <Text style={styles.textMain} numberOfLines={1}>
                  {name}
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
              type={name}
              isSearch={typeRequest === 'search'}
              keyGrid={keyGrid}
              numColumns={numColumns}
              refreshing={null}
              onRefresh={null}
              ListFooterComponent={this.renderFooter}
              navigate={navigate}
              renderItem={this.renderItem}
            />
          </View>
        )}
      </View>
    );
  };

};




const styles = StyleSheet.create({
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
    color: '#273c75',
    textAlign: 'center'
  },
});
