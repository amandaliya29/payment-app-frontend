import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const HbfcCreditLimitActivate = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Theme Colors
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    cardBg: isDark ? Colors.secondary : Colors.cardGrey,
    primary: Colors.primary,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('credit_upi_setup')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Section */}
        <View style={styles.topContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Image
              source={require('../../assets/image/appIcon/success.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {I18n.t('hbfc_credit_limit_ready')}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subText }]}>
            {I18n.t('hbfc_credit_limit_message')}
          </Text>
        </View>

        {/* Credit Limit Details */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.card}
        >
          <Text style={[styles.limitTitle, { color: themeColors.text }]}>
            {I18n.t('hbfc_credit_limit')}
          </Text>
          <Text style={[styles.limitAmount, { color: themeColors.text }]}>
            ₹50,000
          </Text>
          <Text
            style={[styles.limitDescription, { color: themeColors.subText }]}
          >
            {I18n.t('hbfc_credit_limit_desc')}
          </Text>
        </LinearGradient>

        {/* Activate Button */}
        <Button
          title={I18n.t('hbfc_verify_activate')}
          onPress={() => navigation.navigate('HbfcCrditLoadingScreen')}
        />

        {/* Terms & Conditions */}
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: themeColors.subText }]}>
            {I18n.t('hbfc_terms_condition')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HbfcCreditLimitActivate;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingBottom: scaleUtils.scaleHeight(20),
  },
  topContainer: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(30),
  },
  iconContainer: {
    borderRadius: scaleUtils.scaleWidth(50),
    padding: scaleUtils.scaleWidth(26),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  iconImage: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
    tintColor: Colors.white,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  card: {
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(20),
    marginVertical: scaleUtils.scaleHeight(20),
    alignItems: 'center',
  },
  limitTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
  limitAmount: {
    fontSize: scaleUtils.scaleFont(26),
    fontFamily: 'Poppins-Bold',
    marginVertical: scaleUtils.scaleHeight(10),
  },
  limitDescription: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
});
