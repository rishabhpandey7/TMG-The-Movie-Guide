import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizeResponsive } from '../../../utils/Metric.js';
import Image from 'react-native-scalable-image';
import language from '../../../assets/language/iso.json';
import genre from '../../../assets/genre/ids.json';
import { TouchableOpacity } from '../../common/TouchableOpacity.js';
import { width } from '../../../utils/Metric.js';
import { notFound } from '../../../utils/NotFoundImage.js';

const getImageApi = image =>
  image ? { uri: `https://image.tmdb.org/t/p/w500/${image}` } : notFound;

const convertToDate = date => new Date(date).getFullYear() || '';

const convertToUpperCaseFirstLetter = value => {
  const str = language[value] || '';
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

const convertGenre = (arr, type, isSearch) => {
  if (type === 'normal' || isSearch) {
    if (arr.length > 1) return `${genre[arr[0]].name}, ${genre[arr[1]].name}`;
    return arr.length !== 0 ? `${genre[arr[0]].name}` : '';
  }
  return arr.length !== 0 && type !== genre[arr[0]].name
    ? `${type}, ${genre[arr[0]].name}`
    : type;
};

const renderDivider = (releaseDate, originalLanguage) =>
  releaseDate && originalLanguage !== 'xx' ? (
    <Text style={styles.trace}> | </Text>
  ) : null;

const renderScore = voteAverage => {
  const color =
    voteAverage < 5
      ? 'low'
      : voteAverage >= 5 && voteAverage < 7
      ? 'mid'
      : 'high';

  return (
    <View style={[styles.score, styles[color]]}>
      <Text style={styles.textPercent}>{voteAverage}</Text>
    </View>
  );
};


export default class MovieRow extends React.Component{

render() {
    const { numColumns, item, type, isSearch, navigate } = this.props;

    if (numColumns === 1) {
      return (
        <TouchableOpacity
          onPress={() => navigate('MovieDetails', { id: item.id })}
        >
          <View style={styles.containerItem}>
            <Image
              source={getImageApi(item.poster_path)}
              style={styles.photo}
              width={width * 0.3}
            />
            <View style={styles.item}>
              <View>
                <Text numberOfLines={2} style={styles.textTitle}>
                  {item.title}
                </Text>
                <View style={[styles.textRow, styles.containerSubTitle]}>
                  <Text style={styles.textSmall}>
                    {convertToDate(item.release_date)}
                  </Text>
                  {renderDivider(item.release_date, item.original_language)}
                  <Text numberOfLines={1} style={styles.textSmall}>
                    {convertToUpperCaseFirstLetter(item.original_language)}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.textSmall}>
                  {convertGenre(item.genre_ids, type, isSearch)}
                </Text>
              </View>
              <View style={[styles.textRow, styles.containerReview]}>
                {renderScore(item.vote_average)}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.containerTwoItem}
        onPress={() => navigate('MovieDetails', { id: item.id })} >
        <View>
          <Image
            source={getImageApi(item.poster_path)}
            style={styles.photo}
            width={width * 0.33}
          />
        </View>
        <Text numberOfLines={2} style={styles.textTwoTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

};





const styles = StyleSheet.create({
	containerItem: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    marginBottom: 20,
    flexDirection: 'row'
  },
  containerTwoItem: {
    paddingTop: 10,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  photo: {
    borderRadius: 8
  },
  item: {
    marginLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1
  },
  textTitle: {
    fontSize: fontSizeResponsive(2.6),
    color: '#273c75',
    fontWeight: 'bold'
  },
  textTwoTitle: {
    textAlign: 'center',
    fontSize: fontSizeResponsive(2),
    color: '#2d3436',
    fontWeight: 'bold',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20
  },
  textRow: {
    flexDirection: 'row'
  },
  containerSubTitle: {
    marginTop: 3,
    marginBottom: 3
  },
  containerReview: {
    justifyContent: 'space-between',
    marginRight: 20
  },
  textSmall: {
    fontSize: fontSizeResponsive(2.1),
    color: '#273c75'
  },
  trace: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: fontSizeResponsive(2.1),
    color: '#2d3436'
  },
  score: {
    minWidth: '25%',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 100
  },
  low: {
    backgroundColor: '#e74c3c'
  },
  mid: {
    backgroundColor: '#f1c40f'
  },
  high: {
    backgroundColor: '#2ecc71'
  },
  textPercent: {
    fontSize: fontSizeResponsive(2.1),
    fontWeight: '500',
    color: '#ecf0f1',
    textAlign: 'center'
  },
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  containerError: {
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingMore: {
    marginTop: 20,
    marginBottom: 30
  }
});