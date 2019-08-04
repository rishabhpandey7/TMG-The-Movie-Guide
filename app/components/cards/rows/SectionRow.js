import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { fontSizeResponsive } from '../../../utils/Metric.js';

const SectionRow = ({
  title = '',
  isLast = false,
  hasSubTitle = false,
  children = null
}) => (
  <View
    style={[
      !hasSubTitle && styles.container,
      isLast && styles.containerLast,
      hasSubTitle && styles.containerSubTitle
    ]}
  >
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

export default SectionRow;

const styles = StyleSheet.create({
  container: {
    marginTop: 35
  },
  containerLast: {
    marginBottom: 15
  },
  containerSubTitle: {
    marginRight: 25
  },
  title: {
    fontSize: fontSizeResponsive(2.6),
    fontWeight: 'bold',
    color: '#273c75',
    marginBottom: 7
  }

});

