import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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

const TransactionSuccessScreen = () => {
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

  // Example dynamic transaction data
  const transaction = {
    fromName: 'Ravi Kumar Sharma',
    fromPhone: '+91 98254 67890',
    toName: 'Neha Patel',
    toUpi: 'nehapatel98@okaxis',
    fromUpi: 'ravikumarsharma@oksbi',
    bank: 'State Bank of India • 4129',
    amount: '₹1,250',
    status: 'completed',
    date: '21 Oct 2025, 10:15 AM',
    upiTxnId: '928457109231',
    googleTxnId: 'CICAgIDk7PQEdw',
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Header */}
      <Header
        title={I18n.t('transactionDetails')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {transaction.fromName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {I18n.t('from')} {transaction.fromName}
          </Text>
          <Text style={[styles.phone, { color: themeColors.subText }]}>
            {transaction.fromPhone}
          </Text>
        </View>

        <Text style={[styles.amount, { color: themeColors.text }]}>
          {transaction.amount}
        </Text>

        <View style={styles.statusRow}>
          <Image
            source={require('../../assets/image/appIcon/success.png')}
            style={styles.statusIcon}
          />
          <Text style={[styles.status, { color: Colors.darkGreen }]}>
            {I18n.t(transaction.status)}
          </Text>
        </View>

        <Text style={[styles.date, { color: themeColors.subText }]}>
          {transaction.date}
        </Text>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <View style={styles.bankRow}>
            <Image
              source={require('../../assets/image/bankIcon/sbi.png')}
              style={styles.bankLogo}
            />
            <Text style={[styles.bankName, { color: themeColors.text }]}>
              {transaction.bank}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('upiTransactionId')}
            </Text>
            <Text style={[styles.value, { color: themeColors.text }]}>
              {transaction.upiTxnId}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('to')} :
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.value, { color: themeColors.text }]}>
                {transaction.toName}
              </Text>
              <Text style={[styles.subValue, { color: themeColors.subText }]}>
                Cya Pay • {transaction.toUpi}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('from')} :
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.value, { color: themeColors.text }]}>
                {transaction.fromName} ({transaction.bank})
              </Text>
              <Text style={[styles.subValue, { color: themeColors.subText }]}>
                Cya Pay • {transaction.fromUpi}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.footerText, { color: themeColors.subText }]}>
          {I18n.t('paymentDelayNote')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionSuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: scaleUtils.scaleWidth(20),
    paddingBottom: scaleUtils.scaleHeight(20),
  },
  userSection: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(30),
  },
  avatar: {
    backgroundColor: Colors.primary,
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(60),
    borderRadius: scaleUtils.scaleWidth(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(28),
  },
  name: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(10),
  },
  phone: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
  amount: {
    fontSize: scaleUtils.scaleFont(36),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  statusIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    tintColor: Colors.darkGreen,
    marginRight: 8,
  },
  status: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Medium',
  },
  date: {
    fontSize: scaleUtils.scaleFont(13),
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  card: {
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(16),
    marginTop: scaleUtils.scaleHeight(20),
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(25),
    height: scaleUtils.scaleWidth(25),
    marginRight: 8,
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey,
    marginVertical: scaleUtils.scaleHeight(10),
  },
  row: {
    justifyContent: 'space-between',
    marginVertical: scaleUtils.scaleHeight(4),
  },
  label: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Bold',
  },
  value: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  subValue: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  footerText: {
    fontSize: scaleUtils.scaleFont(12),
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
});
