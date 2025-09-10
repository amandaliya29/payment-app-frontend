import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import Button from '../../component/Button';
import { useNavigation } from '@react-navigation/native';
import Checkbox from '../../component/Checkbox';

const CreditUPITerms = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [agree, setAgree] = useState(false);

  const themeColors = {
    bg: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    buttonText: Colors.white,
  };

  const terms = [
    I18n.t('credit_upi_terms_1'),
    I18n.t('credit_upi_terms_2'),
    I18n.t('credit_upi_terms_3'),
    I18n.t('credit_upi_terms_4'),
    I18n.t('credit_upi_terms_5'),
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
    >
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.heading, { color: themeColors.text }]}>
          {I18n.t('credit_upi_terms_title')}
        </Text>

        {/* Gradient Card */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.cardGradient}
        >
          {terms.map((item, index) => (
            <View key={index} style={styles.termRow}>
              <View style={styles.iconWrapper}>
                <Image
                  source={require('../../assets/image/appIcon/check.png')}
                  style={styles.checkIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.termText, { color: Colors.white }]}>
                {item}
              </Text>
            </View>
          ))}
        </LinearGradient>

        {/* Checkbox Section */}
        <Checkbox
          checked={agree}
          onChange={setAgree}
          label={
            <Text style={[styles.agreeText, { color: themeColors.text }]}>
              {I18n.t('agree_terms_conditions')}
              <Text style={styles.link}> {I18n.t('terms_conditions')}</Text>
            </Text>
          }
        />

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title={I18n.t('agree_continue')}
            textStyle={{ color: themeColors.buttonText }}
            disabled={!agree}
            onPress={() => navigation.navigate('MobileHbfc')}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <Text style={[styles.footer, { color: themeColors.subText }]}>
        {I18n.t('credit_upi_footer')}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    padding: scaleUtils.scaleHeight(16),
    paddingBottom: scaleUtils.scaleHeight(60),
  },
  heading: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  cardGradient: {
    borderRadius: scaleUtils.scaleWidth(12),
    paddingVertical: scaleUtils.scaleHeight(14),
    paddingHorizontal: scaleUtils.scaleWidth(14),
    marginBottom: scaleUtils.scaleHeight(16),
    rowGap: scaleUtils.scaleHeight(14),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(12),
    // marginBottom: scaleUtils.scaleHeight(12),
  },
  iconWrapper: {
    width: scaleUtils.scaleWidth(22),
    height: scaleUtils.scaleWidth(22),
    borderRadius: scaleUtils.scaleWidth(11),
    backgroundColor: Colors.cardGrey,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  checkIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
    tintColor: Colors.primary,
  },
  termText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  agreeText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(20),
  },
  link: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
    color: Colors.primary,
  },
  buttonWrapper: { marginVertical: scaleUtils.scaleHeight(10) },
  footer: {
    textAlign: 'center',
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(20),
    alignSelf: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
});

export default CreditUPITerms;
