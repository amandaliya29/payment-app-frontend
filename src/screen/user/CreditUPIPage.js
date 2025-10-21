import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
  FlatList,
  ScrollView,
  ActivityIndicator, // ✅ added
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
import { CreditUpiBankList } from '../../utils/apiHelper/Axios';
import { useDispatch } from 'react-redux';
import { setSelectedBank } from '../../utils/redux/UserSlice';
import { Toast } from '../../utils/Toast'; // ✅ Added custom Toast
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

const CreditUPIPage = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [loading, setLoading] = useState(false); // ✅ Added loader state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(false);
    setTimeout(() => {
      setToastVisible(true);
    }, 100);
  };

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  useEffect(() => {
    const fetchCreditUpiBanks = async () => {
      try {
        setLoading(true); // ✅ show loader
        const res = await CreditUpiBankList();
        if (res.data?.status && Array.isArray(res.data?.data)) {
          const formattedData = res.data.data.map(item => {
            const hasCreditUpi = !!item.bank_credit_upi;
            const isActive =
              hasCreditUpi && item.bank_credit_upi.status === 'active';
            const isInactive =
              hasCreditUpi && item.bank_credit_upi.status === 'inactive';
            const creditLimit = hasCreditUpi
              ? parseFloat(item.bank_credit_upi.credit_limit)
              : 0;
            const availableCredit = hasCreditUpi
              ? parseFloat(item.bank_credit_upi.available_credit)
              : 0;
            const usedCredit = creditLimit - availableCredit;

            return {
              id: item.id.toString(),
              bankLogo: { uri: `${IMAGE_BASE_URL}${item.bank.logo}` },
              bankName: item.bank.name,
              account: item.account_number,
              limit: hasCreditUpi
                ? `₹${creditLimit.toLocaleString('en-IN')}`
                : null,
              available: hasCreditUpi
                ? `₹${availableCredit.toLocaleString('en-IN')}`
                : null,
              used: hasCreditUpi
                ? `₹${usedCredit.toLocaleString('en-IN')}`
                : null,
              lastUsed: hasCreditUpi
                ? moment(item.bank_credit_upi.updated_at).fromNow()
                : null,
              status: isActive ? 'active' : isInactive ? 'inactive' : 'no_upi',
              bank_credit_upi: item.bank_credit_upi || null,
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
        } else {
          showToast('Failed to load bank list');
        }
      } catch (error) {
        showToast(
          error.response?.data?.messages ||
            'Something went wrong while fetching bank list',
        );
      } finally {
        setLoading(false); // ✅ hide loader
      }
    };

    fetchCreditUpiBanks();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('credit_upi')} onBack={() => navigation.goBack()} />

      {loading ? ( // ✅ show loader here
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: scaleUtils.scaleWidth(14) }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: scaleUtils.scaleHeight(50) }}
          >
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
                  🔴 {bankAccounts.length - activeCount}{' '}
                  {I18n.t('account_inactive')}
                </Text>
              </View>
            </LinearGradient>

            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {I18n.t('your_bank_accounts')}
            </Text>

            <FlatList
              data={bankAccounts}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <BankCard
                  {...item}
                  themeColors={themeColors}
                  showToast={showToast}
                />
              )}
              contentContainerStyle={{
                paddingBottom: scaleUtils.scaleHeight(20),
              }}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>

          <View
            style={[
              styles.bottomRow,
              { backgroundColor: themeColors.background },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Button
                title={I18n.t('add_new_bank')}
                onPress={() => showToast('Add New Bank feature coming soon!')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <LineButton
                title={I18n.t('transaction_history')}
                onPress={() => showToast('Transaction History opening soon!')}
              />
            </View>
          </View>
        </View>
      )}

      {/* ✅ Custom Toast Component */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const BankCard = memo(
  ({
    bankLogo,
    bankName,
    account,
    limit,
    available,
    used,
    lastUsed,
    status,
    id,
    themeColors,
    bank_credit_upi,
    showToast,
  }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const isActive = status === 'active';
    const isInactive = status === 'inactive';
    const hasNoUpi = status === 'no_upi';

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
          bankCreditUpiId: bank_credit_upi?.id || null,
        });
      } else {
        showToast('Bank is not active, cannot open details');
      }
    };

    const handleActivatePress = () => {
      dispatch(
        setSelectedBank({
          id,
          bankLogo,
          bankName,
          account,
          limit,
          available,
          used,
          lastUsed,
          status,
          bankCreditUpiId: bank_credit_upi?.id || null,
        }),
      );

      if (hasNoUpi) {
        navigation.navigate('CreditUPISetup');
      } else {
        navigation.navigate('CreditSetPinPage', {
          bankCreditUpiId: bank_credit_upi?.id,
        });
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8} // 🔹 Press effect only for active banks
        disabled={!isActive} // 🔹 Disable press when not active
        onPress={isActive ? handlePress : () => showToast('Bank is not active')}
        style={[
          styles.bankCard,
          {
            backgroundColor: themeColors.secondaryBg,
            opacity: 1, // 🔹 Dim inactive cards slightly
          },
        ]}
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

          {isInactive && limit && (
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
            style={[
              styles.creditRow,
              { marginTop: scaleUtils.scaleHeight(12) },
            ]}
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

        {(isInactive || hasNoUpi) && (
          <>
            <View
              style={[styles.divider, { backgroundColor: themeColors.divider }]}
            />
            <View style={styles.inactiveRow}>
              <Text style={styles.inactiveText}>
                {hasNoUpi
                  ? I18n.t('credit_upi_not_activated')
                  : I18n.t('set_pin_to_activate')}
              </Text>
              <TouchableOpacity
                style={styles.activateBtn}
                onPress={handleActivatePress}
              >
                <Text style={styles.activateText}>
                  {hasNoUpi ? I18n.t('activate') : I18n.t('set_pin')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  inactiveBankText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(5),
  },
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
  creditRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: scaleUtils.scaleFont(12), fontFamily: 'Poppins-Regular' },
  value: { fontSize: scaleUtils.scaleFont(13), fontFamily: 'Poppins-SemiBold' },
  divider: {
    height: scaleUtils.scaleHeight(1),
    marginVertical: scaleUtils.scaleHeight(8),
  },
  inactiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: scaleUtils.scaleFont(12),
    color: Colors.primary,
    width: '75%',
    marginVertical: scaleUtils.scaleHeight(10),
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(16),
    columnGap: scaleUtils.scaleWidth(12),
    alignItems: 'center',
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(0),
    left: scaleUtils.scaleWidth(0),
    right: scaleUtils.scaleWidth(0),
  },
});

export default CreditUPIPage;
