import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const UPIPinSetup = () => {
  const navigation = useNavigation();
  const [selectedPin, setSelectedPin] = useState('4');

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={I18n.t('set_upi_pin')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{I18n.t('set_upi_pin')}</Text>
        <Text style={styles.subtitle}>{I18n.t('upi_pin_description')}</Text>

        {/* PIN Options */}
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionBox,
              selectedPin === '4' && styles.selectedOption,
            ]}
            onPress={() => setSelectedPin('4')}
          >
            <Text style={styles.optionTitle}>4-Digit PIN</Text>
            <Text style={styles.optionSub}>{I18n.t('quick_convenient')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBox,
              selectedPin === '6' && styles.selectedOption,
            ]}
            onPress={() => setSelectedPin('6')}
          >
            <Text style={styles.optionTitle}>6-Digit PIN</Text>
            <Text style={styles.optionSub}>{I18n.t('enhanced_security')}</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Features */}
        <Text style={styles.sectionTitle}>{I18n.t('additional_features')}</Text>
        <View style={styles.featureItem}>
          <Image
            source={require('../../assets/image/appIcon/biometric.png')}
            style={styles.icon}
          />
          <Text style={styles.featureText}>{I18n.t('biometric_auth')}</Text>
        </View>
        <View style={styles.featureItem}>
          <Image
            source={require('../../assets/image/appIcon/sms.png')}
            style={styles.icon}
          />
          <Text style={styles.featureText}>{I18n.t('sms_alerts')}</Text>
        </View>
        <View style={styles.featureItem}>
          <Image
            source={require('../../assets/image/appIcon/lock.png')}
            style={styles.icon}
          />
          <Text style={styles.featureText}>{I18n.t('auto_lock')}</Text>
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
  optionContainer: {
    marginVertical: scaleUtils.scaleHeight(20),
  },
  optionBox: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(15),
    marginBottom: scaleUtils.scaleHeight(15),
    backgroundColor: Colors.card,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
  },
  optionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  optionSub: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginBottom: scaleUtils.scaleHeight(10),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleUtils.scaleHeight(12),
  },
  icon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    marginRight: scaleUtils.scaleWidth(10),
    tintColor: Colors.white,
  },
  featureText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
});

export default UPIPinSetup;
