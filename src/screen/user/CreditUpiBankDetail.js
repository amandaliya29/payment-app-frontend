import React from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Header from '../../component/Header';
import * as Progress from 'react-native-progress';

const CreditUpiBankDetail = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.cardDark : Colors.white,
    buttonBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('credit_upi_dashboard')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Credit Card */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.topCard}
        >
          <View style={styles.row}>
            <Text style={styles.email}>nikhil@creditupi</Text>
            <Text style={styles.active}>{I18n.t('active')}</Text>
          </View>
          <Text style={styles.bank}>HDFC Bank</Text>

          <View style={styles.limitRow}>
            <View>
              <Text style={styles.label}>{I18n.t('available_limit')}</Text>
              <Text style={styles.amount}>₹35,000</Text>
            </View>
            <Text style={styles.totalLimit}>₹100,000</Text>
          </View>

          <Progress.Bar
            progress={0.35}
            width={null}
            color={Colors.white}
            height={6}
            borderRadius={4}
          />

          <View style={styles.buttonRow}>
            {[
              'pay_now',
              'view_transactions',
              'check_rewards',
              'manage_upi',
            ].map(key => (
              <TouchableOpacity key={key} style={styles.actionButton}>
                <Text style={styles.actionText}>{I18n.t(key)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Insights Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('insights_benefits')}
        </Text>
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <View style={styles.transactionRow}>
            <Text style={[styles.transactionText, { color: themeColors.text }]}>
              15 Apr Big Bazaar
            </Text>
            <Text
              style={[styles.transactionAmount, { color: themeColors.text }]}
            >
              ₹3,200
            </Text>
          </View>

          <Text style={[styles.label, { color: themeColors.subText }]}>
            {I18n.t('spend_tracker')}
          </Text>
          <Text style={[styles.spendLimit, { color: themeColors.subText }]}>
            ₹15,000 of ₹35,000
          </Text>

          <Progress.Bar
            progress={15000 / 35000}
            width={null}
            color="#007AFF"
            height={6}
            borderRadius={4}
          />

          <View style={styles.billRow}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('upcoming_bill')}
            </Text>
            <Text
              style={[styles.transactionAmount, { color: themeColors.text }]}
            >
              6 Jun
            </Text>
          </View>
        </View>

        {/* Rewards & Offers */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: themeColors.buttonBg },
            ]}
          >
            <Text style={styles.actionText}>{I18n.t('rewards')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: themeColors.buttonBg },
            ]}
          >
            <Text style={styles.actionText}>{I18n.t('offers')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditUpiBankDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: scaleUtils.scaleWidth(14) },
  topCard: {
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(20),
    paddingVertical: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  email: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  active: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  bank: {
    marginVertical: 5,
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
  amount: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
  },
  totalLimit: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
    margin: 5,
  },
  actionText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.primary,
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 10,
  },
  card: {
    borderRadius: scaleUtils.scaleWidth(12),
    paddingVertical: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(14),
    marginVertical: scaleUtils.scaleHeight(20),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  transactionText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  transactionAmount: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-SemiBold',
  },
  spendLimit: { fontSize: scaleUtils.scaleFont(12), marginBottom: 5 },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
