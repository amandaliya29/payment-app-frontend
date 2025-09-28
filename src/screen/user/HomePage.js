import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
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
import i18n from '../../utils/language/i18n';
import Input from '../../component/Input';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../utils/language/LanguageContext';

const HomePage = () => {
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const isDark = scheme === 'dark';
  const [search, setSearch] = useState('');

  // Get language context to re-render on change
  const { language } = useContext(LanguageContext);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.white,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    card: isDark ? Colors.card : Colors.cardGrey,
  };

  const banks = [
    {
      id: 1,
      name: 'State Bank of India',
      balance: '2,50,000',
      accountNumber: 'XXXX XXXX XXXX 1234',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/sbi.png'),
    },
    {
      id: 2,
      name: 'HDFC Bank',
      balance: '1,10,500',
      accountNumber: 'XXXX XXXX XXXX 5678',
      type: 'Current',
      logo: require('../../assets/image/bankIcon/hdfc.png'),
    },
    {
      id: 3,
      name: 'ICICI Bank',
      balance: '95,000',
      accountNumber: 'XXXX XXXX XXXX 9012',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/icici.png'),
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 🔎 Top Search & Notification */}
        <View style={styles.topBar}>
          <View style={{ flex: 1, marginRight: scaleUtils.scaleWidth(10) }}>
            <Input
              isSearch
              value={search}
              onChange={setSearch}
              placeholder={i18n.t('search')}
              onSearchPress={() => console.log('Search Pressed:', search)}
            />
          </View>
          <TouchableOpacity
            style={styles.notifyButton}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Image
              source={require('../../assets/image/homeIcon/user.png')}
              style={[styles.notifyIcon]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate('HbfcCraditUpi');
          }}
        >
          <LinearGradient
            colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
            style={styles.banner}
          >
            <Text style={[styles.bannerText, { color: Colors.white }]}>
              {i18n.t('credit_upi_banner')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ⚡ Quick Actions (3 per row) */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {i18n.t('quick_actions')}
        </Text>
        <View style={styles.grid}>
          <ActionButton3
            onPress={() => navigation.navigate('QrPage')}
            title={i18n.t('scan_pay')}
            image={require('../../assets/image/homeIcon/scan.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('to_mobile')}
            image={require('../../assets/image/homeIcon/mobile.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('to_bank')}
            image={require('../../assets/image/homeIcon/bank.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            onPress={() => navigation.navigate('ReceiveMoneyScreen')}
            title={i18n.t('receive')}
            image={require('../../assets/image/homeIcon/receive.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('self_transfer')}
            image={require('../../assets/image/homeIcon/transfer.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('transaction_history')}
            image={require('../../assets/image/homeIcon/history.png')}
            themeColors={themeColors}
          />
        </View>

        {/* 💳 Credit & Loans */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {i18n.t('credit_loans')}
        </Text>
        <View style={styles.creditRow}>
          {/* Left Big Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 1 }}
            onPress={() => {
              navigation.navigate('CreditUPIPage');
            }}
          >
            <LinearGradient
              colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
              style={styles.creditCard}
            >
              <Image
                source={require('../../assets/image/homeIcon/credit.png')}
                style={styles.creditIcon}
              />
              <Text style={[styles.creditTitle, { color: Colors.white }]}>
                {i18n.t('credit_upi')}
              </Text>
              <Text style={[styles.creditSub, { color: themeColors.subText }]}>
                {i18n.t('credit_upi_subtitle')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Right Column (stacked small buttons) */}
          <View style={styles.rightColumn}>
            <SmallButton
              title={i18n.t('add_credit_card')}
              image={require('../../assets/image/homeIcon/card.png')}
              themeColors={themeColors}
            />
            <SmallButton
              title={i18n.t('loan_offers')}
              image={require('../../assets/image/homeIcon/loan.png')}
              themeColors={themeColors}
            />
          </View>
        </View>

        {/* 📱 Recharge & Bills */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {i18n.t('recharge_bills')}
        </Text>
        <View style={styles.grid}>
          <ActionButton3
            title={i18n.t('mobile_recharge')}
            image={require('../../assets/image/homeIcon/mobile.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('electricity_bill')}
            image={require('../../assets/image/homeIcon/electricity.png')}
            themeColors={themeColors}
          />
          <ActionButton3
            title={i18n.t('fastag_recharge')}
            image={require('../../assets/image/homeIcon/fastag.png')}
            themeColors={themeColors}
          />
        </View>
        <View style={styles.bottomRow}>
          <ActionButton2
            onPress={() => {
              if (banks.length === 1) {
                navigation.navigate('BankBalanceScreen', { bank: banks[0] });
              } else {
                navigation.navigate('SelectBankScreen', { banks });
              }
            }}
            title={i18n.t('check_balance')}
            image={require('../../assets/image/homeIcon/balance.png')}
            themeColors={themeColors}
          />
          <ActionButton2
            title={i18n.t('linked_account')}
            image={require('../../assets/image/homeIcon/link.png')}
            themeColors={themeColors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* 🔘 Action Button for 3 per row */
const ActionButton3 = ({ title, image, themeColors, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.actionBtn3, { backgroundColor: themeColors.secondaryBg }]}
  >
    <Image source={image} style={styles.actionIcon} resizeMode="contain" />
    <Text
      style={[styles.actionText, { color: themeColors.text }]}
      numberOfLines={2}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

/* 🔘 Action Button for 2 per row */
const ActionButton2 = ({ title, image, themeColors, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.actionBtn2, { backgroundColor: themeColors.secondaryBg }]}
  >
    <Image source={image} style={styles.action2Icon} resizeMode="contain" />
    <Text
      style={[styles.actionText, { color: themeColors.text }]}
      numberOfLines={2}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

/* 📌 Small Button inside Credit & Loans */
const SmallButton = ({ title, image, themeColors }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[styles.smallBtn, { backgroundColor: themeColors.secondaryBg }]}
  >
    <Image source={image} style={styles.smallIcon} />
    <Text
      style={[styles.smallText, { color: themeColors.text }]}
      numberOfLines={2}
    >
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
  },
  notifyButton: {
    backgroundColor: Colors.primary,
    padding: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(50),
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
  },
  actionText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  creditRow: {
    flexDirection: 'row',
    marginBottom: scaleUtils.scaleHeight(12),
    columnGap: scaleUtils.scaleWidth(12),
  },
  creditCard: {
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleHeight(18),
    flex: 1,
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
