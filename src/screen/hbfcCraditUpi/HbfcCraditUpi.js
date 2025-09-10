import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import Button from '../../component/Button';
import Header from '../../component/Header';
import { useNavigation } from '@react-navigation/native';

const HbfcCraditUpi = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    tipBox: isDark ? Colors.secondary : Colors.cardGrey,
    buttonBg: isDark ? Colors.secondary : Colors.primary,
    buttonText: Colors.white,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.imagesWarperStyle}>
          <Image
            source={require('../../assets/image/appIcon/creditUpi.png')}
            style={[styles.imageStyle, { tintColor: Colors.primary }]}
          />
        </View>

        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('credit_upi')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          {I18n.t('pay_now_settle_later')}
        </Text>
        <Text style={[styles.description, { color: themeColors.subText }]}>
          {I18n.t('upi_desc')}
        </Text>

        {/* <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.buttonBg }]}
        >
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {I18n.t('activate_credit_upi')}
          </Text>
        </TouchableOpacity> */}

        <View style={styles.buttonStyle}>
          <Button
            title={I18n.t('activate_credit_upi')}
            onPress={() => navigation.navigate('CreditUPITerms')}
          />
        </View>

        <Text style={[styles.footer, { color: themeColors.subText }]}>
          {I18n.t('upi_powered_by')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: scaleUtils.scaleHeight(60),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(8),
    textAlign: 'center',
  },
  imageStyle: { width: '100%', height: '100%', resizeMode: 'contain' },
  imagesWarperStyle: {
    width: scaleUtils.scaleWidth(100),
    height: scaleUtils.scaleWidth(100),
    marginVertical: scaleUtils.scaleHeight(20),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    // marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  description: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(24),
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  footer: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    // marginTop: '20%',
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(20),
  },
  buttonStyle: {
    paddingVertical: scaleUtils.scaleHeight(14),
    width: '100%',
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(40),
  },
});

export default HbfcCraditUpi;
