import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';

const SplashScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();

  // Define theme colors
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Run animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation complete
      setTimeout(() => {
        navigation.replace('MobileNumberEntry');
      }, 2000); // 2 seconds
    });
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Animated.Image
        source={require('../../assets/image/appIcon/appLogo.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.Text
        style={[styles.title, { opacity: fadeAnim, color: themeColors.text }]}
      >
        Quick Pay
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scaleUtils.scaleWidth(200),
    height: scaleUtils.scaleWidth(200),
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(-20),
  },
});
