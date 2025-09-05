import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import { useNavigation } from '@react-navigation/native';
import Button from '../../component/Button';

const CreditUPIStatusScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    primary: Colors.primary,
    card: isDark ? Colors.secondaryBg : Colors.cardGrey,
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
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.successIcon}>
            <Image
              source={require('../../assets/image/appIcon/success.png')}
              style={styles.iconImage}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: Colors.darkGreen }]}>
          {I18n.t('credit_upi_activated')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('upi_success_message')}
        </Text>

        {/* Bank Details Card */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            {I18n.t('bank_details')}
          </Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('bank_name')}
            </Text>
            <Text style={[styles.value, { color: themeColors.text }]}>
              HDFC Bank
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('credit_limit')}
            </Text>
            <Text style={[styles.value, { color: Colors.primary }]}>
              ₹2,50,000
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('upi_id')}
            </Text>
            <Text style={[styles.value, { color: Colors.primary }]}>
              9876543210@hdfcbank
            </Text>
          </View>
        </View>

        {/* Button */}
        <Button
          title={I18n.t('setup_upi_pin')}
          onPress={() => navigation.navigate('CreditSetPinPage')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditUPIStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: scaleUtils.scaleWidth(20),
    paddingBottom: scaleUtils.scaleHeight(20),
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  successIcon: {
    backgroundColor: Colors.successGreen,
    borderRadius: scaleUtils.scaleWidth(60),
    padding: scaleUtils.scaleWidth(25),
  },
  iconImage: {
    width: scaleUtils.scaleWidth(50),
    height: scaleUtils.scaleWidth(50),
    tintColor: Colors.white,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(8),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  card: {
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(16),
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  cardTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(8),
  },
  divider: {
    height: scaleUtils.scaleHeight(1),
    backgroundColor: Colors.grey,
    marginBottom: scaleUtils.scaleHeight(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scaleUtils.scaleHeight(4),
  },
  label: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  reminderCard: {
    backgroundColor: '#2F2B4A',
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(14),
    marginTop: scaleUtils.scaleHeight(20),
  },
  reminderTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
  },
  reminderText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    marginTop: scaleUtils.scaleHeight(5),
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: scaleUtils.scaleHeight(14),
    borderRadius: scaleUtils.scaleWidth(12),
    marginTop: scaleUtils.scaleHeight(30),
    alignItems: 'center',
  },
  btnText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
  },
});
