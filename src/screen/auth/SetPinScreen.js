import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions, useFocusEffect } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { Toast } from '../../utils/Toast';
import { saveUserData, getUserData } from '../../utils/async/storage';
import { updatePin, updateNbfcPincode, updateCreditUpiPin } from '../../utils/apiHelper/Axios';

const SetPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mobile, bank, old_pin_code, token, isNbfc, isCredit } = route.params || {};
  console.log('SetPinScreen Params:', { mobile, bank, old_pin_code, token, isNbfc, isCredit });

  const [step, setStep] = useState(bank?.pin_code_length ? 2 : 1); // 1: Select Length, 2: Enter PIN
  const [pinLength, setPinLength] = useState(bank?.pin_code_length || 4);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const confirmPinRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.card : Colors.lightCard,
    border: isDark ? Colors.grey : Colors.lightBorder,
    selectedBg: isDark ? Colors.primaryLight : Colors.lightPrimaryBg,
  };

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step === 2) {
          setStep(1);
          setPin('');
          setConfirmPin('');
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [step])
  );

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setPin('');
      setConfirmPin('');
    } else {
      navigation.goBack();
    }
  };

  const handlePinChange = value => {
    setPin(value);
    if (value.length === pinLength) {
      confirmPinRef.current?.focus();
    }
  };

  const handleSetup = async () => {
    if (pin !== confirmPin) {
      showToast(I18n.t('pin_mismatch'));
      return;
    }

    try {
      const { token, old_pin_code, bank, isNbfc, isCredit } = route.params || {};
      
      let payload;
      let response;
      
      // Build payload based on account type
      if (isCredit) {
        // Credit UPI requires: bank_credit_upi, new_pin_code, new_pin_code_confirmation, token
        payload = {
          bank_credit_upi: bank?.id,
          new_pin_code: pin,
          new_pin_code_confirmation: confirmPin,
          ...(token && { token }),
        };
        console.log('Updating Credit UPI PIN with payload:', payload);
        response = await updateCreditUpiPin(payload);
      } else if (isNbfc) {
        // NBFC requires: account_id, new_pin_code, new_pin_code_confirmation, token
        payload = {
          account_id: bank?.id,
          new_pin_code: pin,
          new_pin_code_confirmation: confirmPin,
          ...(token && { token }),
        };
        console.log('Updating NBFC PIN with payload:', payload);
        response = await updateNbfcPincode(payload);
      } else {
        // Regular bank requires: account_id, new_pin_code, new_pin_code_confirmation, token, old_pin_code (optional)
        payload = {
          account_id: bank?.id,
          new_pin_code: pin,
          new_pin_code_confirmation: confirmPin,
          ...(token && { token }),
          ...(old_pin_code && { old_pin_code }),
        };
        console.log('Updating regular bank PIN with payload:', payload);
        response = await updatePin(payload);
      }
      
      showToast(response.data?.message || I18n.t('upi_setup_success') || "PIN set successfully"); 
      
      setTimeout(() => {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomePage' }],
            }),
          );
      }, 1000);

    } catch (error) {
      console.log('SetPinScreen Error:', error.response?.data || error.message);
      showToast(error.response?.data?.message || I18n.t('failed_save'));
    }
  };

  const handleSelectPin = length => {
    setPinLength(length);
    setStep(2);
  };

  const getOptionStyle = length => [
    styles.optionBox,
    { backgroundColor: themeColors.card, borderColor: themeColors.border },
    pinLength === length && {
      borderColor: Colors.primary,
      backgroundColor: themeColors.selectedBg,
      borderWidth: 2,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('set_new_pin')} onBack={handleBack} />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {step === 1 ? I18n.t('reset_pin_setup') : I18n.t('create_new_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {step === 1 
            ? I18n.t('reset_pin_description') 
            : I18n.t('create_secure_pin', { pinLength })}
        </Text>

        {step === 1 ? (
          /* Step 1: PIN Length Selector */
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={getOptionStyle(4)}
              onPress={() => handleSelectPin(4)}
            >
              <Text style={[styles.optionTitle, { color: themeColors.text }]}>
                {I18n.t('pin_4_digit')}
              </Text>
              <Text style={[styles.optionSub, { color: themeColors.subText }]}>
                {I18n.t('quick_convenient') || "Quick & Convenient"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getOptionStyle(6)}
              onPress={() => handleSelectPin(6)}
            >
              <Text style={[styles.optionTitle, { color: themeColors.text }]}>
                {I18n.t('pin_6_digit')}
              </Text>
              <Text style={[styles.optionSub, { color: themeColors.subText }]}>
                {I18n.t('enhanced_security') || "Enhanced Security"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Step 2: Enter PIN */
          <>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {I18n.t('enter_pin', { pinLength })}
            </Text>
            <View style={{ alignSelf: 'center' }}>
              <OTPInput
                code={pin}
                setCode={handlePinChange}
                length={pinLength}
                isSecure={true}
                key={`pin-${pinLength}`} // Force re-render on length change
              />
            </View>

            <Text style={[styles.label, { color: themeColors.text }]}>
              {I18n.t('confirm_pin')}
            </Text>
            <View style={{ alignSelf: 'center' }}>
              <OTPInput
                ref={confirmPinRef}
                code={confirmPin}
                setCode={setConfirmPin}
                length={pinLength}
                isSecure={true}
                key={`confirm-${pinLength}`} // Force re-render on length change
              />
            </View>

            <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
              <Button
                title={I18n.t('set_pin')}
                onPress={handleSetup}
                disabled={
                  pin.length !== pinLength ||
                  confirmPin.length !== pinLength
                }
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Toast */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
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
  optionContainer: {
    marginVertical: scaleUtils.scaleHeight(20),
  },
  optionBox: {
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(15),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  optionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
  },
  optionSub: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    marginTop: scaleUtils.scaleHeight(4),
  },
});

export default SetPinScreen;
