import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import scaleUtils from './Responsive';
import { Colors } from '../themes/Colors';

const { width } = Dimensions.get('window');

export const Toast = ({ visible, message, duration = 2000, isDark }) => {
  const [show, setShow] = useState(visible);
  const [fadeAnim] = useState(new Animated.Value(0));

  const themeColors = {
    background: isDark ? Colors.cardGrey : Colors.bg,
    text: isDark ? Colors.black : Colors.white,
  };

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShow(false));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: fadeAnim,
          backgroundColor: themeColors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: themeColors.text, fontFamily: 'Poppins-Medium' },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(50),
    alignSelf: 'center',
    // width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(16),
    borderRadius: scaleUtils.scaleWidth(8),
    elevation: 5,
  },
  text: {
    fontSize: scaleUtils.scaleFont(11),
  },
});
