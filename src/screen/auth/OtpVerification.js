import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/language/i18n';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mobile } = route.params || {};
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);

  const { t } = useTranslation();
  const { colors, dark } = useTheme(); // 👈 theme colors

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = () => {
    if (code.length === 6) {
      console.log('Entered OTP:', code);
      navigation.navigate('BankLinkScreen');
    } else {
      alert(t('alert_invalid_otp'));
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      console.log('Resend OTP');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      <Header
        title={t('otp_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {t('verify_mobile_number')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {t('otp_sent_message')}
        </Text>

        <Text style={[styles.edit, { color: colors.text }]}>
          {t('tap_edit_number')}
        </Text>
        <View style={styles.numberEditTextStyle}>
          <Text style={[styles.phone, { color: colors.text }]}>
            +91 {mobile}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace('MobileNumberEntry', { mobile })}
          >
            <Image
              style={[styles.editIcon, { tintColor: Colors.primary }]}
              source={require('../../assets/image/appIcon/edit.png')}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.enterOtp, { color: colors.text }]}>
          {t('enter_otp')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput code={code} setCode={setCode} length={6} />
        </View>

        <View style={{ marginVertical: scaleUtils.scaleHeight(16) }}>
          <Button
            title={t('verify_continue')}
            onPress={handleVerify}
            disabled={code.length !== 6}
          />
        </View>

        <Text style={[styles.resend, { color: colors.text }]}>
          {t('didnt_receive_otp')}{' '}
          <Text
            style={[
              styles.link,
              { color: timer === 0 ? Colors.primary : Colors.grey },
            ]}
            onPress={handleResend}
          >
            {t('resend')}
          </Text>
        </Text>

        {/* Timer */}
        <Text style={[styles.timer, { color: colors.text }]}>
          {`00:${timer < 10 ? `0${timer}` : timer}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(25),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    textAlign: 'center',
  },
  phone: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
  edit: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    marginTop: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
  },
  resend: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(15),
  },
  link: {
    fontFamily: 'Poppins-SemiBold',
    textDecorationLine: 'underline',
  },
  timer: {
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(6),
    marginBottom: scaleUtils.scaleHeight(60),
    fontSize: scaleUtils.scaleFont(13),
  },
  numberEditTextStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scaleUtils.scaleHeight(6),
    marginBottom: scaleUtils.scaleHeight(8),
    columnGap: scaleUtils.scaleWidth(10),
  },
  editIcon: {
    width: scaleUtils.scaleWidth(13),
    height: scaleUtils.scaleWidth(13),
    resizeMode: 'contain',
  },
  enterOtp: {
    fontSize: scaleUtils.scaleFont(16),
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(26),
  },
});

export default OtpVerification;
