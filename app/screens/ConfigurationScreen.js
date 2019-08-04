import React from 'react';
import {  StyleSheet, ScrollView, Text, View  } from 'react-native';
import { fontSizeResponsive } from '../utils/Metric.js';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { Alert } from '../components/common/Alert.js';
import { Share } from '../components/common/Share.js';
import { TouchableOpacity } from '../components/common/TouchableOpacity.js';
import { Switch } from '../components/common/Switch.js';
import { getItem, setItem } from '../utils/AsyncStorage.js';



export default class ConfigurationScreen extends React.Component{

actionShare = () => {
	Share({
		message: 'Learn more about your favourite movies and discover new movies!',
		dialogTitle: 'Learn more about your favourite movies and discover new movies!',
	});
};

actionRating = () => {
	Alert({
		title: 'Sorry',
		description: 'The app is not yet up on the store. You will be redirected to the store when it is up.',
	});
};

render(){
return (
	<ScrollView style = {styles.bgWhite}>
	<View style = {styles.container}>
	<View style = {styles.section}> 
	<View>
	<Text style = {[styles.itemText, styles.sectionText]} numberOfLines = {2}>
	Application </Text>
	<TouchableOpacity style = {styles.sectionText} onPress = {this.actionShare}>
	<View style = {styles.item}>
	<Text style = {styles.itemText}> 
	Share with a friend </Text>
	<Feather style = {styles.icon} size = {22} name = 'share' color = '#192a56' />
	</View>
	</TouchableOpacity>
	<TouchableOpacity style = {styles.sectionText} onPress = {this.actionRating}>
	<View style = {styles.item}>
	<Text style = {styles.itemText}> Enjoying? Rate the app </Text>
	<Feather name = 'star' style = {styles.icon} size = {22} color = '#192a56' />
	</View>
	</TouchableOpacity>

	<View style={[styles.item, styles.itemNoBorder]}>
    <Text style={styles.itemTextVersion} numberOfLines={2}>
    Version {Constants.manifest.version} </Text>
    </View>
    </View>
    </View>
    </View>
    </ScrollView>

	);
};


}


const styles = StyleSheet.create({
	bgWhite: {
    backgroundColor: '#f5f6fa'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
    paddingTop: 25
  },
  section: {
    marginBottom: 40
  },
  sectionText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: fontSizeResponsive(3)
  },
  item: {
    backgroundColor: '#f5f6fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#7f8fa6'
  },
  itemText: {
    fontSize: fontSizeResponsive(2.5),
    color: '#273c75',
    width: '80%'
  },
  itemTextVersion: {
    fontSize: fontSizeResponsive(2.5),
    color: '#487eb0'
  },
  itemNoBorder: {
    borderBottomWidth: 0
  },
  icon: {
    marginRight: 5
  }


});
