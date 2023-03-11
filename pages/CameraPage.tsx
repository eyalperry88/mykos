import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Image, Button } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default function CameraPage() {
  const cameraRef = useRef<Camera>(null)
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState(FlashMode.off)
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [capturing, setCapturing] = useState(false);

  const _grantPermission = async () => {
    await requestPermission();
    window.location.reload();
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Button onPress={_grantPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  const _switchCameraTypes = async (ct: CameraType) => {
    setCameraType(ct);
  }

  
  const _takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync()
      console.log(photo)
    }
  }

  const onCaptureIn = () => {
    setCapturing(true);
  };
  const onCaptureOut = () => {
    if (capturing) {
      setCapturing(false);
    }
  };
  const onLongCapture = () => {
    // not supported
  };
  const onShortCapture = () => {
    _takePhoto();
    setCapturing(false);
  };

  return (
    <View style={styles.container}>
      {!permission ? <Text>Please enable camera</Text> :
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <Image 
            style={styles.plantOutline}
            source={require('../assets/plant_mask.png')}
          />
          <Grid style={styles.bottomToolbar}>
            <Row>
                <Col style={styles.alignCenter}>
                    <TouchableOpacity onPress={() => setFlashMode( 
                        flashMode === FlashMode.on ? FlashMode.off : FlashMode.on 
                    )}>
                        <Ionicons
                            name={flashMode == FlashMode.on ? "md-flash" : 'md-flash-off'}
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity>
                </Col>
                <Col size={2} style={styles.alignCenter}>
                    <TouchableWithoutFeedback
                        onPressIn={onCaptureIn}
                        onPressOut={onCaptureOut}
                        onLongPress={onLongCapture}
                        onPress={onShortCapture}>
                        <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
                            {capturing && <View style={styles.captureBtnInternal} />}
                        </View>
                    </TouchableWithoutFeedback>
                </Col>
                <Col style={styles.alignCenter}>
                    <TouchableOpacity onPress={() => _switchCameraTypes(
                        cameraType === CameraType.back ? CameraType.back : CameraType.back
                    )}>
                        <Ionicons
                            name="md-camera-reverse"
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity>
                </Col>
            </Row>
          </Grid>
        </Camera>
      }
    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "black",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },

  plantOutline: {
    width: winWidth,
    height: winHeight
  },

  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomToolbar: {
      width: winWidth-80,
      position: 'absolute',
      height: 100,
      bottom: 0,
      left: 40
  },
  captureBtn: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderRadius: 60,
      borderColor: "#FFFFFF",
  },
  captureBtnActive: {
      width: 80,
      height: 80,
  },
  captureBtnInternal: {
      width: 76,
      height: 76,
      borderWidth: 2,
      borderRadius: 76,
      backgroundColor: "#699956",
      borderColor: "transparent",
  },
});
