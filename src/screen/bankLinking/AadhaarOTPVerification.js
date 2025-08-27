import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInput from '../../component/OTPInput';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Button from '../../component/Button';
import I18n from '../../utils/language/i18n';

const AadhaarOTPVerification = ({ route }) => {
  const navigation = useNavigation();
  const { aadhaar } = route.params || {}; // Aadhaar passed from previous screen
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(45);

  const maskAadhaar = aadhaar => {
    if (!aadhaar || aadhaar.length < 4) return aadhaar;
    return `XXXX XXXX ${aadhaar.slice(-4)}`;
  };

  // 🔹 Countdown for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (code.length === 6) {
      // Alert.alert(I18n.t('otp_verified'), `${code}`);
      navigation.navigate('PanVerification');
    } else {
      Alert.alert(I18n.t('enter_valid_otp'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={I18n.t('verify_aadhaar')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Shield Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../assets/image/appIcon/identity.png')}
              style={styles.icon}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{I18n.t('verify_aadhaar')}</Text>
        <Text style={styles.subtitle}>{I18n.t('otp_sent_message')}</Text>

        {/* Aadhaar Number Box */}
        <View style={styles.aadhaarBox}>
          <View>
            <Text style={styles.aadhaarLabel}>{I18n.t('aadhaar_number')}</Text>
            <Text style={styles.aadhaarNumber}>
              {aadhaar ? maskAadhaar(aadhaar) : 'XXXX XXXX 4567'}
            </Text>
          </View>

          {/* Edit Aadhaar */}
          <TouchableOpacity
            style={styles.imageWarperStyle}
            onPress={() =>
              navigation.navigate('AadhaarVerification', { aadhaar })
            }
          >
            <Image
              source={require('../../assets/image/appIcon/edit.png')}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* OTP Input */}
        <Text style={styles.otpLabel}>{I18n.t('enter_otp')}</Text>
        <OTPInput code={code} setCode={setCode} length={6} />

        {/* Resend OTP */}
        <Text style={styles.resendText}>
          {I18n.t('didnt_receive_otp')}{' '}
          <Text style={styles.resendLink}>
            {I18n.t('resend_in')} 00:{timer < 10 ? `0${timer}` : timer}
          </Text>
        </Text>

        {/* Verify Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title={I18n.t('verify_otp')}
            onPress={handleVerify}
            disabled={code.length !== 6}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AadhaarOTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  iconCircle: {
    backgroundColor: Colors.white,
    padding: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(50),
  },
  icon: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
    tintColor: Colors.primary,
    resizeMode: 'contain',
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    marginVertical: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(40),
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  aadhaarBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: scaleUtils.scaleHeight(10),
    borderRadius: scaleUtils.scaleHeight(10),
    backgroundColor: Colors.secondaryBg,
  },
  aadhaarLabel: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
    color: Colors.grey,
  },
  aadhaarNumber: {
    fontSize: scaleUtils.scaleFont(15),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  editIcon: {
    width: scaleUtils.scaleHeight(10),
    height: scaleUtils.scaleHeight(10),
    tintColor: Colors.white,
  },
  otpLabel: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    marginTop: scaleUtils.scaleHeight(20),
  },
  resendText: {
    color: Colors.grey,
    fontSize: scaleUtils.scaleFont(12),
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(15),
  },
  resendLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonWrapper: {
    marginTop: scaleUtils.scaleHeight(40),
  },
  imageWarperStyle: {
    width: scaleUtils.scaleHeight(25),
    height: scaleUtils.scaleHeight(25),
    backgroundColor: Colors.primary,
    borderRadius: scaleUtils.scaleHeight(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
