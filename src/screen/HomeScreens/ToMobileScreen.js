import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import Button from '../../component/Button';
import Input from '../../component/Input'; // ✅ using your custom Input
import I18n from '../../utils/language/i18n';
import { useNavigation } from '@react-navigation/native';

const ToMobileScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    border: isDark ? Colors.cardGrey : Colors.darkGrey,
  };

  const [selectedOption, setSelectedOption] = useState('phone'); // 'phone' | 'upi'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleContinue = () => {
    const data =
      selectedOption === 'phone'
        ? { method: 'phone', value: phoneNumber }
        : { method: 'upi', value: upiId };

    console.log('Transfer Data:', data);
    navigation.goBack(); // returning to previous screen
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('transfer_to_mobile')}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Select transfer method */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('select_transfer_method')}
        </Text>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === 'phone'
                    ? Colors.gradientPrimary
                    : themeColors.border,
              },
            ]}
            onPress={() => setSelectedOption('phone')}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    selectedOption === 'phone'
                      ? Colors.gradientPrimary
                      : themeColors.text,
                },
              ]}
            >
              {I18n.t('via_phone_number')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor:
                  selectedOption === 'upi'
                    ? Colors.gradientPrimary
                    : themeColors.border,
              },
            ]}
            onPress={() => setSelectedOption('upi')}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    selectedOption === 'upi'
                      ? Colors.gradientPrimary
                      : themeColors.text,
                },
              ]}
            >
              {I18n.t('via_upi_id')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input fields */}
        {selectedOption === 'phone' ? (
          <Input
            label={I18n.t('enter_phone_number')}
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder={'+91-1234567891'}
            keyboardType="number-pad"
            maxLength={10}
          />
        ) : (
          <Input
            label={I18n.t('enter_upi_id')}
            value={upiId}
            onChange={setUpiId}
            placeholder={I18n.t('example_upi')}
            autoCapitalize="none"
          />
        )}
      </KeyboardAvoidingView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={I18n.t('cancel')}
          style={[
            styles.cancelButton,
            { backgroundColor: themeColors.background },
          ]}
          textStyle={{ color: themeColors.text }}
          onPress={() => navigation.goBack()}
        />
        <Button
          title={I18n.t('continue')}
          style={styles.continueButton}
          disabled={
            (selectedOption === 'phone' && !phoneNumber) ||
            (selectedOption === 'upi' && !upiId)
          }
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: scaleUtils.scaleWidth(16),
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
    marginBottom: scaleUtils.scaleHeight(8),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleUtils.scaleHeight(20),
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(8),
    paddingVertical: scaleUtils.scaleHeight(12),
    marginHorizontal: scaleUtils.scaleWidth(5),
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },
  buttonContainer: {
    margin: scaleUtils.scaleWidth(16),
    marginTop: scaleUtils.scaleHeight(20),
    columnGap: scaleUtils.scaleWidth(10),
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gradientSecondary,
  },
  continueButton: {},
});

export default ToMobileScreen;
