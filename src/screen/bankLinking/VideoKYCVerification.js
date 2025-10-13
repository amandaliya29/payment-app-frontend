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
import scaleUtils from '../../utils/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Colors } from '../../themes/Colors';

const VideoKYCVerification = () => {
  const navigation = useNavigation();
  const { dark, colors } = useTheme(); // 👈 theme hook
  const [selectedDoc, setSelectedDoc] = useState('aadhaar');
  const route = useRoute();
  const { aadhaar, panNumber, name, Itemid } = route?.params || {};

  // console.log(aadhaar, panNumber, name, Itemid);

  const documents = [
    { key: 'aadhaar', label: I18n.t('aadhaar_card') },
    { key: 'pan', label: I18n.t('pan_card') },
    { key: 'passport', label: I18n.t('passport') },
    { key: 'voter', label: I18n.t('voter_id') },
    { key: 'driving', label: I18n.t('driving_license') },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      <Header title={I18n.t('video_kyc')} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(20) }}
      >
        {/* Video Camera Image */}
        <Image
          source={require('../../assets/image/appIcon/videoKyc.png')}
          style={[styles.image, { tintColor: Colors.primary }]}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {I18n.t('video_kyc_verification')}
        </Text>
        <Text style={[styles.subtitle, { color: Colors.grey }]}>
          {I18n.t('video_kyc_subtitle')}
        </Text>

        {/* Select ID Document */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {I18n.t('select_id_document')}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: Colors.grey }]}>
          {I18n.t('choose_id_document')}
        </Text>

        <View style={styles.docWrapper}>
          {documents.map(doc => (
            <TouchableOpacity
              key={doc.key}
              style={[
                styles.docButton,
                { backgroundColor: colors.card },
                selectedDoc === doc.key && { backgroundColor: Colors.primary },
              ]}
              onPress={() => setSelectedDoc(doc.key)}
            >
              <Text
                style={[
                  styles.docText,
                  { color: colors.text },
                  selectedDoc === doc.key && { color: Colors.white },
                ]}
              >
                {doc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('start_video_kyc')}
            onPress={() =>
              navigation.navigate('FaceIDVerification', {
                aadhaar,
                panNumber,
                name,
                Itemid,
              })
            }
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
  image: {
    width: '100%',
    height: scaleUtils.scaleHeight(70),
    alignSelf: 'center',
    marginBottom: scaleUtils.scaleHeight(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(14),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    marginVertical: scaleUtils.scaleHeight(10),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(20),
  },
  sectionSubtitle: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
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
    marginBottom: scaleUtils.scaleHeight(4),
  },
  docText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
});

export default VideoKYCVerification;
