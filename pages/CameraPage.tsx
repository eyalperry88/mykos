import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Image, Button, Platform, ActivityIndicator } from 'react-native';
import { Camera, CameraType, FlashMode, ImageType } from 'expo-camera';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {uploadPhotoToFirebase} from '../data';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function CameraPage() {
  const cameraRef = useRef<Camera>(null)
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState(FlashMode.off)
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [capturing, setCapturing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoData, setPhotoData] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  
  const pid = searchParams.get("plant_id");

  if (!pid || !(Number(pid) > 0 && Number(pid) < 9999)) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{color: 'white', fontSize: 17, padding: 20}}>Invalid PlantQR Code!<br/>Please scan again.</Text>
      </View>
    );
  }


  // permissions stuff
  if (!hasPermission && Platform.OS === 'web') {
    setHasPermission(true);
  }
    

  const _grantPermission = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();
    if (permission) {
      setHasPermission(permission.granted);
    }
    window.location.reload();

  }

  if (!hasPermission) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Button onPress={_grantPermission} title="Grant Camera Permission" />
      </View>
    );
  }
  // ------------------------

  const onCameraReady = () => {
    setIsCameraReady(true);
  };


  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType(prevCameraType =>
      prevCameraType === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };
  
  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { 
        quality: 0.8, 
        base64: true,
        imageType: ImageType.jpg
      };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;

      if (source && pid) {
        setPhotoData(source);
        await cameraRef.current.pausePreview();
        setIsPreview(true);
      }
    }
  }

  const uploadPhoto = async () => {
    if (!uploading && pid) {
      setUploading(true);
      const ret = await uploadPhotoToFirebase(pid, photoData);

      if (cameraRef.current) {
        await cameraRef.current.resumePreview();
        setIsPreview(false);
      }

      setUploading(false);
      if (ret) {
        navigate("/");
      }
    }
    

  }

  const cancelPreview = async () => {
    if (cameraRef.current) {
      await cameraRef.current.resumePreview();
      setIsPreview(false);
    }
  };

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
    takePhoto();
    setCapturing(false);
  };

  const goToHome = () => {
    navigate("/");
  }

  return (
    <View style={styles.container}>
      {!hasPermission ? <Text>Please enable camera</Text> :
        <Camera 
          style={styles.camera} 
          type={cameraType} 
          flashMode={flashMode} 
          ref={cameraRef}
          onCameraReady={onCameraReady}
        >
          <TouchableWithoutFeedback
                onPress={goToHome}>
                <View style={styles.goToHome}>
                    
                </View>
            </TouchableWithoutFeedback>
          <Image 
            style={styles.plantOutline}
            source={require('../assets/plant_outline.png')}
            resizeMode="stretch"
          />
          
          
          {isPreview && (
          <Grid style={styles.bottomToolbar2}>
            <Row>
                <Col style={styles.alignCenter}>
                  <TouchableOpacity onPress={uploadPhoto} >
                    <Ionicons name='cloud-upload' size={48} color="white" />
                  </TouchableOpacity>
                </Col>
                <Col style={styles.alignCenter}>
                  <TouchableOpacity onPress={cancelPreview} activeOpacity={0.7} >
                    <Ionicons name='close' size={30} color='white' />
                  </TouchableOpacity>
                </Col>

            </Row>
          </Grid>
          )}
          {!isPreview && (
          <Grid style={styles.bottomToolbar}>
            <Row>
                <Col style={styles.alignCenter}>
                    {/* <TouchableOpacity onPress={() => setFlashMode( 
                        flashMode === FlashMode.on ? FlashMode.off : FlashMode.on 
                    )}>
                        <Ionicons
                            name={flashMode == FlashMode.on ? "md-flash" : 'md-flash-off'}
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity> */}
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
                    {/* <TouchableOpacity onPress={switchCamera}>
                        <Ionicons
                            name="md-camera-reverse"
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity> */}
                </Col>
              </Row>
            </Grid>
            )}
        </Camera>
      }
      {uploading && <View style={styles.uploading}><ActivityIndicator size="large"  color="#fff" /></View>}

    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

  },
  uploading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: winHeight/2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  goToHome: {
    width: winWidth,
    height: 42,
    position: 'absolute',
    top: 0,
    zIndex: 999
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
      width: winWidth-120,
      position: 'absolute',
      height: 100,
      bottom: 30,
      left: 65
  },
  bottomToolbar2: {
    width: winWidth-120,
    position: 'absolute',
    height: 100,
    bottom: 30,
    left: 70
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
