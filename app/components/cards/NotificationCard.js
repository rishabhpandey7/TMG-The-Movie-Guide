import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { fontSizeResponsive } from '../../utils/Metric.js';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from '../common/TouchableOpacity.js';
import { width } from '../../utils/Metric.js';


const NotificationCard = ({
  style = styles.containerError,
  icon = 'alert-circle',
  textError = 'Something wrong has happened, please try again later.',
  textButton = 'Load',
  action = null
}) => (
  <View style={style}>
    <Feather name={icon} size={width * 0.2} color={'#273c75'} />
    <Text style={styles.errorInfo}>{textError}</Text>
    {action && (
      <TouchableOpacity style={styles.loadingButton} onPress={action}>
        <Text style={styles.loadingText}>{textButton}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default NotificationCard;



const styles = StyleSheet.create({
 containerError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '100%'
  },
  errorInfo: {
    fontSize: fontSizeResponsive(2.6),
    color: '#487eb0',
    textAlign: 'center',
    padding: 25
  },
  loadingButton: {
    padding: 10,
    width: '50%',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#dcdde1'
  },
  loadingText: {
    fontSize: fontSizeResponsive(2.1),
    color: '#487eb0',
    textAlign: 'center'
  },


});
