import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import { getUserData } from '../../utils/async/storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { Toast } from '../../utils/Toast'; // ✅ Import Toast

const CreditUPISetup = () => {
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const isDark = scheme === 'dark';
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
    primary: Colors.primary,
  };

  const getStorageUserData = async () => {
    const userData = await getUserData();
    setPhone(userData?.user?.phone || '');
  };

  useEffect(() => {
    getStorageUserData();
  }, []);

  const sendOtpToFirebase = async () => {
    if (!phone) {
      setToast({ visible: true, message: 'Phone number not found!' });
      return;
    }

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      setToast({ visible: true, message: `OTP send successfully` });

      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);

      navigation.navigate('CreditOTPVerification', {
        verificationId: confirmation.verificationId,
        phone: formattedPhone,
      });
    } catch (error) {
      setToast({
        visible: true,
        message: 'Failed to send OTP. Please try again.',
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: themeColors.primary },
          ]}
        >
          <Image
            source={require('../../assets/image/homeIcon/balance.png')}
            style={styles.icon}
          />
        </View>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('activate_credit_upi')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('activate_credit_upi_desc')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={I18n.t('yes_activate')} onPress={sendOtpToFirebase} />
        <Button
          title={I18n.t('no_maybe')}
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: isDark ? Colors.secondaryBg : Colors.grey }}
        />
      </View>

      <Text style={[styles.bottomText, { color: themeColors.subText }]}>
        {I18n.t('bottom_info')}
      </Text>

      {/* ✅ Custom Toast */}
      <Toast visible={toast.visible} message={toast.message} isDark={isDark} />
    </SafeAreaView>
  );
};

export default CreditUPISetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(50),
  },
  iconContainer: {
    borderRadius: scaleUtils.scaleWidth(50),
    padding: scaleUtils.scaleWidth(20),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  icon: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
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
    marginTop: scaleUtils.scaleHeight(10),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  buttonContainer: {
    marginTop: scaleUtils.scaleHeight(40),
    alignItems: 'center',
    marginHorizontal: scaleUtils.scaleWidth(16),
  },
  bottomText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
});
