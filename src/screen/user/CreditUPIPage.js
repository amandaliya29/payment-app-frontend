import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Header from '../../component/Header';
import Button from '../../component/Button';
import LineButton from '../../component/LineButton';
import moment from 'moment';
import { CreditUpiBankList } from '../../utils/apiHelper/Axios'; // ✅ import API
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';
const CreditUPIPage = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  // ✅ Fetch data dynamically
  useEffect(() => {
    const fetchCreditUpiBanks = async () => {
      try {
        const res = await CreditUpiBankList();
        if (res?.status && Array.isArray(res.data)) {
          const formattedData = res.data.map(item => {
            const isActive = !!item.bank_credit_upi;
            const creditLimit = item.bank_credit_upi
              ? parseFloat(item.bank_credit_upi.credit_limit)
              : 0;
            const availableCredit = item.bank_credit_upi
              ? parseFloat(item.bank_credit_upi.available_credit)
              : 0;
            const usedCredit = creditLimit - availableCredit;

            return {
              id: item.id.toString(),
              bankLogo: { uri: `${IMAGE_BASE_URL}${item.bank.logo}` },
              bankName: item.bank.name,
              account: item.account_number,
              limit: item.bank_credit_upi
                ? `₹${creditLimit.toLocaleString('en-IN')}`
                : null,
              available: item.bank_credit_upi
                ? `₹${availableCredit.toLocaleString('en-IN')}`
                : null,
              used: item.bank_credit_upi
                ? `₹${usedCredit.toLocaleString('en-IN')}`
                : null,
              lastUsed: item.bank_credit_upi
                ? moment(item.bank_credit_upi.updated_at).fromNow()
                : null,
              status: isActive ? 'active' : 'inactive',
            };
          });

          setBankAccounts(formattedData);
          const active = formattedData.filter(
            i => i.status === 'active',
          ).length;
          const inactive = formattedData.filter(
            i => i.status === 'inactive',
          ).length;
          setActiveCount(active);
          setInactiveCount(inactive);
        }
      } catch (error) {
        console.log('Error fetching Credit/UPI bank list:', error);
      }
    };

    fetchCreditUpiBanks();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />

      <View style={{ flex: 1, paddingHorizontal: scaleUtils.scaleWidth(14) }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: scaleUtils.scaleHeight(50) }}
        >
          {/* ✅ Dynamic Credit UPI Status */}
          <LinearGradient
            colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
            style={styles.statusBox}
          >
            <Text style={styles.statusTitle}>
              {I18n.t('credit_upi_status')}
            </Text>
            <Text style={styles.statusSub}>
              {I18n.t('credit_upi_status_subtitle')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: scaleUtils.scaleHeight(6),
              }}
            >
              <Text style={styles.activeText}>
                🟢 {activeCount} {I18n.t('account_active')}
              </Text>
              <Text style={styles.inactiveBankText}>
                🔴 {inactiveCount} {I18n.t('account_inactive')}
              </Text>
            </View>
          </LinearGradient>

          {/* ✅ Dynamic Bank Accounts */}
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {I18n.t('your_bank_accounts')}
          </Text>

          <FlatList
            data={bankAccounts}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <BankCard {...item} themeColors={themeColors} />
            )}
            contentContainerStyle={{
              paddingBottom: scaleUtils.scaleHeight(20),
            }}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>

        {/* Bottom Buttons (unchanged) */}
        <View
          style={[
            styles.bottomRow,
            { backgroundColor: themeColors.background },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Button
              title={I18n.t('add_new_bank')}
              onPress={() => console.log('Add Bank')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <LineButton
              title={I18n.t('transaction_history')}
              onPress={() => console.log('Transaction History')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const BankCard = ({
  bankLogo,
  bankName,
  account,
  limit,
  available,
  used,
  lastUsed,
  status,
  themeColors,
}) => {
  const navigation = useNavigation();
  const isActive = status === 'active';
  const isInactive = status === 'inactive';

  const handlePress = () => {
    if (isActive) {
      navigation.navigate('CreditUpiBankDetail', {
        bankLogo,
        bankName,
        account,
        limit,
        available,
        used,
        lastUsed,
        status,
      });
    } else {
      console.log('Bank is not active, navigation blocked');
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.bankCard, { backgroundColor: themeColors.secondaryBg }]}
    >
      <View style={styles.bankHeader}>
        <View style={styles.bankInfo}>
          <Image source={bankLogo} style={styles.bankIcon} />
          <View>
            <Text style={[styles.bankName, { color: themeColors.text }]}>
              {bankName}
            </Text>
            <Text style={[styles.bankSub, { color: themeColors.subText }]}>
              {account}
            </Text>
          </View>
        </View>
        {isActive && (
          <View style={[styles.badge, { backgroundColor: Colors.green }]}>
            <Text style={styles.badgeText}>{I18n.t('active')}</Text>
          </View>
        )}
        {isInactive && (
          <View style={[styles.badge, { backgroundColor: Colors.error }]}>
            <Text style={styles.badgeText}>{I18n.t('inactive')}</Text>
          </View>
        )}
      </View>

      {limit && (
        <>
          <View
            style={[styles.divider, { backgroundColor: themeColors.divider }]}
          />
          <View style={styles.creditRow}>
            <View>
              <Text style={[styles.label, { color: themeColors.subText }]}>
                {I18n.t('credit_limit')}:
              </Text>
              <Text style={[styles.value, { color: themeColors.subText }]}>
                {limit}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.label,
                  { color: themeColors.subText, textAlign: 'right' },
                ]}
              >
                {I18n.t('last_used')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: themeColors.subText, textAlign: 'right' },
                ]}
              >
                {lastUsed}
              </Text>
            </View>
          </View>
        </>
      )}

      {isActive && (
        <View
          style={[styles.creditRow, { marginTop: scaleUtils.scaleHeight(12) }]}
        >
          <View>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('available_credit')}:
            </Text>
            <Text style={[styles.value, { color: themeColors.subText }]}>
              {available}
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.label,
                { color: themeColors.subText, textAlign: 'right' },
              ]}
            >
              {I18n.t('used_credit')}:
            </Text>
            <Text
              style={[
                styles.value,
                { color: Colors.error, textAlign: 'right' },
              ]}
            >
              {used}
            </Text>
          </View>
        </View>
      )}

      {isInactive && (
        <>
          <View
            style={[styles.divider, { backgroundColor: themeColors.divider }]}
          />
          <View style={styles.inactiveRow}>
            <Text style={styles.inactiveText}>
              {I18n.t('credit_upi_not_activated')}
            </Text>
            <TouchableOpacity
              style={styles.activateBtn}
              onPress={() => navigation.navigate('CreditUPISetup')}
            >
              <Text style={styles.activateText}>{I18n.t('activate')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: scaleUtils.scaleWidth(14),
  },

  // Credit UPI Status
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
  },
  statusSub: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: scaleUtils.scaleHeight(8),
  },
  activeText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },

  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(5),
  },

  // Bank Card
  bankCard: {
    borderRadius: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(14),
    padding: scaleUtils.scaleWidth(14),
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(10),
  },
  bankIcon: {
    width: scaleUtils.scaleWidth(30),
    height: scaleUtils.scaleWidth(30),
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
  },
  bankSub: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
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

  // Credit Rows
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-SemiBold',
  },

  divider: {
    height: scaleUtils.scaleHeight(1),
    marginVertical: scaleUtils.scaleHeight(8),
  },

  // Inactive Section
  inactiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: scaleUtils.scaleFont(12),
    color: Colors.primary,
    width: '75%',
  },
  activateBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(8),
    paddingVertical: scaleUtils.scaleHeight(4),
    paddingHorizontal: scaleUtils.scaleWidth(8),
  },
  activateText: {
    color: Colors.primary,
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
  },

  // Bottom Row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: scaleUtils.scaleHeight(10),
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(16),
    columnGap: scaleUtils.scaleWidth(12),
    alignItems: 'center',
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(0),
    left: scaleUtils.scaleWidth(0),
    right: scaleUtils.scaleWidth(0),
  },
  inactiveBankText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default CreditUPIPage;
