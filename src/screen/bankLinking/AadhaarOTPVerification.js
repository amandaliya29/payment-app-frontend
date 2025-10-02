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
import { useNavigation, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInput from '../../component/OTPInput';
import Header from '../../component/Header';
import scaleUtils from '../../utils/Responsive';
import Button from '../../component/Button';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';

const AadhaarOTPVerification = ({ route }) => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme(); // 👈 theme hook
  const { aadhaar, Itemid } = route.params || {};
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
      navigation.navigate('PanVerification', { aadhaar, Itemid });
    } else {
      Alert.alert(I18n.t('enter_valid_otp'));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
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
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: dark ? Colors.white : colors.card },
            ]}
          >
            <Image
              source={require('../../assets/image/appIcon/identity.png')}
              style={[styles.icon, { tintColor: Colors.primary }]}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {I18n.t('verify_aadhaar')}
        </Text>
        <Text style={[styles.subtitle, { color: Colors.grey }]}>
          {I18n.t('otp_sent_message')}
        </Text>

        {/* Aadhaar Number Box */}
        <View
          style={[
            styles.aadhaarBox,
            { backgroundColor: dark ? Colors.secondaryBg : colors.card },
          ]}
        >
          <View>
            <Text style={[styles.aadhaarLabel, { color: Colors.grey }]}>
              {I18n.t('aadhaar_number')}
            </Text>
            <Text style={[styles.aadhaarNumber, { color: colors.text }]}>
              {aadhaar ? maskAadhaar(aadhaar) : 'XXXX XXXX 4567'}
            </Text>
          </View>

          {/* Edit Aadhaar */}
          <TouchableOpacity
            style={[
              styles.imageWarperStyle,
              { backgroundColor: Colors.primary },
            ]}
            onPress={() =>
              navigation.navigate('AadhaarVerification', { aadhaar })
            }
          >
            <Image
              source={require('../../assets/image/appIcon/edit.png')}
              style={[
                styles.editIcon,
                { tintColor: dark ? Colors.white : colors.background },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* OTP Input */}
        <Text style={[styles.otpLabel, { color: colors.text }]}>
          {I18n.t('enter_otp')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput code={code} setCode={setCode} length={6} />
        </View>

        {/* Resend OTP */}
        <Text style={[styles.resendText, { color: Colors.grey }]}>
          {I18n.t('didnt_receive_otp')}{' '}
          <Text style={[styles.resendLink, { color: Colors.primary }]}>
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
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  iconCircle: {
    padding: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(50),
  },
  icon: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
    resizeMode: 'contain',
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
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
    padding: scaleUtils.scaleHeight(10),
    borderRadius: scaleUtils.scaleHeight(10),
  },
  aadhaarLabel: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
  },
  aadhaarNumber: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-Medium',
  },
  editIcon: {
    width: scaleUtils.scaleHeight(10),
    height: scaleUtils.scaleHeight(10),
    resizeMode: 'contain',
  },
  otpLabel: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    marginTop: scaleUtils.scaleHeight(20),
  },
  resendText: {
    fontSize: scaleUtils.scaleFont(12),
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(15),
  },
  resendLink: {
    fontFamily: 'Poppins-SemiBold',
  },
  buttonWrapper: {
    marginTop: scaleUtils.scaleHeight(40),
  },
  imageWarperStyle: {
    width: scaleUtils.scaleHeight(25),
    height: scaleUtils.scaleHeight(25),
    borderRadius: scaleUtils.scaleHeight(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
