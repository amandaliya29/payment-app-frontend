import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import * as ImagePicker from 'react-native-image-picker';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';
import I18n from '../utils/language/i18n';
import { useNavigation } from '@react-navigation/native';

const CustomQRScanner = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
  };

  const cameraRef = useRef(null);
  const [qrValue, setQrValue] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleReadCode = event => {
    setQrValue(event.nativeEvent.codeStringValue);
    Alert.alert(I18n.t('qr_found'), event.nativeEvent.codeStringValue);
  };

  const toggleTorch = () => setTorchOn(prev => !prev);

  const openGallery = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      response => {
        if (response.didCancel) {
          Alert.alert(I18n.t('gallery_cancelled'), I18n.t('no_image_selected'));
        } else if (response.errorCode) {
          Alert.alert(
            I18n.t('error'),
            response.errorMessage || I18n.t('something_went_wrong'),
          );
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setSelectedImage(uri);
          Alert.alert(
            I18n.t('gallery_selected'),
            I18n.t('image_selected_successfully'),
          );
        }
      },
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Top Custom Header */}
      <View style={styles.topHeader}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require('../assets/image/appIcon/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Right side buttons */}
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={toggleTorch} style={styles.iconWrapper}>
            <Image
              source={
                torchOn
                  ? require('../assets/image/appIcon/tourch_on.png')
                  : require('../assets/image/appIcon/tourch_off.png')
              }
              style={styles.iconButton}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('QR Button Pressed')}
            style={styles.iconWrapper}
          >
            <Image
              source={require('../assets/image/appIcon/qr.png')}
              style={styles.QrIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera */}
      {!qrValue ? (
        <>
          <View style={styles.cameraWrapper}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              scanBarcode={true}
              onReadCode={handleReadCode}
              showFrame={false}
              torchMode={torchOn ? 'on' : 'off'}
            />

            {/* Overlays */}
            <View style={styles.overlay}>
              <View style={styles.topOverlay} />
              <View style={styles.centerRow}>
                <View style={styles.sideOverlay} />
                <View style={styles.scanBox}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View style={styles.sideOverlay} />
              </View>
              <View style={styles.bottomOverlay} />
            </View>

            {/* Gallery Button at Bottom (unchanged) */}
            <View style={styles.bottomGalleryButton}>
              <TouchableOpacity
                onPress={openGallery}
                style={styles.galleryButton}
              >
                <Image
                  source={require('../assets/image/appIcon/gallery.png')}
                  style={styles.galleryIcon}
                />
                <Text style={styles.galleryText}>{I18n.t('gallery')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show selected image if available */}
          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {I18n.t('qr_code')}: {qrValue}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomQRScanner;

const BOX_SIZE = scaleUtils.scaleWidth(240);

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrapper: { flex: 1 },
  camera: { flex: 1, width: '100%' },

  // Top Header
  topHeader: {
    position: 'absolute',
    top: scaleUtils.scaleHeight(10),
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleUtils.scaleWidth(16),
    alignItems: 'center',
  },
  backButton: { padding: scaleUtils.scaleWidth(8) },
  backIcon: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    tintColor: Colors.white,
  },
  rightButtons: {
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(10),
  },
  iconWrapper: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(20),
  },
  iconButton: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    tintColor: Colors.white,
  },

  // Overlay
  overlay: { ...StyleSheet.absoluteFillObject },
  topOverlay: { paddingTop: '25%', backgroundColor: 'rgba(0,0,0,0.6)' },
  centerRow: { flexDirection: 'row' },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  scanBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    alignSelf: 'center',
    position: 'relative',
  },

  corner: {
    position: 'absolute',
    width: scaleUtils.scaleWidth(35),
    height: scaleUtils.scaleWidth(35),
    borderColor: Colors.primary,
    borderWidth: scaleUtils.scaleWidth(3),
    margin: scaleUtils.scaleHeight(-10),
    zIndex: 1,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: scaleUtils.scaleWidth(10),
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: scaleUtils.scaleWidth(10),
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: scaleUtils.scaleWidth(10),
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: scaleUtils.scaleWidth(10),
  },
  // Bottom Gallery Button
  bottomGalleryButton: {
    position: 'absolute',
    top: '54%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(8),
    height: scaleUtils.scaleHeight(34),
    width: '50%',
    columnGap: scaleUtils.scaleWidth(10),
  },
  galleryIcon: {
    width: scaleUtils.scaleWidth(18),
    height: scaleUtils.scaleWidth(18),
    tintColor: Colors.white,
  },
  QrIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
    tintColor: Colors.white,
  },
  galleryText: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
  },

  resultBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  resultText: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  previewContainer: {
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(20),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewImage: {
    width: scaleUtils.scaleWidth(150),
    height: scaleUtils.scaleWidth(150),
    borderRadius: scaleUtils.scaleWidth(8),
  },
});
