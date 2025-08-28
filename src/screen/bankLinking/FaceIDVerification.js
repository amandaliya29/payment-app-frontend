import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import Button from '../../component/Button';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const FaceIDVerification = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={I18n.t('video_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{I18n.t('complete_video_kyc')}</Text>
        <Text style={styles.subtitle}>
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
            <Text style={styles.circleText}>{I18n.t('position_face')}</Text>
          </View>
        </View>

        {/* KYC Instructions */}
        <Text style={styles.sectionTitle}>{I18n.t('kyc_instructions')}</Text>
        <View style={styles.instructionsBox}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>{I18n.t('kyc_step1')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>{I18n.t('kyc_step2')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>{I18n.t('kyc_step3')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>{I18n.t('kyc_step4')}</Text>
          </View>
        </View>

        {/* Info Note */}
        <Text style={styles.infoNote}>{I18n.t('kyc_info_note')}</Text>

        {/* Button */}
        <Button
          title={I18n.t('complete_video_kyc')}
          onPress={() => {
            // Start KYC flow
            navigation.navigate('UPIPinSetup');
          }}
        />

        {/* Footer Text */}
        <Text style={styles.footer}>{I18n.t('kyc_terms_text')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    padding: scaleUtils.scaleWidth(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
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
  },
  circleText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginBottom: scaleUtils.scaleWidth(10),
  },
  instructionsBox: {
    backgroundColor: Colors.card,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(15),
    marginBottom: scaleUtils.scaleWidth(20),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleUtils.scaleWidth(12),
  },
  instructionNumber: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    borderRadius: scaleUtils.scaleWidth(12),
    backgroundColor: Colors.primary,
    textAlign: 'center',
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    marginRight: scaleUtils.scaleWidth(10),
    paddingTop: scaleUtils.scaleHeight(2),
  },
  instructionText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    flex: 1,
  },
  infoNote: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: scaleUtils.scaleWidth(20),
  },
  footer: {
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(15),
  },
});

export default FaceIDVerification;
