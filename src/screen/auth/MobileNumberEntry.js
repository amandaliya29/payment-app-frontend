import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import Input from '../../component/Input';
import Button from '../../component/Button';
import Checkbox from '../../component/Checkbox';
import { useTranslation } from 'react-i18next';
import i18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import auth from '@react-native-firebase/auth';
import { Toast } from '../../utils/Toast';

export const MobileNumberEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { colors, dark } = useTheme();

  const [mobile, setMobile] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
  ];

  useEffect(() => {
    if (route.params?.mobile) {
      setMobile(route.params.mobile);
    }
  }, [route.params?.mobile]);

  const handleProceed = async () => {
    if (mobile.length !== 10) {
      showToast(t('alert_invalid_number'));
      return;
    }
    if (!isChecked) {
      showToast(t('alert_terms'));
      return;
    }

    try {
      setLoading(true);
      const phoneNumber = `+91${mobile}`;

      const unsubscribe = auth().verifyPhoneNumber(phoneNumber);

      unsubscribe.on('state_changed', phoneAuthSnapshot => {
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT:
            setVerificationId(phoneAuthSnapshot.verificationId);
            setLoading(false);
            showToast(t('otp_sent_successfully'));
            navigation.navigate('OtpVerification', {
              verificationId: phoneAuthSnapshot.verificationId,
              mobile,
            });
            break;

          case auth.PhoneAuthState.AUTO_VERIFIED:
            const { verificationId, code } = phoneAuthSnapshot;
            const credential = auth.PhoneAuthProvider.credential(
              verificationId,
              code,
            );
            auth()
              .signInWithCredential(credential)
              .then(() => {
                setLoading(false);
                navigation.navigate('Home');
              })
              .catch(() => {
                setLoading(false);
                showToast(t('otp_invalid'));
              });
            break;

          case auth.PhoneAuthState.ERROR:
            setLoading(false);
            showToast(t('otp_invalid'));
            break;

          case auth.PhoneAuthState.CODE_AUTO_RETRIEVED:
            break;
        }
      });
    } catch {
      setLoading(false);
      showToast(t('otp_invalid'));
    }
  };

  const selectLanguage = langCode => {
    i18n.changeLanguage(langCode);
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      {/* Toast Component */}
      <Toast visible={toastVisible} message={toastMessage} isDark={dark} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.BtnWarperStyle, { backgroundColor: Colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require('../../assets/image/appIcon/Language.png')}
            style={[styles.languageIcon, { tintColor: colors.card }]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Language Modal */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('select_language')}
              </Text>

              {languages.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOption,
                    { borderColor: Colors.primary },
                    i18n.language === lang.code && {
                      backgroundColor: Colors.primary,
                    },
                  ]}
                  onPress={() => selectLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      { color: Colors.primary },
                      i18n.language === lang.code && { color: colors.card },
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
            style={[styles.imageStyle, { tintColor: Colors.primary }]}
          />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          {t('enter_mobile_number')}
        </Text>
        <Text style={[styles.subText, { color: colors.text }]}>
          {t('verification_message')}
        </Text>

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

        <Text style={[styles.validationText, { color: colors.text }]}>
          {t('validation_message')}
        </Text>

        <Checkbox
          checked={isChecked}
          onChange={setIsChecked}
          label={
            <Text style={[styles.checkText, { color: colors.text }]}>
              {t('agree_terms')}{' '}
              <Text style={[styles.link, { color: Colors.primary }]}>
                {t('terms_conditions')}
              </Text>{' '}
              {t('and')}{' '}
              <Text style={[styles.link, { color: Colors.primary }]}>
                {t('privacy_policy')}
              </Text>
            </Text>
          }
        />

        <View style={{ marginBottom: scaleUtils.scaleHeight(20) }}>
          <Button
            title={t('proceed')}
            onPress={handleProceed}
            loading={loading}
            disabled={mobile.length !== 10 || !isChecked || loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MobileNumberEntry;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: scaleUtils.scaleWidth(15),
    paddingVertical: scaleUtils.scaleHeight(10),
  },
  languageIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
  },
  BtnWarperStyle: {
    width: scaleUtils.scaleWidth(35),
    height: scaleUtils.scaleWidth(35),
    borderRadius: scaleUtils.scaleWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
    textAlign: 'center',
  },
  langOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
  },
  langOptionText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  imageStyle: { width: '100%', height: '100%', resizeMode: 'contain' },
  imagesWarperStyle: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginVertical: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
  },
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
    marginBottom: scaleUtils.scaleHeight(15),
    marginTop: scaleUtils.scaleHeight(-4),
  },
  link: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textDecorationLine: 'underline',
  },
  checkText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
});
