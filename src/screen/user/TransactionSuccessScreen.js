import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTransaction } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

const TransactionSuccessScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const route = useRoute();
  const { transaction_id } = route?.params;

  const [transaction, setTransaction] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    primary: Colors.primary,
    card: isDark ? Colors.secondaryBg : Colors.cardGrey,
  };

  useEffect(() => {
    if (transaction_id) fetchTransaction();
  }, [transaction_id]);

  const fetchTransaction = async () => {
    try {
      const res = await getTransaction(transaction_id);

      if (res?.data?.status) {
        const data = res.data.data;
        const authRole = data.auth_role;

        // Determine From/To
        const fromLabel = authRole === 'sender' ? I18n.t('to') : I18n.t('from');

        // Determine sender/receiver details
        const fromUser = data.sender_credit_upi || data.sender_bank;
        const toUser = data.receiver_bank || data.receiver_upi;

        // const toUser =
        //   authRole === 'sender'
        //     ? data.receiver_bank || data.receiver_upi
        //     : data.sender_credit_upi || data.sender_bank;

        const fromName = fromUser?.user?.name || 'Unknown';
        const fromPhone = fromUser?.user?.phone || '';
        const fromUpi = fromUser?.upi_id || '';
        const fromBankName = fromUser?.bank?.name || '';
        const fromBankLogo = fromUser?.bank?.logo
          ? `${IMAGE_BASE_URL}${fromUser.bank.logo}`
          : null;
        const fromAccountNumber = fromUser?.account_number || fromUpi;
        const bankNumber =
          authRole === 'sender'
            ? fromUser?.account_number
            : toUser?.account_number;

        const toName = toUser?.user?.name || '';
        const toPhone = toUser?.user?.phone || '';
        const toUpi = toUser?.upi_id || '';
        const toBankName = toUser?.bank?.name || '';
        const toBankLogo = toUser?.bank?.logo
          ? `${IMAGE_BASE_URL}${toUser.bank.logo}`
          : null;
        const toAccountNumber = toUser?.account_number || toUpi;

        // Status image
        const statusImage =
          data.status === 'completed'
            ? require('../../assets/image/appIcon/success.png')
            : data.status === 'pending'
              ? require('../../assets/image/appIcon/pending.png')
              : require('../../assets/image/appIcon/failed.png');

        setTransaction({
          authRole,
          fromLabel,
          fromName,
          fromPhone,
          fromUpi,
          fromBankName,
          fromBankLogo,
          fromAccountNumber,
          bankNumber,
          toName,
          toPhone,
          toUpi,
          toBankName,
          toBankLogo,
          toAccountNumber,
          amount: `₹${data.amount}`,
          status: data.status,
          date: new Date(data.created_at).toLocaleString(),
          upiTxnId: data.transaction_id,
          statusImage,
        });
      } else {
        showToast(res.data.messages || 'Failed to fetch transaction');
      }
    } catch (err) {
      showToast(err.response?.data?.messages || 'Something went wrong');
    }
  };

  const showToast = message => setToast({ visible: true, message });

  if (!transaction) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Header
          title={I18n.t('transactionDetails')}
          onBack={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
        <Toast
          visible={toast.visible}
          message={toast.message}
          isDark={isDark}
        />
      </SafeAreaView>
    );
  }

  // Decide which user details to show at the top
  const userDetail =
    transaction.authRole === 'sender'
      ? {
          name: transaction.toName,
          phone: transaction.toPhone,
          label: I18n.t('to'),
        }
      : {
          name: transaction.fromName,
          phone: transaction.fromPhone,
          label: I18n.t('from'),
        };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('transactionDetails')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Show selected user details */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userDetail.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {userDetail.label} {userDetail.name}
          </Text>
          <Text style={[styles.phone, { color: themeColors.subText }]}>
            {userDetail.phone}
          </Text>
        </View>

        <Text style={[styles.amount, { color: themeColors.text }]}>
          {transaction.amount}
        </Text>

        <View style={styles.statusRow}>
          <Image
            source={transaction.statusImage}
            style={[
              styles.statusIcon,
              {
                tintColor:
                  transaction.status === 'completed'
                    ? Colors.darkGreen
                    : transaction.status === 'pending'
                      ? Colors.orange
                      : Colors.red,
              },
            ]}
          />
          <Text
            style={[
              styles.status,
              {
                color:
                  transaction.status === 'completed'
                    ? Colors.darkGreen
                    : transaction.status === 'pending'
                      ? Colors.orange
                      : Colors.red,
              },
            ]}
          >
            {I18n.t(transaction.status)}
          </Text>
        </View>

        <Text style={[styles.date, { color: themeColors.subText }]}>
          {transaction.date}
        </Text>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          {transaction.authRole === 'sender' ? (
            <View style={styles.bankRow}>
              {transaction.fromBankLogo && (
                <Image
                  source={{ uri: transaction.fromBankLogo }}
                  style={styles.bankLogo}
                />
              )}
              <Text style={[styles.bankName, { color: themeColors.text }]}>
                {transaction.fromBankName}{' '}
                {transaction.bankNumber && `• ${transaction.bankNumber}`}
              </Text>
            </View>
          ) : (
            <View style={styles.bankRow}>
              {transaction.toBankLogo && (
                <Image
                  source={{ uri: transaction.toBankLogo }}
                  style={styles.bankLogo}
                />
              )}
              <Text style={[styles.bankName, { color: themeColors.text }]}>
                {transaction.toBankName}{' '}
                {transaction.bankNumber && `• ${transaction.bankNumber}`}
              </Text>
            </View>
          )}

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
                {transaction.toBankName
                  ? `${transaction.toBankName} • ${transaction.toAccountNumber}`
                  : `Cya Pay • ${transaction.toUpi}`}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: themeColors.subText }]}>
              {I18n.t('from')} :
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.value, { color: themeColors.text }]}>
                {transaction.fromName} ({transaction.fromBankName})
              </Text>
              <Text style={[styles.subValue, { color: themeColors.subText }]}>
                {transaction.fromBankName
                  ? transaction.fromAccountNumber
                  : transaction.fromUpi}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.footerText, { color: themeColors.subText }]}>
          {I18n.t('paymentDelayNote')}
        </Text>
      </ScrollView>

      <Toast visible={toast.visible} message={toast.message} isDark={isDark} />
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
    fontWeight: 'bold',
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
    width: scaleUtils.scaleWidth(22),
    height: scaleUtils.scaleWidth(22),
    marginRight: scaleUtils.scaleWidth(16),
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
