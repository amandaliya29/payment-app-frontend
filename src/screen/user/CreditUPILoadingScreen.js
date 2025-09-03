import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import { useNavigation } from '@react-navigation/native';

const CreditUPILoadingScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.black,
    primary: Colors.primary,
    info: isDark ? Colors.secondary : Colors.white,
    card: isDark ? Colors.secondaryBg : Colors.cardGrey,
    progressBg: isDark ? Colors.darkGrey : Colors.grey, // Background bar color
  };

  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('CreditUPIStatusScreen');
    });
  }, [navigation]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* <Header title={I18n.t('upi_setup')} onBack={() => navigation.goBack()} /> */}

      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.title, { color: themeColors.primary }]}>
          {I18n.t('activating_credit_upi')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('please_wait')}
        </Text>

        {/* Background Progress Bar */}
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: themeColors.progressBg },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: themeColors.primary, width: progressWidth },
            ]}
          />
        </View>

        <View style={[styles.infoBox, { backgroundColor: themeColors.info }]}>
          <Text style={[styles.infoTitle, { color: themeColors.primary }]}>
            {I18n.t('important')}
          </Text>
          <Text style={[styles.infoText, { color: themeColors.subText }]}>
            {I18n.t('upi_loading_message')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreditUPILoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    margin: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(8),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(16),
  },
  progressContainer: {
    height: scaleUtils.scaleHeight(8),
    width: '100%',
    borderRadius: scaleUtils.scaleHeight(12),
    overflow: 'hidden',
    marginVertical: scaleUtils.scaleHeight(16),
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(12),
    marginTop: scaleUtils.scaleHeight(12),
    width: '100%',
  },
  infoTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(4),
  },
  infoText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
});
