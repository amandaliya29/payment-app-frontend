import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import OTPInput from '../../component/OTPInput';
import Button from '../../component/Button';
import { Toast } from '../../utils/Toast';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NBFCActive } from '../../utils/apiHelper/Axios';
import { useDispatch } from 'react-redux';
import { setNbfcUpi } from '../../utils/redux/UserSlice';

const HbfCreditUpiVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { verificationId, phone } = route.params || {};
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Theme colors
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    cardBg: isDark ? Colors.secondary : Colors.cardGrey,
    primary: Colors.primary,
  };

  // Timer logic
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Resend OTP
  const handleResend = useCallback(async () => {
    try {
      setTimer(45);
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await auth().signInWithPhoneNumber(formattedPhone);
      showToast('OTP resent successfully');
    } catch (error) {
      showToast('Failed to resend OTP');
    }
  }, [phone]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // ✅ Step 1: Verify OTP with Firebase
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth().signInWithCredential(credential);

      // ✅ Step 2: Get Firebase Token
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not found after OTP verification.');
      }
      const token = await currentUser.getIdToken();

      // ✅ Step 3: Call NBFC Activation API
      const response = await NBFCActive({ token });

      // ✅ Step 4: Handle API Response
      if (response?.data) {
        console.log('NBFC Activation Response:', response.data);
        dispatch(setNbfcUpi(response.data));
        showToast(response?.data?.message || 'Activation successful!');
        navigation.navigate('HbfcCrditLoadingScreen');
      } else {
        showToast('Activation failed. Please try again.');
      }
    } catch (error) {
      console.log('Activation error:', error?.response || error);
      showToast('Invalid OTP or activation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('hbfc_otp_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Section */}
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
            {I18n.t('hbfc_activate_credit_upi')}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subText }]}>
            {I18n.t('hbfc_otp_instruction')}
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput code={otp} setCode={setOtp} length={6} />
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: themeColors.subText }]}>
            {I18n.t('hbfc_didnt_receive')}
          </Text>
          {timer > 0 ? (
            <Text style={[styles.resendTime, { color: themeColors.primary }]}>
              {I18n.t('hbfc_resend_in')} {timer}s
            </Text>
          ) : (
            <Text
              style={[styles.resendNow, { color: themeColors.primary }]}
              onPress={handleResend}
            >
              {I18n.t('hbfc_resend_now')}
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <Button
          title={
            loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              I18n.t('hbfc_verify_activate')
            )
          }
          disabled={otp.length !== 6 || loading}
          onPress={handleVerify}
        />

        {/* Terms & Conditions */}
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: themeColors.subText }]}>
            {I18n.t('hbfc_terms_condition')}
          </Text>
        </View>
      </ScrollView>

      {/* Toast Message */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

export default HbfCreditUpiVerification;

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
    padding: scaleUtils.scaleWidth(22),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  iconImage: {
    width: scaleUtils.scaleWidth(34),
    height: scaleUtils.scaleWidth(34),
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
  otpContainer: {
    alignSelf: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
