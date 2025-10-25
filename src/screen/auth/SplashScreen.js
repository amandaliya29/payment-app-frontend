import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { getUserData } from '../../utils/async/storage';

const SplashScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const notificationScreen = route.params?.notificationScreen;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      const userData = await getUserData();
      if (!userData) {
        navigation.replace('MobileNumberEntry');
        return;
      }

      if (notificationScreen) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'HomePage' },
              {
                name: notificationScreen.screen,
                params: { transaction_id: notificationScreen.transaction_id },
              },
            ],
          }),
        );
      } else {
        navigation.replace('HomePage');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation, notificationScreen]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.bg : Colors.white },
      ]}
    >
      <Animated.Image
        source={require('../../assets/image/appIcon/appLogo.png')}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
      <Animated.Text
        style={[
          styles.title,
          { opacity: scaleAnim, color: isDark ? Colors.white : Colors.black },
        ]}
      >
        Cya Pay
      </Animated.Text>
      <Animated.Text
        style={[styles.subTitle, { opacity: scaleAnim, color: Colors.grey }]}
      >
        We value your time
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: scaleUtils.scaleWidth(200),
    height: scaleUtils.scaleWidth(200),
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-SemiBold',
    marginTop: -30,
  },
  subTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
});
