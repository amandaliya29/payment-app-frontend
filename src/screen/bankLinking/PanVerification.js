import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';
import I18n from '../../utils/language/i18n';

const PanVerification = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
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
    navigation.navigate('VideoKYCVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={I18n.t('pan_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Title */}
        {/* <Text style={styles.title}>{I18n.t('pan_verification')}</Text> */}
        <Text style={styles.subtitle}>{I18n.t('enter_pan_details')}</Text>

        {/* Name Input */}
        <Input
          label={I18n.t('name_as_per_pan')}
          value={name}
          onChange={setName}
          placeholder={I18n.t('name_pan_placeholder')}
          placeholderTextColor={Colors.grey}
        />

        <Input
          label={I18n.t('pan_number')}
          value={panNumber}
          onChange={setPanNumber}
          placeholder={I18n.t('pan_placeholder')}
          placeholderTextColor={Colors.grey}
          maxLength={10}
          keyboardType="default"
          uppercaseOnly // 👈 will auto-force uppercase
        />

        {/* Continue Button */}
        <Button
          title={I18n.t('continue')}
          onPress={handleContinue}
          // Disable button unless name is entered AND PAN format is valid
          disabled={!name.trim() || !validatePan(panNumber)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(40),
  },
});

export default PanVerification;
