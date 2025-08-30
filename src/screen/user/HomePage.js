import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Responsive from '../../utils/Responsive';

const HomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 🔎 Top Search & Notification */}
        <View style={styles.topBar}>
          <TextInput
            placeholder={I18n.t('search')}
            placeholderTextColor={Colors.grey}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.notifyButton}>
            <Image
              source={require('../../assets/image/homeIcon/bell.png')}
              style={styles.notifyIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 🎯 Banner */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.banner}
        >
          <Text style={styles.bannerText}>{I18n.t('credit_upi_banner')}</Text>
        </LinearGradient>

        {/* ⚡ Quick Actions (3 per row) */}
        <Text style={styles.sectionTitle}>{I18n.t('quick_actions')}</Text>
        <View style={styles.grid}>
          <ActionButton3
            title={I18n.t('scan_pay')}
            image={require('../../assets/image/homeIcon/scan.png')}
          />
          <ActionButton3
            title={I18n.t('to_mobile')}
            image={require('../../assets/image/homeIcon/mobile.png')}
          />
          <ActionButton3
            title={I18n.t('to_bank')}
            image={require('../../assets/image/homeIcon/bank.png')}
          />
          <ActionButton3
            title={I18n.t('receive')}
            image={require('../../assets/image/homeIcon/receive.png')}
          />
          <ActionButton3
            title={I18n.t('self_transfer')}
            image={require('../../assets/image/homeIcon/transfer.png')}
          />
          <ActionButton3
            title={I18n.t('transaction_history')}
            image={require('../../assets/image/homeIcon/history.png')}
          />
        </View>

        {/* 💳 Credit & Loans */}
        <Text style={styles.sectionTitle}>{I18n.t('credit_loans')}</Text>
        <View style={styles.creditRow}>
          {/* Left Big Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 1 }}
            onPress={() => {}}
          >
            <LinearGradient
              colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
              style={styles.creditCard}
            >
              <Image
                source={require('../../assets/image/homeIcon/credit.png')}
                style={styles.creditIcon}
              />
              <Text style={styles.creditTitle}>{I18n.t('credit_upi')}</Text>
              <Text style={styles.creditSub}>
                {I18n.t('credit_upi_subtitle')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Right Column (stacked small buttons) */}
          <View style={styles.rightColumn}>
            <SmallButton
              title={I18n.t('add_credit_card')}
              image={require('../../assets/image/homeIcon/card.png')}
            />
            <SmallButton
              title={I18n.t('loan_offers')}
              image={require('../../assets/image/homeIcon/loan.png')}
            />
          </View>
        </View>

        {/* Bottom Row (2 buttons only) */}

        {/* 📱 Recharge & Bills (3 per row) */}
        <Text style={styles.sectionTitle}>{I18n.t('recharge_bills')}</Text>
        <View style={styles.grid}>
          <ActionButton3
            title={I18n.t('mobile_recharge')}
            image={require('../../assets/image/homeIcon/mobile.png')}
          />
          <ActionButton3
            title={I18n.t('electricity_bill')}
            image={require('../../assets/image/homeIcon/electricity.png')}
          />
          <ActionButton3
            title={I18n.t('fastag_recharge')}
            image={require('../../assets/image/homeIcon/fastag.png')}
          />
        </View>
        <View style={styles.bottomRow}>
          <ActionButton2
            title={I18n.t('check_balance')}
            image={require('../../assets/image/homeIcon/balance.png')}
          />
          <ActionButton2
            title={I18n.t('linked_account')}
            image={require('../../assets/image/homeIcon/link.png')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* 🔘 Action Button for 3 per row */
const ActionButton3 = ({ title, image }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn3}>
    <Image source={image} style={styles.actionIcon} resizeMode="contain" />
    <Text style={styles.actionText} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* 🔘 Action Button for 2 per row */
const ActionButton2 = ({ title, image }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn2}>
    <Image source={image} style={styles.action2Icon} resizeMode="contain" />
    <Text style={styles.actionText} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* 📌 Small Button inside Credit & Loans */
const SmallButton = ({ title, image }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.smallBtn}>
    <Image source={image} style={styles.smallIcon} />
    <Text style={styles.smallText} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(14),
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    color: Colors.white,
    paddingVertical: scaleUtils.scaleHeight(10),
    paddingHorizontal: scaleUtils.scaleWidth(15),
    borderRadius: scaleUtils.scaleWidth(10),
    marginRight: scaleUtils.scaleWidth(10),
    fontSize: scaleUtils.scaleFont(14),
  },
  notifyButton: {
    backgroundColor: Colors.primary,
    padding: scaleUtils.scaleWidth(10),
    borderRadius: 50,
  },
  notifyIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    tintColor: Colors.white,
  },
  banner: {
    borderRadius: scaleUtils.scaleWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
    paddingVertical: scaleUtils.scaleHeight(26),
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
  bannerText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginBottom: scaleUtils.scaleHeight(12),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  /* 3-per-row buttons */
  actionBtn3: {
    width: '30%',
    height: scaleUtils.scaleHeight(120),
    backgroundColor: Colors.secondaryBg,
    paddingVertical: scaleUtils.scaleHeight(16),
    borderRadius: scaleUtils.scaleWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleUtils.scaleHeight(12),
  },

  /* 2-per-row buttons */
  actionBtn2: {
    width: '48%',
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(10),
    height: scaleUtils.scaleHeight(60),
    backgroundColor: Colors.secondaryBg,
    paddingVertical: scaleUtils.scaleHeight(18),
    borderRadius: scaleUtils.scaleWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleUtils.scaleHeight(12),
  },

  actionIcon: {
    width: scaleUtils.scaleWidth(26),
    height: scaleUtils.scaleWidth(26),
    tintColor: Colors.primary,
    marginBottom: scaleUtils.scaleHeight(8),
  },
  action2Icon: {
    width: scaleUtils.scaleWidth(26),
    height: scaleUtils.scaleWidth(26),
    tintColor: Colors.primary,
    // marginBottom: scaleUtils.scaleHeight(8),
  },
  actionText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },

  /* Credit & Loans */
  creditRow: {
    flexDirection: 'row',
    marginBottom: scaleUtils.scaleHeight(12),
    columnGap: scaleUtils.scaleWidth(12),
  },
  creditCard: {
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleHeight(18),
    flex: 1,
    // marginRight: scaleUtils.scaleWidth(10),
  },
  creditIcon: {
    width: scaleUtils.scaleWidth(28),
    height: scaleUtils.scaleWidth(28),
    tintColor: Colors.white,
    marginBottom: scaleUtils.scaleHeight(8),
  },
  creditTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginBottom: scaleUtils.scaleHeight(4),
  },
  creditSub: {
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  rightColumn: {
    width: '30%',
    rowGap: scaleUtils.scaleHeight(10),
  },
  smallBtn: {
    backgroundColor: Colors.secondaryBg,
    borderRadius: scaleUtils.scaleWidth(12),
    paddingVertical: scaleUtils.scaleHeight(12),
    paddingHorizontal: scaleUtils.scaleWidth(6),
    alignItems: 'center',
    // marginBottom: scaleUtils.scaleHeight(10),
  },
  smallIcon: {
    width: scaleUtils.scaleWidth(22),
    height: scaleUtils.scaleWidth(22),
    tintColor: Colors.primary,
    marginBottom: scaleUtils.scaleHeight(6),
  },
  smallText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(11),
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(10),
  },
});
