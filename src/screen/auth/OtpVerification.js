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
import auth from '@react-native-firebase/auth';
import { Toast } from '../../utils/Toast';
import { loginUser } from '../../utils/apiHelper/Axios';
import { saveUserData } from '../../utils/async/storage';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { verificationId, mobile } = route.params || {};
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const [resending, setResending] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (code.length !== 6) {
      showToast(t('enter_valid_otp'));
      return;
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      await auth().signInWithCredential(credential);
      const idToken = await auth().currentUser.getIdToken();

      // ✅ Call backend login API here
      const loginResponse = await loginUser(idToken);

      if (loginResponse.status) {
        // Save user data in AsyncStorage
        await saveUserData({
          token: idToken,
          user: loginResponse.user || {}, // depends on API response
        });

        showToast(loginResponse.messages);
        navigation.replace('BankLinkScreen');
      } else {
        showToast('Login failed');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      showToast(error.message || t('otp_invalid'));
    }
  };

  const handleResend = async () => {
    if (timer !== 0 || resending) {
      showToast(t('please_wait_resend', { timer }));
      return;
    }

    setResending(true);
    setTimer(30);

    try {
      const phoneNumber = `+91${mobile}`;
      const unsubscribe = auth().verifyPhoneNumber(phoneNumber);

      unsubscribe.on('state_changed', phoneAuthSnapshot => {
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT:
            route.params.verificationId = phoneAuthSnapshot.verificationId;
            setResending(false);
            showToast(t('otp_sent_successfully'));
            break;

          case auth.PhoneAuthState.ERROR:
            showToast(t('otp_invalid'));
            setResending(false);
            break;
        }
      });
    } catch {
      showToast(t('otp_invalid'));
      setResending(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      <Toast visible={toastVisible} message={toastMessage} isDark={dark} />

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
          {t('otp_sent_message_mob')}
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
            onPress={handleVerifyOtp}
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

        <Text style={[styles.timer, { color: colors.text }]}>
          {`00:${timer < 10 ? `0${timer}` : timer}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: { flex: 1 },
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
