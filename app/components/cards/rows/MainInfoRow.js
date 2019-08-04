import React from 'react';
import { ScrollView, Text, StyleSheet} from 'react-native';
import { fontSizeResponsive } from '../../../utils/Metric.js';
import SectionRow from './SectionRow.js';


const MainInfoRow = ({ data = {} }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.container}
  >
    {Object.keys(data).map(key => (
      <SectionRow key={key} title={key} hasSubTitle>
        <Text style={styles.description}>{data[key]}</Text>
      </SectionRow>
    ))}
  </ScrollView>
);

export default MainInfoRow;


const styles = StyleSheet.create({
    container: {
    flexDirection: 'row'
  },
  description: {
    fontSize: fontSizeResponsive(2.1),
    color: '#40739e',
    textAlign: 'justify'
  }

});