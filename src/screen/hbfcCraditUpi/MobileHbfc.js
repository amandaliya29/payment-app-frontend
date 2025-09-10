import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import Input from '../../component/Input';
import Button from '../../component/Button';
import Checkbox from '../../component/Checkbox';
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import Header from '../../component/Header';
import auth from '@react-native-firebase/auth';

export const MobileHbfc = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { colors, dark } = useTheme();

  const [mobile, setMobile] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.mobile) {
      setMobile(route.params.mobile);
    }
  }, [route.params?.mobile]);

  const handleProceed = async () => {
    if (mobile.length !== 10) {
      Alert.alert(t('hbfc_alert_invalid_number'));
      return;
    }
    navigation.navigate('HbfCreditUpiVerification');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      <Header
        title={i18n.t('hbfc_credit_upi')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Phone Icon */}
        <View style={styles.imagesWarperStyle}>
          <Image
            source={require('../../assets/image/appIcon/phone.png')}
            style={[styles.imageStyle, { tintColor: Colors.primary }]}
          />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          {i18n.t('hbfc_enter_mobile_number')}
        </Text>
        <Text style={[styles.subText, { color: colors.text }]}>
          {i18n.t('hbfc_verification_message')}
        </Text>

        <Input
          label={i18n.t('hbfc_mobile_number_label')}
          value={mobile}
          onChange={setMobile}
          placeholder={i18n.t('hbfc_mobile_number_placeholder')}
          keyboardType="phone-pad"
          maxLength={10}
          errorText={
            mobile.length > 0 && mobile.length < 10
              ? i18n.t('hbfc_invalid_mobile_number')
              : ''
          }
        />

        <Text style={[styles.validationText, { color: colors.text }]}>
          {i18n.t('hbfc_validation_message')}
        </Text>

        <View style={{ marginBottom: scaleUtils.scaleHeight(20) }}>
          <Button
            title={i18n.t('hbfc_proceed')}
            onPress={handleProceed}
            loading={loading}
            disabled={mobile.length !== 10}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MobileHbfc;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1 },
  imagesWarperStyle: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginVertical: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
  },
  imageStyle: { width: '100%', height: '100%', resizeMode: 'contain' },
  heading: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
  subText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginVertical: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    marginBottom: scaleUtils.scaleHeight(40),
  },
  validationText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(16),
    marginTop: scaleUtils.scaleHeight(-4),
  },
});
