import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { getUserData } from '../../utils/async/storage';

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
    divider: isDark ? Colors.grey : Colors.grey,
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
      // Check AsyncStorage after animation completes
      setTimeout(async () => {
        const userData = await getUserData();
        if (userData) {
          navigation.replace('BankLinkScreen'); // Already logged in
        } else {
          navigation.replace('MobileNumberEntry'); // Login flow
        }
      }, 1000); // Small delay for smooth transition
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
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
      <Animated.Text
        style={[styles.title, { opacity: scaleAnim, color: themeColors.text }]}
      >
        Cya Pay
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subTitle,
          { opacity: scaleAnim, color: themeColors.divider },
        ]}
      >
        We value your time
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
    marginTop: scaleUtils.scaleHeight(-30),
  },
  subTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    marginTop: scaleUtils.scaleHeight(0),
  },
});
