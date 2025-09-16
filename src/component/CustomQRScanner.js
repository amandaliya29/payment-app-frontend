import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, useColorScheme } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import * as ImagePicker from 'react-native-image-picker';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Button from './Button';

const CustomQRScanner = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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

  const handleReadCode = event => {
    setQrValue(event.nativeEvent.codeStringValue);
    Alert.alert('QR Code Found', event.nativeEvent.codeStringValue);
  };

  const toggleTorch = () => setTorchOn(prev => !prev);

  const openGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && response.assets?.length > 0) {
        Alert.alert('Image Selected', 'QR from gallery processing pending...');
      }
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
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

            {/* Blurred Overlay */}
            <View style={styles.overlay}>
              <View style={styles.topOverlay} />
              <View style={styles.centerRow}>
                <View style={styles.sideOverlay} />
                <View style={styles.scanBox}>
                  {/* 4 Corner Borders */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View style={styles.sideOverlay} />
              </View>
              <View style={styles.bottomOverlay} />
            </View>

            {/* Torch & Gallery Buttons ABOVE Scan Box */}
            <View style={styles.actionButtons}>
              <View style={{ flex: 1 }}>
                <Button
                  title={torchOn ? 'Torch On' : 'Torch Off'}
                  onPress={toggleTorch}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Gallery" onPress={openGallery} />
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>QR Code: {qrValue}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomQRScanner;

const BOX_SIZE = scaleUtils.scaleWidth(250);

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrapper: { flex: 1 },
  camera: { flex: 1, width: '100%' },

  /* Blur Overlay Outside Box */
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: { paddingTop: '25%', backgroundColor: 'rgba(0,0,0,0.6)' },
  centerRow: { flexDirection: 'row' },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  /* Scan Box Positioned 25% Up */
  scanBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    alignSelf: 'center',
    position: 'relative',
  },

  /* 4 Bright Corners */
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

  /* Buttons above Scan Box */
  actionButtons: {
    top: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scaleUtils.scaleHeight(16),
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(10),
    left: 0,
    columnGap: scaleUtils.scaleWidth(10),
    right: 0,
  },

  /* QR Result */
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
