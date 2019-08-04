import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Search from '../components/common/Search.js';
import { fontSizeResponsive } from '../utils/Metric.js';



export default class SearchScreen extends React.Component{


   shouldComponentUpdate() {
    return false;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style = {styles.mainContainer}>
      <View style={styles.container}>
        <Search typeRequest="search" navigate={navigate} />
      </View>
      </View>
    );
  };

}


const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#f5f6fa'
    },
    container: {
    flex: 1,
    position: 'absolute',
    top: 150,
    width: 400,
    height: 50,
    backgroundColor: '#f5f6fa'
  }
});
