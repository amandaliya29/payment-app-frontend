import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';

const SetPinPage = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const pinLength = 4;
  const confirmPinRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    tipBox: isDark ? Colors.secondary : Colors.cardGrey,
  };

  // When PIN is completed, focus on Confirm PIN
  const handlePinChange = val => {
    setPin(val);
    if (val.length === pinLength) {
      confirmPinRef.current?.focus(); // Auto focus confirm PIN field
    }
  };

  const handleSetup = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'HomePage' }, { name: 'CreditUPIPage' }],
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('credit_upi_setup')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('set_credit_upi_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('upi_pin_description')}
        </Text>

        {/* Enter PIN */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_credit_upi_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            code={pin}
            setCode={handlePinChange}
            length={pinLength}
            isSecure={true}
          />
        </View>

        {/* Confirm PIN */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('confirm_credit_upi_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            ref={confirmPinRef}
            code={confirmPin}
            setCode={setConfirmPin}
            length={pinLength}
            isSecure={true}
          />
        </View>

        {/* Button */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('set_pin_continue')}
            onPress={handleSetup}
            disabled={
              pin.length !== pinLength ||
              confirmPin.length !== pinLength ||
              pin !== confirmPin
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: scaleUtils.scaleWidth(20) },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  label: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(10),
  },
  tipBox: {
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingVertical: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(14),
  },
  tipTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleWidth(6),
  },
  tipText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
});

export default SetPinPage;
