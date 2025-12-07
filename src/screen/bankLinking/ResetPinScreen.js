import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { updatePin, updateCreditUpiPin, updateNbfcPincode } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast';

const ResetPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    bank,
    old_pin_code,
    isCredit,
    isNbfc,
  } = route.params || {};

  const [selectedPinLength, setSelectedPinLength] = useState(
    bank?.pin_code_length || 4,
  );
  const [oldPinLength] = useState(bank?.pin_code_length || 4); // Fixed - based on current bank PIN
  const [oldPin, setOldPin] = useState(old_pin_code || '');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const newPinRef = useRef(null);
  const confirmPinRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleOldPinChange = value => {
    setOldPin(value);
    if (value.length === parseInt(oldPinLength)) {
      newPinRef.current?.focus();
    }
  };

  const handleNewPinChange = value => {
    setNewPin(value);
    if (value.length === parseInt(selectedPinLength)) {
      confirmPinRef.current?.focus();
    }
  };

  const handlePinLengthSelect = length => {
    setSelectedPinLength(length);
    // Only clear new PIN fields when changing length, NOT old PIN
    setNewPin('');
    setConfirmPin('');
  };

  const resetToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomePage' }],
      }),
    );
  };

  const handleResetPin = async () => {
    // Validate old PIN (uses current bank PIN length)
    if (oldPin.length !== parseInt(oldPinLength)) {
      showToast(I18n.t('error_invalid_length', { pinLength: oldPinLength }));
      return;
    }

    // Validate new PIN (uses selected PIN length)
    if (newPin.length !== parseInt(selectedPinLength)) {
      showToast(I18n.t('error_invalid_length', { pinLength: selectedPinLength }));
      return;
    }

    // Validate confirm PIN
    if (confirmPin.length !== parseInt(selectedPinLength)) {
      showToast(I18n.t('error_invalid_length', { pinLength: selectedPinLength }));
      return;
    }

    // Check if new PIN and confirm PIN match
    if (newPin !== confirmPin) {
      showToast(I18n.t('pin_mismatch'));
      return;
    }

    // Check if old PIN and new PIN are different
    if (oldPin === newPin) {
      showToast('New PIN must be different from old PIN');
      return;
    }

    setIsLoading(true);

    try {
      let payload = {
        old_pin_code: oldPin,
      };

      if (isNbfc) {
       
        payload.new_pin_code = newPin;
        payload.new_pin_code_confirmation = confirmPin;
        console.log('NBFC bank object:', bank);
        
        if (bank?.id) {
          payload.account_id = bank.id;
        }
      } else if (isCredit) {

        payload.new_pin_code = newPin;
        payload.new_pin_code_confirmation = confirmPin;
        
        console.log('=== Credit UPI Debug ===');
        console.log('Full bank object:', JSON.stringify(bank, null, 2));
        console.log('bank.id:', bank?.id);
        console.log('bank.credit_upi_id:', bank?.credit_upi_id);
        console.log('bank.bank_credit_upi:', bank?.bank_credit_upi);
        console.log('bank.bank_credit_upi?.id:', bank?.bank_credit_upi?.id);

        const creditUpiId = bank?.credit_upi_id || bank?.id || bank?.bank_credit_upi?.id;
        
        if (creditUpiId) {
          payload.bank_credit_upi = creditUpiId;
          console.log('✅ Set bank_credit_upi to:', creditUpiId);
        } else {
          console.error('❌ ERROR: Could not find Credit UPI ID in bank object!');
        }
      } else {
        // Regular bank uses new_pin_code and new_pin_code_confirmation
        payload.new_pin_code = newPin;
        payload.new_pin_code_confirmation = confirmPin;
        if (bank?.id) {
          payload.account_id = bank.id;
        }
      }

      let response;

      console.log("payload",payload);
      
      
      // Call appropriate API based on account type
      if (isNbfc) {
        response = await updateNbfcPincode(payload);
      } else if (isCredit) {
        response = await updateCreditUpiPin(payload);
      } else {
        response = await updatePin(payload);
      }

      showToast(response.data?.messages || I18n.t('pin_reset_success'));
      
      setTimeout(() => {
        resetToHome();
      }, 1500);
    } catch (error) {
      console.error('Reset PIN Error:', error);
      const errorMessage = error.response?.data?.messages || 
                          error.response?.data?.message || 
                          I18n.t('failed_save');
      showToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('reset_pin_screen_title')} onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: scaleUtils.scaleHeight(20) }} />
        {/* Old PIN */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_old_pin', { pinLength: oldPinLength })}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            code={oldPin}
            setCode={handleOldPinChange}
            length={parseInt(oldPinLength)}
            isSecure={true}
          />
        </View>

        {/* PIN Length Selection - Pill Toggle */}
        <View style={styles.pinLengthRow}>
          {/* <Text style={[styles.label, { color: themeColors.text, marginTop: 0 }]}>
            {I18n.t('select_pin_length')}
          </Text> */}
          <View style={styles.pillContainer}>
            <TouchableOpacity
              style={[
                styles.pillButton,
                styles.pillButtonLeft,
                selectedPinLength === 4 && styles.pillButtonActive,
              ]}
              onPress={() => handlePinLengthSelect(4)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedPinLength === 4 && styles.pillTextActive,
                ]}
              >
                 {I18n.t('pin_4_digit')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillButton,
                styles.pillButtonRight,
                selectedPinLength === 6 && styles.pillButtonActive,
              ]}
              onPress={() => handlePinLengthSelect(6)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedPinLength === 6 && styles.pillTextActive,
                ]}
              >
                {I18n.t('pin_6_digit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New PIN */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_new_pin', { pinLength: selectedPinLength })}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            ref={newPinRef}
            code={newPin}
            setCode={handleNewPinChange}
            length={parseInt(selectedPinLength)}
            isSecure={true}
          />
        </View>

        {/* Confirm PIN */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('confirm_new_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            ref={confirmPinRef}
            code={confirmPin}
            setCode={setConfirmPin}
            length={parseInt(selectedPinLength)}
            isSecure={true}
          />
        </View>


        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('reset_pin_button')}
            onPress={handleResetPin}
            disabled={
              oldPin.length !== parseInt(oldPinLength) ||
              newPin.length !== parseInt(selectedPinLength) ||
              confirmPin.length !== parseInt(selectedPinLength) ||
              isLoading
            }
          />
        </View>
      </ScrollView>

      {/* Toast */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: scaleUtils.scaleWidth(20) },
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
  sectionLabel: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  pinLengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  pillContainer: {
    flexDirection: 'row',
    borderRadius: scaleUtils.scaleWidth(8),
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    width : '100%'
  },
  pillButton: {
    flex : 1,
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(16),
    justifyContent: 'center',
    alignItems: 'center',
    // minWidth: scaleUtils.scaleWidth(45),
  },
  pillButtonLeft: {
    borderTopLeftRadius: scaleUtils.scaleWidth(6),
    borderBottomLeftRadius: scaleUtils.scaleWidth(6),
  },
  pillButtonRight: {
    borderTopRightRadius: scaleUtils.scaleWidth(6),
    borderBottomRightRadius: scaleUtils.scaleWidth(6),
  },
  pillButtonActive: {
    backgroundColor: Colors.primary,
  },
  pillText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  tipBox: {
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingVertical: scaleUtils.scaleWidth(8),
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(14),
  },
  tipTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleWidth(8),
  },
  tipText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
});

export default ResetPinScreen;
