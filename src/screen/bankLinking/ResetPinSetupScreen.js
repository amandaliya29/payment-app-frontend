import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const ResetPinSetup = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { bank, isNbfc, isCredit } = route.params || {};

  const [selectedPin, setSelectedPin] = useState(
    bank?.pin_code_length === 6 ? 6 : 4,
  );

  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.card : Colors.lightCard,
    border: isDark ? Colors.grey : Colors.lightBorder,
    selectedBg: isDark ? Colors.primaryLight : Colors.lightPrimaryBg,
  };

  // Validate bank data on component mount
  useEffect(() => {
    if (!bank) {
      console.warn('Bank data is missing, going back');
      navigation.goBack();
    }
  }, [bank, navigation]);

  const handleSelectPin = pinLength => {
    setSelectedPin(pinLength);

    if (!bank) {
      console.error('Bank data is missing');
      return;
    }

    // Update bank object with selected PIN length
    const updatedBank = {
      ...bank,
      pin_code_length: pinLength,
    };

    console.log('Navigating to SetPinScreen with:', { 
      bank: updatedBank, 
      old_pin_code: route.params?.old_pin_code,
      token: route.params?.token,
      mobile: route.params?.mobile,
      isNbfc: route.params?.isNbfc,
      isCredit: route.params?.isCredit,
    });
    navigation.navigate('SetPinScreen', {
      bank: updatedBank,
      old_pin_code: route.params?.old_pin_code,
      token: route.params?.token,
      mobile: route.params?.mobile,
      isNbfc: route.params?.isNbfc,
      isCredit: route.params?.isCredit,
    });
  };

  const getOptionStyle = pin => [
    styles.optionBox,
    { backgroundColor: themeColors.card, borderColor: themeColors.border },
    selectedPin === pin && {
      borderColor: Colors.primary,
      backgroundColor: themeColors.selectedBg,
      borderWidth: 2,
    },
  ];

  if (!bank) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Header
          title={I18n.t('reset_pin_setup')}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            Bank information is missing
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('reset_pin_setup')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('reset_pin_setup')}
        </Text>

        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('reset_pin_description')}
        </Text>

        {/* PIN OPTIONS */}
        <View style={styles.optionContainer}>
          {/* 4 DIGIT */}
          <TouchableOpacity
            style={getOptionStyle(4)}
            onPress={() => handleSelectPin(4)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>
              {I18n.t('pin_4_digit')}
            </Text>
            <Text style={[styles.optionSub, { color: themeColors.subText }]}>
              {I18n.t('quick_convenient')}
            </Text>
          </TouchableOpacity>

          {/* 6 DIGIT */}
          <TouchableOpacity
            style={getOptionStyle(6)}
            onPress={() => handleSelectPin(6)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>
              {I18n.t('pin_6_digit')}
            </Text>
            <Text style={[styles.optionSub, { color: themeColors.subText }]}>
              {I18n.t('enhanced_security')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: scaleUtils.scaleWidth(20),
    flexGrow: 1,
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
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  optionContainer: {
    marginVertical: scaleUtils.scaleHeight(20),
  },
  optionBox: {
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(20),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  optionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(4),
  },
  optionSub: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  bankInfoContainer: {
    marginTop: scaleUtils.scaleHeight(30),
    padding: scaleUtils.scaleWidth(15),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: scaleUtils.scaleWidth(10),
    alignItems: 'center',
  },
  bankInfoTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    marginBottom: scaleUtils.scaleHeight(5),
  },
  bankInfoText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleUtils.scaleWidth(20),
  },
  errorText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default ResetPinSetup;
