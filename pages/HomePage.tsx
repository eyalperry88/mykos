// Example of Grid Image Gallery in React Native
// https://aboutreact.com/grid-image-gallery/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';

import ExpoFastImage from 'expo-fast-image';
import { Ionicons } from '@expo/vector-icons';
import { loadPhotos } from '../data';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const HomePage = () => {
  const [imageuri, setImageuri] = useState('');
  const [
    modalVisibleStatus, setModalVisibleStatus
  ] = useState(false);
  const [dataSource, setDataSource] = useState([] as any[]);

  const fetchPhotos = async () => {
    let URLs = await loadPhotos();
    let items = URLs.map((v, i) => {
      return {
        id: i,
        src: v
      };
    });
    setDataSource(items);
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  const showModalFunction = (visible:boolean, imageURL:string) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImageuri(imageURL);
    setModalVisibleStatus(visible);
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalVisibleStatus ? (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={modalVisibleStatus}
          onRequestClose={() => {
            showModalFunction(!modalVisibleStatus, '');
          }}>
          <View style={styles.modelStyle}>
            <ExpoFastImage
              style={styles.fullImageStyle}
              source={{uri: imageuri}}
              resizeMode={"contain"}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                showModalFunction(!modalVisibleStatus, '');
              }}>
            <Ionicons name='close' size={35} color='white' />
            </TouchableOpacity>
          </View>
        </Modal>
      ) : (
        <View style={styles.container}>
          <Image 
            style={styles.logoImage}
            source={require('../assets/logo.png')}
            resizeMode="stretch"
          />
          <FlatList
            data={dataSource}
            renderItem={({item}) => (
              <View style={styles.imageContainerStyle}>
                <TouchableOpacity
                  key={item.id}
                  style={{flex: 1}}
                  onPress={() => {
                    showModalFunction(true, item.src);
                  }}>
                  <ExpoFastImage
                    style={styles.imageStyle}
                    source={{
                      uri: item.src,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: 'white',
    backgroundColor: 'green',
  },
  logoImage: {
    width: winWidth,
    height: 42
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 50,
    right: 20,
    position: 'absolute',
  },
});