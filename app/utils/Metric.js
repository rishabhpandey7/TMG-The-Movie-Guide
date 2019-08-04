import React from 'react';
import { Dimensions } from 'react-native';

export const {width, height} = Dimensions.get('screen');

export const fontSizeResponsive = value => {
	const newHeight = 16/9 * width;
	return Math.sqrt(newHeight ** 2 + width ** 2) * (value/100);
};



