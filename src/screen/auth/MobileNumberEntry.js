import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Colors } from '../../themes/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import Input from '../../component/Input';
import Button from '../../component/Button';
import Checkbox from '../../component/Checkbox';

export const MobileNumberEntry = () => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState('');
  const [agree, setAgree] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleProceed = () => {
    if (mobile.length === 10 && agree) {
      console.log('Proceed with mobile:', mobile);
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          padding: scaleUtils.scaleWidth(20),
        }}
      >
        {/* Phone Icon */}
        <View style={styles.imagesWarperStyle}>
          <Image
            source={require('../../assets/image/appIcon/phone.png')}
            style={styles.imageStyle}
          />
        </View>

        {/* Title */}
        <Text style={styles.heading}>Enter Mobile Number</Text>
        <Text style={styles.subText}>
          We'll send you a verification code to confirm your mobile number
        </Text>

        {/* Input Field */}
        <Input
          value={mobile}
          onChange={setMobile}
          placeholder="Enter 10 digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          errorText={
            mobile.length > 0 && mobile.length < 10
              ? 'Invalid mobile number'
              : ''
          }
        />

        {/* Validation Message */}
        <Text style={styles.validationText}>
          Please enter a valid 10-digit mobile number
        </Text>

        <Checkbox
          checked={isChecked}
          onChange={setIsChecked}
          label={
            <Text style={styles.checkText}>
              I agree to the{' '}
              <Text style={[styles.link, styles.underline]}>
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text style={[styles.link, styles.underline]}>
                Privacy Policy
              </Text>
            </Text>
          }
        />

        <Button title="Proceed" onPress={handleProceed} loading={false} />

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Image
              source={require('../../assets/image/appIcon/security.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Secure & Private</Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            Your mobile number is encrypted and stored securely. We never share
            your personal information with third parties.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MobileNumberEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    // padding: scaleUtils.scaleWidth(20),
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    tintColor: Colors.primary,
    resizeMode: 'contain',
  },
  imagesWarperStyle: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginVertical: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
  },
  heading: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    alignSelf: 'center',
  },
  subText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.grey,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    marginBottom: scaleUtils.scaleHeight(30),
  },
  validationText: {
    color: Colors.grey,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(15),
    marginTop: scaleUtils.scaleHeight(-4),
  },
  link: {
    color: Colors.primary,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  checkText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  infoBox: {
    backgroundColor: Colors.secondaryBg,
    padding: scaleUtils.scaleWidth(15),
    borderRadius: scaleUtils.scaleWidth(10),
    marginTop: scaleUtils.scaleHeight(30),
    marginBottom: scaleUtils.scaleHeight(30),
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    marginRight: scaleUtils.scaleWidth(10),
    tintColor: Colors.primary,
  },
  infoTitle: {
    color: Colors.primary,
    fontSize: scaleUtils.scaleFont(15),
    marginBottom: scaleUtils.scaleHeight(5),
  },
  infoText: {
    color: Colors.grey,
    fontSize: scaleUtils.scaleFont(13),
    marginTop: scaleUtils.scaleHeight(8),
  },
});
