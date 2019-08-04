import React from 'react';
import { StyleSheet, WebView } from 'react-native';
import Spinner from '../components/common/Spinner.js';


export default class WebViewScreen extends React.Component {
  
   renderLoading = () => <Spinner style={styles.container} />;

  render() {
    const { key } = this.props.navigation.state.params;

    return (
      <WebView
        useWebKit
        source={{ uri: `https://www.youtube.com/embed/${key}?start=0` }}
        startInLoadingState
        renderLoading={this.renderLoading}
      />
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});