import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Header from '../../component/Header';
import scaleUtils from '../../utils/Responsive';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';

const AadhaarVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { Itemid } = route?.params || {};
  const { colors, dark } = useTheme(); // 👈 theme hook
  const [aadhaar, setAadhaar] = useState('');

  // console.log(Itemid);

  const handleSendOtp = () => {
    if (aadhaar.length === 14) {
      navigation.navigate('AadhaarOTPVerification', { aadhaar, Itemid });
    } else {
      Alert.alert(I18n.t('aadhaar_invalid'));
    }
  };

  useEffect(() => {
    if (route.params?.aadhaar) {
      setAadhaar(route.params.aadhaar); // pre-fill Aadhaar
    }
  }, [route.params?.aadhaar]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
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
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: dark ? Colors.secondary : colors.card },
            ]}
          >
            <Image
              source={require('../../assets/image/appIcon/identity.png')}
              style={[styles.icon, { tintColor: colors.primary }]}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {I18n.t('aadhaar_verification')}
        </Text>
        <Text style={[styles.subtitle, { color: Colors.grey }]}>
          {I18n.t('aadhaar_subtitle')}
        </Text>

        {/* Aadhaar Input */}
        <Input
          label={I18n.t('aadhaar_label')}
          value={aadhaar}
          onChange={setAadhaar}
          keyboardType="numeric"
          maxLength={12}
          placeholder={I18n.t('aadhaar_placeholder')}
          placeholderTextColor={colors.grey}
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
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  iconCircle: {
    padding: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(50),
  },
  icon: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
    resizeMode: 'contain',
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    marginVertical: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(40),
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
});

export default AadhaarVerification;
