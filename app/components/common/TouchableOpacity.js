import React from 'react';
import { TouchableOpacity } from 'react-native';

const TouchableOpacityCustom = ({style = {}, onPress = () => null, activeOpacity = 0.5, children = null}) => (
	<TouchableOpacity style = {style} onPress = {onPress} activeOpacity = {activeOpacity}>
	{children}
	</TouchableOpacity>
);

export {TouchableOpacityCustom as TouchableOpacity};