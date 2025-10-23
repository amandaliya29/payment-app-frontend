import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import OTPInput from '../../component/OTPInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../component/Button';
import auth from '@react-native-firebase/auth';
import { Toast } from '../../utils/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setCreditUpiData } from '../../utils/redux/UserSlice';
import { activateCreditUpi } from '../../utils/apiHelper/Axios';

const CreditOTPVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const dispatch = useDispatch();

  const { phone, verificationId: initialVerificationId } = route.params || {};
  const selectedBank = useSelector(state => state.user.selectedBank);

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(
    initialVerificationId || '',
  );
  const [toast, setToast] = useState({ visible: false, message: '' });

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
    primary: Colors.primary,
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const showToast = message => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);

      if (!verificationId) {
        showToast('Verification ID missing. Please resend OTP.');
        setLoading(false);
        return;
      }

      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth().signInWithCredential(credential);

      const idToken = await auth().currentUser.getIdToken();
      dispatch(setToken(idToken));

      // ✅ Call activateCreditUpi API after OTP verification
      if (selectedBank && idToken) {
        const payload = {
          token: idToken,
          bank_account: selectedBank.id,
        };

        try {
          const response = await activateCreditUpi(payload);
          if (response.data?.status && response.data?.data) {
            const upiData = response.data.data;
            dispatch(setCreditUpiData(upiData)); // store data in Redux
            showToast('Credit UPI activated successfully!');
            navigation.navigate('CreditUPILoadingScreen');
          } else {
            showToast(
              response.data?.messages || 'Activation failed. Please try again.',
            );
          }
        } catch (error) {
          showToast(
            error.response?.data?.messages || 'Failed to activate Credit UPI.',
          );
        }
      } else {
        showToast('Missing required data to activate Credit UPI.');
      }
    } catch (error) {
      setOtp('');
      showToast('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!phone) {
      showToast('Phone number missing.');
      return;
    }
    setTimer(45);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setVerificationId(confirmation.verificationId);
      showToast('A new OTP has been sent to your phone.');
    } catch (error) {
      console.log('Resend OTP Error:', error);
      showToast('Failed to resend OTP. Try again later.');
    }
  }, [phone]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('otp_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Image
              source={require('../../assets/image/homeIcon/card.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {I18n.t('activate_credit_upi')}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subText }]}>
            {I18n.t('otp_instruction')}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <OTPInput code={otp} setCode={setOtp} length={6} />
        </View>

        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: themeColors.subText }]}>
            {I18n.t('didnt_receive')}
          </Text>
          {timer > 0 ? (
            <Text style={[styles.resendTime, { color: themeColors.primary }]}>
              {I18n.t('resend_in')} {timer}s
            </Text>
          ) : (
            <Text
              style={[styles.resendNow, { color: themeColors.primary }]}
              onPress={handleResend}
            >
              {I18n.t('resend_now')}
            </Text>
          )}
        </View>

        <Button
          title={loading ? 'Verifying...' : I18n.t('verify_activate')}
          disabled={otp.length !== 6 || loading}
          onPress={handleVerify}
        />

        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: themeColors.subText }]}>
            {I18n.t('terms_condition')}
          </Text>
        </View>
      </ScrollView>

      <Toast visible={toast.visible} message={toast.message} isDark={isDark} />
    </SafeAreaView>
  );
};

export default CreditOTPVerification;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingBottom: scaleUtils.scaleHeight(20),
  },
  content: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(30),
  },
  iconContainer: {
    borderRadius: scaleUtils.scaleWidth(50),
    padding: scaleUtils.scaleWidth(20),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  iconImage: {
    width: scaleUtils.scaleWidth(28),
    height: scaleUtils.scaleWidth(28),
    tintColor: Colors.white,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  otpContainer: { alignSelf: 'center' },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(30),
    columnGap: scaleUtils.scaleWidth(8),
  },
  resendText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  resendTime: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
  },
  resendNow: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
});
