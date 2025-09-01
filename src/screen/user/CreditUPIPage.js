import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Header from '../../component/Header';

const CreditUPIPage = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.grey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Header at top */}
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Credit UPI Status */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.statusBox}
        >
          <Text style={styles.statusTitle}>{I18n.t('credit_upi_status')}</Text>
          <Text style={styles.statusSub}>
            {I18n.t('credit_upi_status_subtitle')}
          </Text>
          <View style={styles.statusRow}>
            <Text style={styles.activeText}>🟢 {I18n.t('one_active')}</Text>
            <Text style={styles.inactiveText}>🔴 {I18n.t('one_inactive')}</Text>
          </View>
        </LinearGradient>

        {/* Bank Accounts */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('your_bank_accounts')}
        </Text>

        {/* SBI Card */}
        <BankCard
          bankLogo={require('../../assets/image/bankIcon/sbi.png')}
          bankName="State Bank of India"
          account="****2847"
          limit="₹50,000"
          available="₹47,250"
          used="₹2,750"
          lastUsed="2 days ago"
          active
        />

        {/* HDFC Card */}
        <BankCard
          bankLogo={require('../../assets/image/bankIcon/hdfc.png')}
          bankName="HDFC Bank"
          account="****9134"
          inactive
        />
      </ScrollView>
      {/* Bottom Buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>{I18n.t('add_new_bank')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyBtn}>
          <Text style={styles.historyText}>
            {I18n.t('transaction_history')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* Bank Account Card Component */
const BankCard = ({
  bankLogo,
  bankName,
  account,
  limit,
  available,
  used,
  lastUsed,
  active,
  inactive,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.grey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
  };
  return (
    <View
      style={[
        styles.bankCard,
        {
          borderColor: active
            ? Colors.success
            : inactive
              ? Colors.error
              : Colors.cardGrey,
          backgroundColor: isDark ? Colors.secondaryBg : Colors.cardGrey,
        },
      ]}
    >
      <View style={styles.bankHeader}>
        <Image source={bankLogo} style={styles.bankIcon} />
        <Text style={[styles.bankName, { color: themeColors.text }]}>
          {bankName}
        </Text>
        {active && (
          <Text style={[styles.activeBadge, { color: themeColors.subText }]}>
            {I18n.t('active')}
          </Text>
        )}
        {inactive && (
          <Text style={styles.inactiveBadge}>{I18n.t('inactive')}</Text>
        )}
      </View>

      <Text style={[styles.bankSub, { color: themeColors.subText }]}>
        {I18n.t('account')}: {account}
      </Text>
      {limit && (
        <Text style={[styles.bankSub, { color: themeColors.subText }]}>
          {I18n.t('credit_limit')}: {limit}
        </Text>
      )}
      <View
        style={{
          width: '100%',
          height: scaleUtils.scaleHeight(1),
          backgroundColor: Colors.white,
          marginVertical: scaleUtils.scaleHeight(8),
        }}
      />

      {active && (
        <>
          <View style={styles.creditRow}>
            <View>
              <Text style={[styles.available, { color: themeColors.subText }]}>
                {I18n.t('available_credit')}:
              </Text>
              <Text style={[styles.available, { color: themeColors.subText }]}>
                {available}
              </Text>
            </View>
            <View>
              <Text style={styles.used}>{I18n.t('used_credit')}:</Text>
              <Text style={styles.used}>{used}</Text>
            </View>
            <View>
              <Text style={[styles.lastUsed, { color: themeColors.subText }]}>
                {I18n.t('last_used')}:
              </Text>
              <Text style={[styles.lastUsed, { color: themeColors.subText }]}>
                {lastUsed}
              </Text>
            </View>
          </View>
        </>
      )}

      {inactive && (
        <>
          <Text style={styles.inactiveText}>
            {I18n.t('credit_upi_not_activated')}
          </Text>
          <TouchableOpacity style={styles.activateBtn}>
            <Text style={styles.activateText}>{I18n.t('activate')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CreditUPIPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: scaleUtils.scaleWidth(14) },

  /* Credit UPI Status */
  statusBox: {
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(20),
    paddingVertical: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
  statusTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginBottom: 4,
  },
  statusSub: {
    fontSize: scaleUtils.scaleFont(12),
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  activeText: { color: Colors.success, fontWeight: '600' },
  inactiveText: { color: Colors.error, fontWeight: '600' },

  /* Bank Card */
  bankCard: {
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(14),
    padding: scaleUtils.scaleWidth(14),
  },
  bankHeader: { flexDirection: 'row', alignItems: 'center' },
  bankIcon: {
    width: scaleUtils.scaleWidth(32),
    height: scaleUtils.scaleWidth(32),
    marginRight: 10,
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  activeBadge: { color: Colors.success, fontWeight: '700' },
  inactiveBadge: { color: Colors.error, fontWeight: '700' },

  bankSub: {
    fontSize: scaleUtils.scaleFont(12),
    marginVertical: 2,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  available: { color: Colors.success, fontWeight: '600', textAlign: 'center' },
  used: { color: Colors.error, fontWeight: '600', textAlign: 'center' },
  lastUsed: { fontWeight: '600', color: Colors.white, textAlign: 'center' },

  activateBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(8),
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  activateText: { color: Colors.primary, fontWeight: '600' },

  /* About Section */
  aboutBox: {
    borderRadius: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(14),
    padding: scaleUtils.scaleWidth(14),
    backgroundColor: Colors.secondaryBg,
  },
  aboutTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    color: Colors.white,
  },
  aboutSub: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },

  /* Bottom Buttons */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleUtils.scaleHeight(10),
    marginHorizontal: scaleUtils.scaleWidth(14),
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: scaleUtils.scaleWidth(12),
    flex: 1,
    marginRight: 8,
  },
  addText: { color: Colors.white, fontWeight: '600', textAlign: 'center' },
  historyBtn: {
    backgroundColor: Colors.secondaryBg,
    paddingVertical: 14,
    borderRadius: scaleUtils.scaleWidth(12),
    flex: 1,
    marginLeft: 8,
  },
  historyText: { fontWeight: '600', textAlign: 'center', color: Colors.white },
});
