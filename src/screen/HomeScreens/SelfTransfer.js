import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { getBankAccountList } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast'; // ✅ Import your custom toast
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

const SelfTransfer = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastVisible(false);
    setToastMessage(message);
    setTimeout(() => setToastVisible(true), 50);
  };
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    card: isDark ? Colors.bg : Colors.white,
    placeholder: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    iconBox: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: isDark ? Colors.white : Colors.black,
    bankIcon: isDark ? Colors.cardGrey : Colors.darkGrey,
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getBankAccountList();

        if (response.data?.status && Array.isArray(response.data?.data)) {
          setBankAccounts(response.data.data);
        } else {
          setBankAccounts([]);
          showToast(I18n.t('no_linked_account'));
        }
      } catch (error) {
        setBankAccounts([]);
        showToast(
          error.response?.data?.messages || I18n.t('something_went_wrong'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('self_transfer_title')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('manage_money')}
        </Text>

        <View style={styles.bankSection}>
          {bankAccounts.length > 0 ? (
            bankAccounts.map(bank => (
              <TouchableOpacity
                key={bank.id}
                style={[styles.bankCard]}
                onPress={() =>
                  showToast(
                    `${bank.bank.name} ${I18n.t('selected_successfully')}`,
                  )
                }
              >
                <View
                  style={[
                    styles.bankIconBox,
                    { backgroundColor: themeColors.iconBox },
                  ]}
                >
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${bank.bank.logo}` }}
                    style={styles.bankLogo}
                  />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={[styles.bankName, { color: themeColors.text }]}>
                    {bank.bank.name}
                  </Text>
                  <Text
                    style={[
                      styles.bankDetails,
                      { color: themeColors.placeholder },
                    ]}
                  >
                    {bank.account_number}
                    {' • ' + bank.account_type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[styles.noAccountText, { color: themeColors.placeholder }]}
            >
              {I18n.t('no_linked_account')}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              { marginTop: scaleUtils.scaleHeight(10) },
            ]}
            onPress={() => {
              showToast(I18n.t('navigating_add_bank'));
              navigation.navigate('BankLinkScreen');
            }}
          >
            <View
              style={[
                styles.dottedContainer,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.iconBox,
                },
              ]}
            >
              <Image
                source={require('../../assets/image/appIcon/add.png')}
                style={[
                  styles.paymentIcon,
                  { tintColor: themeColors.bankIcon },
                ]}
              />
            </View>
            <Text style={[styles.paymentText, { color: themeColors.text }]}>
              {I18n.t('add_bank_account')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Custom Toast Component */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

export default SelfTransfer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  bankSection: {
    marginBottom: scaleUtils.scaleHeight(20),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    marginBottom: scaleUtils.scaleHeight(26),
    alignSelf: 'center',
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  bankIconBox: {
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    resizeMode: 'contain',
  },
  bankInfo: { marginLeft: scaleUtils.scaleWidth(16) },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  bankDetails: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  noAccountText: {
    fontSize: scaleUtils.scaleFont(13),
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(16),
  },
  dottedContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
  },
  paymentIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
  },
  paymentText: {
    fontSize: scaleUtils.scaleFont(12),
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
