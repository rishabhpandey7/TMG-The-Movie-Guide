import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import {Feather} from '@expo/vector-icons';
import { TouchableOpacity } from './TouchableOpacity.js';
import {fontSizeResponsive} from '../../utils/Metric.js';



export default class Search extends React.Component{
	state = {
		value: '',
	};
	

	actionClearSearch = () => {
		this.setState({
			value: '',
		});
	};

	actionSubmit = () => {
		const { value } = this.state;
		const {navigate, typeRequest} = this.props;

		if (value) {
			navigate('SearchResults', {
				typeRequest,
				name: value,
				id: null,
			})
		}

	};

	render() {
	  const {value} = this.state;
		return (
			<View style = {styles.container}>
			<View style = {styles.containerInput}>
			<View style = {styles.inputDirection}>
			<Feather style = {styles.icon} name = 'search' size = {20} color = '#7f8c8d' />
			<TextInput style = {styles.textInput} onChangeText = {search => this.setState({value: search})} onSubmitEditing = {this.actionSubmit} 
			value = {value} placeholder = 'Search' returnKeyType = 'search' blurOnSubmit multiLine = {false} />

			{value.length > 0 && (<TouchableOpacity onPress = {this.actionClearSearch}>
			<Feather style = {styles.icon} size = {20} name = 'x' color = '#7f8c8d' />
			</TouchableOpacity>
			)}

			</View>
			</View>
			</View>
		);

	};
		

};


const styles = StyleSheet.create({
	 container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 5
  },
  containerInput: {
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 15
  },
  inputDirection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    padding: 10
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSizeResponsive(2.2),
    color: '#2d3436',
    width: '100%'
  },

});

