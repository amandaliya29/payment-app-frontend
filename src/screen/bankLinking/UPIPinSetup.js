import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const UPIPinSetup = () => {
  const navigation = useNavigation();
  const [selectedPin, setSelectedPin] = useState(4);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.card : Colors.lightCard,
    border: isDark ? Colors.grey : Colors.lightBorder,
    selectedBg: isDark ? Colors.primaryLight : Colors.lightPrimaryBg,
  };

  const handleSelectPin = length => {
    setSelectedPin(length);
    navigation.navigate('SetPinPage', { pinLength: length });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('set_upi_pin')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('set_upi_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('upi_pin_description')}
        </Text>

        {/* PIN Options */}
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.optionBox,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
              selectedPin === 4 && {
                borderColor: Colors.primary,
                backgroundColor: themeColors.selectedBg,
                borderWidth: 3,
              },
            ]}
            onPress={() => handleSelectPin(4)}
          >
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>
              4-Digit PIN
            </Text>
            <Text style={[styles.optionSub, { color: themeColors.subText }]}>
              {I18n.t('quick_convenient')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBox,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
              selectedPin === 6 && {
                borderColor: Colors.primary,
                backgroundColor: themeColors.selectedBg,
                borderWidth: 3,
              },
            ]}
            onPress={() => handleSelectPin(6)}
          >
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>
              6-Digit PIN
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
    padding: scaleUtils.scaleWidth(15),
    marginBottom: scaleUtils.scaleHeight(30),
  },
  optionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
  },
  optionSub: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
});

export default UPIPinSetup;
