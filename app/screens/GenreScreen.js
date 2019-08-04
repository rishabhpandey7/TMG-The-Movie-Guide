import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TouchableOpacity } from '../components/common/TouchableOpacity.js';
import genre from '../assets/genre/ids.json';
import { fontSizeResponsive } from '../utils/Metric.js';


export default class GenreScreen extends React.Component{


   shouldComponentUpdate() {
    return false;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.containerList}>
          {Object.keys(genre).map(id => (
            <TouchableOpacity
              style={styles.item}
              key={id}
              onPress={() =>
                navigate('SearchResults', {
                  typeRequest: 'discover',
                  name: genre[id].name,
                  id
                })
              }
            >
              <Text style={styles.itemText}>{genre[id].name} </Text>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>
    );
  };

}


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  containerList: {
    marginTop: 25
  },
  item: {
    alignItems: 'center',
    marginBottom: 25
  },
  itemText: {
    fontSize: fontSizeResponsive(2.5),
    color: '#273c75',
    textAlign: 'center'
  },
});
