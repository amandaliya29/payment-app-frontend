import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import Button from '../../component/Button';
import Input from '../../component/Input';
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
    // navigation.goBack();
    navigation.navigate('EnterAmountScreen', {
      user:
        data.method === 'phone'
          ? { id: `+91${data.value}` }
          : { code: data.value },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('transfer_to_mobile')}
        onBack={() => navigation.goBack()}
      />

      {/* 🔹 Top Tab Bar */}
      <View style={[styles.tabBar]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedOption === 'phone' && styles.activeTab,
          ]}
          onPress={() => setSelectedOption('phone')}
        >
          <Text
            style={[
              styles.tabText,
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
          {selectedOption === 'phone' && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, selectedOption === 'upi' && styles.activeTab]}
          onPress={() => setSelectedOption('upi')}
        >
          <Text
            style={[
              styles.tabText,
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
          {selectedOption === 'upi' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 🔹 Input Fields */}
        {selectedOption === 'phone' ? (
          <Input
            label={I18n.t('mobile_number_label')}
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder={I18n.t('mobile_number_placeholder')}
            keyboardType="phone-pad"
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

      {/* 🔹 Buttons */}
      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
          <Button
            title={I18n.t('cancel')}
            style={[
              styles.cancelButton,
              { backgroundColor: themeColors.background },
            ]}
            textStyle={{ color: themeColors.text }}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={I18n.t('continue')}
            style={styles.continueButton}
            disabled={
              (selectedOption === 'phone' &&
                (!phoneNumber || phoneNumber.length < 10)) ||
              (selectedOption === 'upi' &&
                (!upiId || !/^[\w.-]+@[\w.-]+$/.test(upiId)))
            }
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* 🔹 Top Tab Bar */
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: scaleUtils.scaleHeight(16),
    marginTop: scaleUtils.scaleHeight(10),
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(10),
    flex: 1,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },
  activeTab: {},
  activeIndicator: {
    marginTop: scaleUtils.scaleHeight(4),
    height: scaleUtils.scaleHeight(2),
    width: '90%',
    backgroundColor: Colors.gradientPrimary,
    borderRadius: scaleUtils.scaleHeight(2),
  },

  content: {
    flex: 1,
    paddingHorizontal: scaleUtils.scaleWidth(16),
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
