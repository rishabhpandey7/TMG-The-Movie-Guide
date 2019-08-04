import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Image from 'react-native-scalable-image';
import Spinner from '../common/Spinner.js';
import NotificationCard from '../cards/NotificationCard.js';
import { Modal } from './Modal';
import { TouchableOpacity } from '../common/TouchableOpacity.js';
import request from '../../services/Api.js';
import { fontSizeResponsive, height, width } from '../../utils/Metric.js';
import { notFound } from '../../utils/StaticImage.js';


const uninformed = 'Uninformed';

export default class PersonModal extends Component {
  state = {
    isLoading: false,
    isError: false,
    id: this.props.creditId
  };

  getImageApi = () => {
    const { profilePath } = this.state;

    return profilePath
      ? { uri: `https://image.tmdb.org/t/p/w500/${profilePath}` }
      : notFound;
  };

  getAge = () => {
    const { birthday } = this.state;

    if (birthday) {
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age -= 1;
      return `${age} years`;
    }
    return `${uninformed} age`;
  };

  requestTeamInfo = async () => {
    try {
      this.setState({ isLoading: true });

      const { creditId } = this.props;

      const data = await request(`person/${parseInt(creditId)}`);

      this.setState({
        isLoading: false,
        isError: false,
        id: creditId,
        profilePath: data.profile_path || '',
        name: data.name || `${uninformed} name`,
        knownForDepartment:
          data.known_for_department || `${uninformed} department`,
        birthday: data.birthday || '',
        placeOfBirth: data.place_of_birth || `${uninformed} place of birth`,
        biography: data.biography || uninformed
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  };

  renderFooter = () => {
    const { actionClose } = this.props;
    return (
      <View style={styles.containerRow}>
        <TouchableOpacity style={styles.button} onPress={actionClose}>
          <Feather
            name="chevron-down"
            size={styles.icon.fontSize}
            color={'#273c75'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      isError,
      id,
      name,
      knownForDepartment,
      placeOfBirth,
      biography
    } = this.state;

    const { isVisible, actionClose, style, creditId } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        onModalShow={this.requestTeamInfo}
        actionOpenClose={actionClose}
        style={style}
      >
        <View style={styles.containerModal}>
          {isLoading || creditId !== id ? (
            <Spinner style={styles.containerCenter} />
          ) : isError ? (
            <View style={styles.containerModal}>
              <ScrollView style={styles.containerScroll}>
                <NotificationCard
                  icon="alert-octagon"
                  action={this.requestTeamInfo}
                />
              </ScrollView>
              {this.renderFooter()}
            </View>
          ) : (
            <View style={styles.containerModal}>
              <ScrollView style={styles.containerScroll}>
                <View style={styles.containerMainText}>
                  <Image
                    source={this.getImageApi()}
                    style={styles.photo}
                    width={width * 0.33}
                  />
                  <View style={styles.textItens}>
                    <Text style={styles.titleName}>{name}</Text>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {knownForDepartment}
                      </Text>
                    </View>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {this.getAge()}
                      </Text>
                    </View>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {placeOfBirth}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.titleInfo}>Biography</Text>
                <Text
                  style={[
                    styles.textSmall,
                    styles.textLineHeight,
                    styles.textJustify
                  ]}
                >
                  {biography}
                </Text>
              </ScrollView>
              {this.renderFooter()}
            </View>
          )}
        </View>
      </Modal>
    );
  }
};




const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: '#dfe6e9',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: height * 0.7
  },
  containerScroll: {
    padding: 22,
    paddingTop: 0,
    marginTop: 22
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  photo: {
    borderRadius: 8
  },
  containerMainText: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  titleInfo: {
    fontSize: fontSizeResponsive(2.4),
    fontWeight: 'bold',
    color: '#273c75',
    marginBottom: 7
  },
  titleName: {
    fontSize: fontSizeResponsive(2.6),
    fontWeight: 'bold',
    color: '#273c75',
    marginBottom: 10
  },
  textItens: {
    marginLeft: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmall: {
    fontSize: fontSizeResponsive(2.1),
    color: '#40739e'
  },
  textJustify: {
    textAlign: 'justify'
  },
  textLineHeight: {
    lineHeight: 20
  },
  containerTitleMargin: {
    marginBottom: 7
  },
  containerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#273c75',
    paddingVertical: 9.1,
    borderRadius: 100,
    width: '60%'
  },
  icon: {
    fontSize: fontSizeResponsive(2.8)
  }
});