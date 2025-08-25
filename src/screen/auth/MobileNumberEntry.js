import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Colors } from '../../themes/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import Input from '../../component/Input';
import Button from '../../component/Button';
import Checkbox from '../../component/Checkbox';
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/language/i18n';

export const MobileNumberEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const [mobile, setMobile] = useState('');
  const [agree, setAgree] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Supported languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
  ];

  // 🔹 Show modal when screen renders
  useEffect(() => {
    setModalVisible(true);

    if (route.params?.mobile) {
      setMobile(route.params.mobile);
    }
  }, [route.params?.mobile]);

  const handleProceed = () => {
    if (mobile.length === 10 && agree) {
      navigation.navigate('OtpVerification', { mobile });
    } else {
      alert(t('alert_invalid_number'));
    }
  };

  const selectLanguage = langCode => {
    i18n.changeLanguage(langCode);
    setModalVisible(false); // Close modal once language is selected
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* 🔹 Modal for Language Selection */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>

              {languages.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOption,
                    i18n.language === lang.code && {
                      backgroundColor: Colors.primary,
                    },
                  ]}
                  onPress={() => selectLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      i18n.language === lang.code && { color: Colors.white },
                    ]}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Phone Icon */}
        <View style={styles.imagesWarperStyle}>
          <Image
            source={require('../../assets/image/appIcon/phone.png')}
            style={styles.imageStyle}
          />
        </View>

        {/* Title */}
        <Text style={styles.heading}>{t('enter_mobile_number')}</Text>
        <Text style={styles.subText}>{t('verification_message')}</Text>

        {/* Input Field */}
        <Input
          label={t('mobile_number_label')}
          value={mobile}
          onChange={setMobile}
          placeholder={t('mobile_number_placeholder')}
          keyboardType="phone-pad"
          maxLength={10}
          errorText={
            mobile.length > 0 && mobile.length < 10
              ? t('invalid_mobile_number')
              : ''
          }
        />

        {/* Validation Message */}
        <Text style={styles.validationText}>{t('validation_message')}</Text>

        {/* Checkbox */}
        <Checkbox
          checked={isChecked}
          onChange={setIsChecked}
          label={
            <Text style={styles.checkText}>
              {t('agree_terms')}{' '}
              <Text style={[styles.link, styles.underline]}>
                {t('terms_conditions')}
              </Text>{' '}
              {t('and')}{' '}
              <Text style={[styles.link, styles.underline]}>
                {t('privacy_policy')}
              </Text>
            </Text>
          }
        />

        {/* Proceed Button */}
        <View style={{ marginBottom: scaleUtils.scaleHeight(20) }}>
          <Button
            title={t('proceed')}
            onPress={handleProceed}
            loading={false}
            disabled={mobile.length !== 10}
          />
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  langOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  langOptionText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Regular',
    color: Colors.primary,
    textAlign: 'center',
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
    marginBottom: scaleUtils.scaleHeight(40),
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
});
