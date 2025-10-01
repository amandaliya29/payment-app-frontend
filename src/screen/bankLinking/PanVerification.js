import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../../component/Header';
import scaleUtils from '../../utils/Responsive';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';

const PanVerification = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme(); // 👈 theme hook
  const [name, setName] = useState('');
  const route = useRoute();
  const { aadhaar, Itemid } = route?.params || {};
  const [panNumber, setPanNumber] = useState('');

  const validatePan = pan => {
    // PAN Format: 5 letters, 4 digits, 1 letter (total 10 chars)
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert(I18n.t('enter_name_pan'));
      return;
    }
    if (!validatePan(panNumber)) {
      Alert.alert(I18n.t('invalid_pan'));
      return;
    }

    // Navigate or API call
    navigation.navigate('VideoKYCVerification', {
      aadhaar,
      panNumber,
      name,
      Itemid,
    });
  };

  // console.log('post', aadhaar, panNumber, name);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      <Header
        title={I18n.t('pan_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Subtitle */}
        <Text
          style={[
            styles.subtitle,
            { color: dark ? Colors.white : Colors.black },
          ]}
        >
          {I18n.t('enter_pan_details')}
        </Text>

        {/* Name Input */}
        <Input
          label={I18n.t('name_as_per_pan')}
          value={name}
          onChange={setName}
          placeholder={I18n.t('name_pan_placeholder')}
          placeholderTextColor={Colors.grey} // 👈 theme color
        />

        {/* PAN Input */}
        <Input
          label={I18n.t('pan_number')}
          value={panNumber}
          onChange={setPanNumber}
          placeholder={I18n.t('pan_placeholder')}
          placeholderTextColor={Colors.grey}
          maxLength={10}
          keyboardType="default"
          uppercaseOnly
        />

        {/* Continue Button */}
        <Button
          title={I18n.t('continue')}
          onPress={handleContinue}
          disabled={!name.trim() || !validatePan(panNumber)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-Regular',
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(40),
  },
});

export default PanVerification;
