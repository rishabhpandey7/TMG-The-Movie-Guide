import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';



const Spinner = ({ style = {}, size = 50, color = '#273c75' }) => (
  <View style={style}>
    {Platform.OS === 'ios' ? (
      <ActivityIndicator size="small" color={color} />
    ) : (
      <ActivityIndicator size={size} color={color} />
    )}
  </View>
);

export default Spinner;