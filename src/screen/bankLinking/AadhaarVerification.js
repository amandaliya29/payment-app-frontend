import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';
import I18n from '../../utils/language/i18n';

const AadhaarVerification = () => {
  const navigation = useNavigation();
  const [aadhaar, setAadhaar] = useState('');

  const handleSendOtp = () => {
    if (aadhaar.length === 14) {
      navigation.navigate('OtpVerification', { aadhaar });
    } else {
      Alert.alert(I18n.t('aadhaar_invalid'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={I18n.t('identity_verification')}
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
        <Text style={styles.title}>{I18n.t('aadhaar_verification')}</Text>
        <Text style={styles.subtitle}>{I18n.t('aadhaar_subtitle')}</Text>

        {/* Aadhaar Input */}
        <Input
          label={I18n.t('aadhaar_label')}
          value={aadhaar}
          onChange={setAadhaar}
          keyboardType="numeric"
          maxLength={12}
          placeholder={I18n.t('aadhaar_placeholder')}
          placeholderTextColor={Colors.grey}
        />

        {/* Send OTP Button */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(8) }}>
          <Button
            title={I18n.t('send_otp')}
            onPress={handleSendOtp}
            disabled={aadhaar.length !== 14}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    backgroundColor: Colors.secondary,
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
});

export default AadhaarVerification;
