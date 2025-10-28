import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native'; // ✅ added
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';
import I18n from '../utils/language/i18n';
import { scanBankQr } from '../utils/apiHelper/Axios';
import { Toast } from '../utils/Toast';

const CustomQRScanner = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation(); // ✅ added

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.secondaryBg : Colors.white,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  const cameraRef = useRef(null);
  const [qrValue, setQrValue] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // console.log('qrValue', qrValue);

  // ✅ Navigate after scan success
  const navigateToEnterAmount = code => {
    setQrValue(code);
    // showToast(`${I18n.t('qr_found')}: ${code}`);

    // Add slight delay so toast is visible before navigating
    setTimeout(() => {
      navigation.navigate('EnterAmountScreen', {
        user: { code }, // static user
      });
    }, 800);
  };

  const handleScan = async image => {
    try {
      setLoading(true);

      const res = await scanBankQr(image);
      if (!res.data?.status) {
        showToast(res.data?.messages);
      }

      const code = res.data?.data?.code;
      navigateToEnterAmount(code);
    } catch (error) {
      showToast(error.response?.data?.messages || 'Failed to scan QR');
    } finally {
      setLoading(false);
    }
  };

  const handleReadCode = event => {
    const code = event.nativeEvent.codeStringValue;
    navigateToEnterAmount(code);
  };

  const toggleTorch = () => setTorchOn(prev => !prev);

  const openGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.length > 0) {
        const image = response.assets[0];
        handleScan(image);
      }
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: Colors.white, marginTop: 10 }}>
            {I18n.t('processing_pending')}
          </Text>
        </View>
      )}
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

          <View style={styles.actionButtons}>
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

            <TouchableOpacity style={styles.iconWrapper} onPress={toggleTorch}>
              <Image
                source={
                  torchOn
                    ? require('../assets/image/appIcon/tourch_on.png')
                    : require('../assets/image/appIcon/tourch_off.png')
                }
                style={styles.iconButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </View>
  );
};

export default CustomQRScanner;

const BOX_SIZE = scaleUtils.scaleWidth(240);

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrapper: { flex: 1 },
  camera: { flex: 1, width: '100%' },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
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
    borderWidth: 3,
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
  actionButtons: {
    top: '55%',
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scaleUtils.scaleHeight(16),
    position: 'absolute',
    left: 0,
    right: 0,
  },
  iconWrapper: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(30),
  },
  iconButton: {
    width: scaleUtils.scaleWidth(23),
    height: scaleUtils.scaleWidth(23),
    tintColor: Colors.white,
  },
  galleryIcon: {
    width: scaleUtils.scaleWidth(18),
    height: scaleUtils.scaleWidth(18),
    tintColor: Colors.white,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(8),
    height: scaleUtils.scaleHeight(34),
    width: '54%',
    columnGap: scaleUtils.scaleWidth(10),
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
});
