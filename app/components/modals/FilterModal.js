import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontSizeResponsive, height } from '../../utils/Metric.js';
import { Feather } from '@expo/vector-icons';
import { Modal } from './Modal.js';
import { TouchableOpacity } from '../common/TouchableOpacity.js';
import { Switch } from '../common/Switch.js';

export default class FilterModal extends Component<{}> {
  state = {
    filter: this.props.filterType,
    name: this.props.filterName,
    actionFilter: this.props.actionFilter,
    actionSwitchMovie: this.props.actionSwitchMovie
  };

  changeValues = (filter, name) => {
    this.setState({ filter, name });
  };

  render() {
    const { filter, name, actionFilter, actionSwitchMovie } = this.state;
    const { isVisible, style } = this.props;

    return (
      <Modal isVisible={isVisible} actionOpenClose={actionFilter} style={style}>
        <View style={styles.containerModal}>
          <Text style={styles.modalTitle}>Filter</Text>
          <ScrollView>
            <View style={styles.containerScroll}>
              <View style={styles.containerSection}>
                <Text style={styles.optionSectionTitle} numberOfLines={2}>
                  Release Date
                </Text>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Newest
                  </Text>
                  <Switch
                    value={filter === 'release_date.desc'}
                    onValueChange={() =>
                      this.changeValues('release_date.desc', 'Releases')
                    }
                  />
                </View>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Oldest
                  </Text>
                  <Switch
                    value={filter === 'release_date.asc'}
                    onValueChange={() =>
                      this.changeValues('release_date.asc', 'Old')
                    }
                  />
                </View>
              </View>
              <View style={styles.containerSection}>
                <Text style={styles.optionSectionTitle} numberOfLines={2}>
                  Popularity
                </Text>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Most popular
                  </Text>
                  <Switch
                    value={filter === 'popularity.desc'}
                    onValueChange={() =>
                      this.changeValues('popularity.desc', 'Most popular')
                    }
                  />
                </View>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Least popular
                  </Text>
                  <Switch
                    value={filter === 'popularity.asc'}
                    onValueChange={() =>
                      this.changeValues('popularity.asc', 'Less popular')
                    }
                  />
                </View>
              </View>
              <View>
                <Text style={styles.optionSectionTitle} numberOfLines={2}>
                  Revenue
                </Text>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Highest revenue
                  </Text>
                  <Switch
                    value={filter === 'revenue.desc'}
                    onValueChange={() =>
                      this.changeValues('revenue.desc', 'Higher revenue')
                    }
                  />
                </View>
                <View style={styles.containerRow}>
                  <Text style={styles.optionTitle} numberOfLines={2}>
                    Lowest revenue
                  </Text>
                  <Switch
                    value={filter === 'revenue.asc'}
                    onValueChange={() =>
                      this.changeValues('revenue.asc', 'Lowest revenue')
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.containerButton}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={actionFilter}
            >
              <Feather
                name="chevron-down"
                size={styles.icon.fontSize}
                color={'#273c75'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={() => actionSwitchMovie(filter, name, false)}
            >
              <Feather name = "search" size = {styles.icon.fontSize} color = '#ffffff' /> 
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: '#f5f6fa',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: height * 0.7
  },
  containerScroll: {
    padding: 22
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: fontSizeResponsive(2.5),
    fontWeight: 'bold',
    color: '#273c75',
    padding: 22,
    paddingBottom: 18
  },
  containerSection: {
    marginBottom: 25
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 10
  },
  optionSectionTitle: {
    fontSize: fontSizeResponsive(2.4),
    color: '#273c75',
    fontWeight: 'bold',
    width: '100%'
  },
  optionTitle: {
    fontSize: fontSizeResponsive(2.3),
    color: '#273c75',
    width: '80%'
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100
  },
  buttonClose: {
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#273c75',
    paddingVertical: 9.1,
    flex: 0.23
  },
  buttonSave: {
    backgroundColor: '#273c75',
    borderWidth: 1,
    borderColor: '#273c75',
    flex: 0.67
  },
  buttonText: {
    fontSize: fontSizeResponsive(2.1),
    textAlign: 'center'
  },
  buttonTextSave: {
    color: '#f5f6fa',
    fontWeight: 'bold'
  },
  icon: {
    fontSize: fontSizeResponsive(2.8)
  }
});