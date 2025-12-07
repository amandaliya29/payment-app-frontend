import { useNavigation, useTheme,useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import Input from '../../component/Input';
import Button from '../../component/Button';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../themes/Colors';
import auth from '@react-native-firebase/auth';
import { Toast } from '../../utils/Toast';
import Header from '../../component/Header';

const ForgotPasswordPhoneScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedBank, isNbfc, isCredit } = route.params || {};
  const { t } = useTranslation();
  const { colors, dark } = useTheme();

  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleProceed = async () => {
    if (mobile.length !== 10) {
      showToast(t('alert_invalid_number'));
      return;
    }

    try {
      setLoading(true);
      const phoneNumber = `+91${mobile}`;
      const unsubscribe = auth().verifyPhoneNumber(phoneNumber);

      unsubscribe.on('state_changed', phoneAuthSnapshot => {
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT:
            setLoading(false);
            showToast(t('otp_sent_successfully'));
            navigation.navigate('ForgotPasswordOtpScreen', {
              verificationId: phoneAuthSnapshot.verificationId,
              mobile,
              selectedBank,
              isNbfc,
              isCredit,
            });
            break;

          case auth.PhoneAuthState.AUTO_VERIFIED:
            // For forgot password, we might still want to force OTP entry or handle auto-verify differently
            // But usually, we just let them proceed to SetPin if verified
             setLoading(false);
             navigation.navigate('ForgotPasswordOtpScreen', {
              verificationId: phoneAuthSnapshot.verificationId,
              mobile,
              selectedBank,
              isNbfc,
              isCredit,
              autoVerified: true
            });
            break;

          case auth.PhoneAuthState.ERROR:
            setLoading(false);
            showToast(t('otp_invalid'));
            break;
        }
      });
    } catch (error) {
      setLoading(false);
      showToast(t('otp_invalid'));
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
      
      <Header title={t('forgot_password')} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        <View style={styles.imagesWarperStyle}>
          <Image
            source={require('../../assets/image/appIcon/phone.png')}
            style={[styles.imageStyle, { tintColor: Colors.primary }]}
          />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          {t('enter_mobile_number')}
        </Text>
        <Text style={[styles.subText, { color: colors.text }]}>
          {t('verification_message')}
        </Text>

        <Input
          label={t('mobile_number_label')}
          value={mobile}
          onChange={setMobile}
          placeholder={t('mobile_number_placeholder')}
          keyboardType="phone-pad"
          maxLength={10}
          errorText={
            mobile.length > 0 && mobile.length < 10
              ? t('invalid_mobile_number')
              : ''
          }
        />

        <View style={{ marginTop: scaleUtils.scaleHeight(40) }}>
          <Button
            title={t('proceed')}
            onPress={handleProceed}
            loading={loading}
            disabled={mobile.length !== 10 || loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordPhoneScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageStyle: { width: '100%', height: '100%', resizeMode: 'contain' },
  imagesWarperStyle: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginVertical: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
  },
  heading: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
  subText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    marginBottom: scaleUtils.scaleHeight(40),
  },
});
