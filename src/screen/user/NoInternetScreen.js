import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';

const NoInternetScreen = ({ onRetry }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
    divider: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Image
        source={require('../../assets/image/appIcon/no-internet.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: themeColors.text }]}>
        No Internet Connection
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.subText }]}>
        Please check your internet and try again
      </Text>

      {/* <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: themeColors.btnColor }]}
        onPress={onRetry}
      >
        <Text style={[styles.retryText, { color: themeColors.text }]}>
          Retry
        </Text>
      </TouchableOpacity> */}
      <Button title={'Retry'} onPress={onRetry} />
    </SafeAreaView>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  image: {
    width: scaleUtils.scaleWidth(160),
    height: scaleUtils.scaleHeight(160),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(5),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(20),
  },
  retryButton: {
    paddingVertical: scaleUtils.scaleHeight(10),
    paddingHorizontal: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(8),
  },
  retryText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
  },
});
