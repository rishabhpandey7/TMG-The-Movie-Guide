import React from 'react';
import { Switch } from 'react-native';

const SwitchCustom = ({value = false, onValueChange = () => {}, trackColor = {false : '#bdc3c7', true: '#2980b9'} }) => (

<Switch value = {value} onValueChange = {onValueChange} trackColor = {trackColor} />
	);


export {SwitchCustom as Switch};
