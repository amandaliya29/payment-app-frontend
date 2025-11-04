import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Header from '../../component/Header';
import * as Progress from 'react-native-progress';

const CreditUpiBankDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    bankLogo,
    bankName,
    account,
    limit,
    available,
    used,
    lastUsed,
    status,
    bankCreditUpiId,
  } = route.params || {};

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    card: isDark ? Colors.secondaryBg : Colors.white,
    buttonBg: isDark ? Colors.primary : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  const availableLimit = Number(String(available).replace(/[^0-9.]/g, '')) || 0;
  const totalLimit = Number(String(limit).replace(/[^0-9.]/g, '')) || 0;
  const progressValue = totalLimit > 0 ? availableLimit / totalLimit : 0;
  const usedAmount = Number(String(used).replace(/[^0-9.]/g, '')) || 0;

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
            <Text style={styles.email}>{bankCreditUpiId}</Text>
            <View style={[styles.badge, { backgroundColor: Colors.green }]}>
              <Text style={styles.badgeText}>{I18n.t('active')}</Text>
            </View>
          </View>
          <View style={styles.bankInfo}>
            <View style={styles.imageWrapperStyle}>
              <Image source={bankLogo} style={styles.bankIcon} />
            </View>
            <View>
              <Text style={[styles.bankName, { color: Colors.white }]}>
                {bankName}
              </Text>
              <Text style={[styles.bankSub, { color: Colors.white }]}>
                {account}
              </Text>
            </View>
          </View>

          <View style={styles.limitRow}>
            <View>
              <Text style={styles.label}>{I18n.t('available_limit')}</Text>
              <Text style={styles.amount}>₹{availableLimit}</Text>
            </View>
            <Text style={styles.totalLimit}>₹{totalLimit}</Text>
          </View>

          <Progress.Bar
            progress={progressValue}
            width={null}
            color={Colors.white}
            height={scaleUtils.scaleHeight(6)}
            borderRadius={scaleUtils.scaleHeight(6)}
          />

          <View style={styles.buttonRow}>
            {['pay_now', 'view_transactions'].map(key => (
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
          <Text style={[styles.label, { color: themeColors.subText }]}>
            {I18n.t('spend_tracker')}
          </Text>
          <Text style={[styles.spendLimit, { color: themeColors.subText }]}>
            ₹{usedAmount} of ₹{totalLimit}
          </Text>

          <Progress.Bar
            progress={totalLimit > 0 ? usedAmount / totalLimit : 0}
            width={null}
            color={Colors.primary}
            height={scaleUtils.scaleHeight(6)}
            borderRadius={scaleUtils.scaleHeight(6)}
          />

          <View style={styles.billRow}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('upcoming_bill')}
            </Text>
            <Text
              style={[styles.transactionAmount, { color: themeColors.text }]}
            >
              {lastUsed || 'N/A'}
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
            <Text style={[styles.actionText, { color: themeColors.text }]}>
              {I18n.t('rewards')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: themeColors.buttonBg },
            ]}
          >
            <Text style={[styles.actionText, { color: themeColors.text }]}>
              {I18n.t('offers')}
            </Text>
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
    marginTop: scaleUtils.scaleHeight(10),
  },
  actionButton: {
    width: '46%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(6),
    height: scaleUtils.scaleHeight(35),
    borderWidth: 0.5,
    borderColor: Colors.white,
    marginTop: scaleUtils.scaleHeight(10),
  },
  actionText: {
    fontSize: scaleUtils.scaleFont(12),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(8),
  },
  card: {
    borderRadius: scaleUtils.scaleWidth(12),
    paddingVertical: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(14),
    marginBottom: scaleUtils.scaleHeight(20),
    marginTop: scaleUtils.scaleHeight(14),
    borderWidth: 0.2,
    borderColor: Colors.black,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
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
  spendLimit: {
    fontSize: scaleUtils.scaleFont(12),
    marginVertical: scaleUtils.scaleHeight(4),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleUtils.scaleHeight(10),
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  badge: {
    paddingHorizontal: scaleUtils.scaleWidth(10),
    paddingVertical: scaleUtils.scaleHeight(3),
    borderRadius: scaleUtils.scaleWidth(8),
  },
  badgeText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(10),
  },
  bankIcon: {
    width: scaleUtils.scaleWidth(30),
    height: scaleUtils.scaleWidth(30),
    resizeMode: 'contain',
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
  },
  bankSub: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  imageWrapperStyle: {
    width: scaleUtils.scaleWidth(45),
    height: scaleUtils.scaleWidth(45),
    borderRadius: scaleUtils.scaleWidth(6),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
