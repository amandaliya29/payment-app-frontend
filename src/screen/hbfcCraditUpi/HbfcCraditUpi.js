import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import Button from '../../component/Button';

const HbfcCraditUpi = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    tipBox: isDark ? Colors.secondary : Colors.cardGrey,
    buttonBg: isDark ? Colors.secondary : Colors.primary,
    buttonText: Colors.white,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('credit_upi')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          {I18n.t('pay_now_settle_later')}
        </Text>
        <Text style={[styles.description, { color: themeColors.subText }]}>
          {I18n.t('upi_desc')}
        </Text>

        {/* <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.buttonBg }]}
        >
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {I18n.t('activate_credit_upi')}
          </Text>
        </TouchableOpacity> */}

        <View style={styles.buttonStyle}>
          <Button title={I18n.t('activate_credit_upi')} />
        </View>

        <Text style={[styles.footer, { color: themeColors.subText }]}>
          {I18n.t('upi_powered_by')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  content: {
    alignItems: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  title: {
    fontSize: scaleUtils.scaleFont(28),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(20),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  description: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(24),
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  button: {
    paddingVertical: scaleUtils.scaleHeight(14),
    paddingHorizontal: scaleUtils.scaleWidth(40),
    borderRadius: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(30),
  },
  buttonText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  footer: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: '20%',
  },
  buttonStyle: {
    paddingVertical: scaleUtils.scaleHeight(14),
    width: '100%',
  },
});

export default HbfcCraditUpi;
