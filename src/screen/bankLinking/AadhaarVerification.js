import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';

const AadhaarVerification = () => {
  const navigation = useNavigation();
  const [aadhaar, setAadhaar] = useState('');

  const handleSendOtp = () => {
    if (aadhaar.length === 12) {
      navigation.navigate('OtpVerification', { aadhaar });
    } else {
      alert('Please enter a valid 12-digit Aadhaar number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Identity Verification"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: scaleUtils.scaleWidth(20),
        }}
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
        <Text style={styles.title}>Aadhaar Verification</Text>
        <Text style={styles.subtitle}>
          Enter your 12-digit Aadhaar number to verify your identity. We use
          bank-level security to protect your information.
        </Text>

        {/* Aadhaar Input */}
        <Input
          label="Aadhaar Number"
          value={aadhaar}
          onChange={setAadhaar}
          keyboardType="numeric"
          maxLength={12}
          placeholder="XXXX XXXX XXXX"
          placeholderTextColor={Colors.grey}
        />

        {/* Security Note
        <View style={styles.securityBox}>
          <Image
            source={require('../../assets/image/appIcon/security.png')}
            style={styles.lockIcon}
          />
          <Text style={styles.securityText}>
            Secure & Confidential: Your Aadhaar data is encrypted and never
            stored
          </Text>
        </View> */}

        {/* Send OTP Button */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(8) }}>
          <Button title="Send OTP" onPress={handleSendOtp} />
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
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(12),
    marginTop: scaleUtils.scaleHeight(20),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  lockIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    tintColor: Colors.white,
    marginRight: scaleUtils.scaleWidth(10),
    resizeMode: 'contain',
  },
  securityText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    flex: 1,
    flexWrap: 'wrap',
  },
  footer: {
    marginTop: scaleUtils.scaleHeight(30),
  },
  footerTitle: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(10),
  },
  bullet: {
    color: Colors.grey,
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(6),
  },
});

export default AadhaarVerification;
