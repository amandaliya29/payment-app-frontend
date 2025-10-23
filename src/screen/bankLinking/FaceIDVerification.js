import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import Button from '../../component/Button';
import { Toast } from '../../utils/Toast'; // 👈 add your Toast component
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const FaceIDVerification = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme(); // 👈 detect dark / light theme
  const route = useRoute();
  const { aadhaar, panNumber, name, Itemid } = route?.params || {};

  console.log(aadhaar, panNumber, name, Itemid);

  // ✅ Toast states
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000); // auto hide after 2s
  };

  // Pick theme colors dynamically
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.grey,
    card: isDark ? Colors.secondaryBg : Colors.cardGrey,
  };

  const handleSaveBank = () => {
    // console.log('UPIPinSetup', aadhaar, panNumber, name);

    navigation.navigate('UPIPinSetup', {
      aadhaar,
      panNumber,
      name,
      Itemid,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('video_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('complete_video_kyc')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('video_kyc_instruction_text')}
        </Text>

        {/* Face Circle with Image */}
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Image
              source={require('../../assets/image/appIcon/face.png')}
              style={styles.faceImage}
              resizeMode="contain"
            />
            <Text style={[styles.circleText, { color: themeColors.text }]}>
              {I18n.t('position_face')}
            </Text>
          </View>
        </View>

        {/* KYC Instructions */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('kyc_instructions')}
        </Text>
        <View
          style={[
            styles.instructionsBox,
            { backgroundColor: themeColors.card },
          ]}
        >
          {[1, 2, 3, 4].map(step => (
            <View style={styles.instructionItem} key={step}>
              <View style={styles.instructionNumberContainer}>
                <Text style={styles.instructionNumber}>{step}</Text>
              </View>
              <Text
                style={[styles.instructionText, { color: themeColors.text }]}
              >
                {I18n.t(`kyc_step${step}`)}
              </Text>
            </View>
          ))}
        </View>

        {/* Info Note */}
        <Text style={[styles.infoNote, { color: themeColors.subText }]}>
          {I18n.t('kyc_info_note')}
        </Text>

        {/* Button */}
        <Button title={I18n.t('complete_video_kyc')} onPress={handleSaveBank} />

        {/* Footer Text */}
        <Text style={[styles.footer, { color: themeColors.subText }]}>
          {I18n.t('kyc_terms_text')}
        </Text>
      </ScrollView>

      {/* ✅ Toast at bottom */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: scaleUtils.scaleWidth(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginVertical: scaleUtils.scaleHeight(10),
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(30),
  },
  circle: {
    width: scaleUtils.scaleWidth(220),
    height: scaleUtils.scaleWidth(220),
    borderRadius: scaleUtils.scaleWidth(110),
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: scaleUtils.scaleWidth(15),
  },
  faceImage: {
    width: scaleUtils.scaleWidth(100),
    height: scaleUtils.scaleWidth(100),
    marginBottom: scaleUtils.scaleHeight(10),
    tintColor: Colors.black,
  },
  circleText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleWidth(10),
  },
  instructionsBox: {
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(15),
    marginBottom: scaleUtils.scaleWidth(20),
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: scaleUtils.scaleWidth(12),
    alignItems: 'center',
  },
  instructionNumber: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
  },
  instructionText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  instructionNumberContainer: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    borderRadius: scaleUtils.scaleWidth(12),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleUtils.scaleWidth(10),
  },
  infoNote: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleWidth(20),
  },
  footer: {
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(15),
  },
});

export default FaceIDVerification;
