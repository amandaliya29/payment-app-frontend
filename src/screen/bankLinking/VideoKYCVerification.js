import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import { useNavigation } from '@react-navigation/native';

const VideoKYCVerification = () => {
  const navigation = useNavigation();
  const [selectedDoc, setSelectedDoc] = useState('aadhaar');

  const documents = [
    { key: 'aadhaar', label: I18n.t('aadhaar_card') },
    { key: 'pan', label: I18n.t('pan_card') },
    { key: 'passport', label: I18n.t('passport') },
    { key: 'voter', label: I18n.t('voter_id') },
    { key: 'driving', label: I18n.t('driving_license') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title={I18n.t('video_kyc')} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Video Camera Image */}
        <Image
          source={require('../../assets/image/appIcon/videoKyc.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>{I18n.t('video_kyc_verification')}</Text>
        <Text style={styles.subtitle}>{I18n.t('video_kyc_subtitle')}</Text>

        {/* Select ID Document */}
        <Text style={styles.sectionTitle}>{I18n.t('select_id_document')}</Text>
        <Text style={styles.sectionSubtitle}>
          {I18n.t('choose_id_document')}
        </Text>

        <View style={styles.docWrapper}>
          {documents.map(doc => (
            <TouchableOpacity
              key={doc.key}
              style={[
                styles.docButton,
                selectedDoc === doc.key && styles.docButtonActive,
              ]}
              onPress={() => setSelectedDoc(doc.key)}
            >
              <Text
                style={[
                  styles.docText,
                  selectedDoc === doc.key && styles.docTextActive,
                ]}
              >
                {doc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button title={I18n.t('start_video_kyc')} />
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
  image: {
    width: '100%',
    height: scaleUtils.scaleHeight(70),
    alignSelf: 'center',
    marginBottom: scaleUtils.scaleHeight(20),
    tintColor: Colors.primary,
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginTop: scaleUtils.scaleHeight(14),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    marginVertical: scaleUtils.scaleHeight(10),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginTop: scaleUtils.scaleHeight(20),
  },
  sectionSubtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    marginBottom: scaleUtils.scaleHeight(30),
  },
  docWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleUtils.scaleWidth(8),
  },
  docButton: {
    borderRadius: scaleUtils.scaleWidth(10),
    paddingVertical: scaleUtils.scaleWidth(12),
    paddingHorizontal: scaleUtils.scaleWidth(13),
    backgroundColor: Colors.secondaryBg,
    marginBottom: scaleUtils.scaleHeight(4),
  },
  docButtonActive: {
    backgroundColor: Colors.primary,
  },
  docText: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  docTextActive: {
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },
});

export default VideoKYCVerification;
