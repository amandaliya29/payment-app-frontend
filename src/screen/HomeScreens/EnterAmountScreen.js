import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { Toast } from '../../utils/Toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getUser,
  getBankAccountList,
  CreditUpiBankList,
} from '../../utils/apiHelper/Axios';
import Button from '../../component/Button';
import moment from 'moment';

const EnterAmountScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedTab, setSelectedTab] = useState('bank');
  const [bankAccounts, setBankAccounts] = useState([]);
  const amountRef = useRef(null);
  const route = useRoute();
  const { id } = route?.params?.user || {};
  const { code } = route?.params?.user || {};
  const [isViaUPI, setIsViaUPI] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    selectedBankColor: isDark ? Colors.grey : Colors.cardGrey,
  };

  const IMAGE_BASE_URL = 'https://cyapay.ddns.net/';

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const extractUpiId = qrString => {
    try {
      if (qrString && qrString.startsWith('upi://pay')) {
        const match = qrString.match(/pa=([^&]+)/);
        return match ? decodeURIComponent(match[1]) : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const isPrimaryValue = v =>
    v === true || v === 1 || v === '1' || v === 'true';

  const getDefaultFromList = list => {
    if (!Array.isArray(list) || list.length === 0) return null;
    const primary = list.find(item => isPrimaryValue(item.is_primary));
    return primary || list[0];
  };

  useEffect(() => {
    const fetchUser = async () => {
      let identifier = id;
      if (!id && code) {
        const upiId = extractUpiId(code);
        identifier = upiId || code;
        setIsViaUPI(true);
      }

      try {
        const res = await getUser(identifier);
        if (res?.data?.status) {
          setUserData(res.data.data);
        } else {
          setUserError(true);
          showToast(res.data?.messages || 'Failed to fetch user');
          setTimeout(() => navigation.goBack(), 2000);
        }
      } catch (error) {
        setUserError(true);
        showToast(
          error.response?.data?.messages || 'User not found or network error',
        );
        setTimeout(() => navigation.goBack(), 2000);
      } finally {
        setUserLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        const res = await getBankAccountList();
        if (res?.data?.status && res?.data?.data?.length > 0) {
          const bankData = res.data.data.map(account => ({
            id: (account.id ?? '').toString(),
            name: account.account_holder_name,
            upiId: account.upi_id,
            logo: account.bank?.logo
              ? { uri: `${IMAGE_BASE_URL}${account.bank.logo}` }
              : require('../../assets/image/bankIcon/sbi.png'),
            bankName: account.bank?.name || '',
            is_primary: account.is_primary,
            pin_code_length: account.pin_code_length,
            source: 'bank',
            original: account,
          }));

          setBanks(bankData);
          setSelectedBank(bankData.find(item => !!item.is_primary));
        } else {
          showToast(I18n.t('no_bank_accounts'));
        }
      } catch (error) {
        showToast(
          error.response?.data?.messages || I18n.t('failed_fetch_banks'),
        );
      }
    };

    const fetchCreditUpiBanks = async () => {
      try {
        setLoading(true);
        const res = await CreditUpiBankList();
        if (res.data?.status && Array.isArray(res.data?.data)) {
          const formattedData = res.data.data
            .map(item => {
              const upi = item.bank_credit_upi;
              if (!upi) return null;

              const isActive = String(upi.status).toLowerCase() === 'active';
              if (!isActive) return null;

              const creditLimit = parseFloat(upi.credit_limit) || 0;
              const availableCredit = parseFloat(upi.available_credit) || 0;
              const usedCredit = creditLimit - availableCredit;

              return {
                id: (item.id ?? '').toString(),
                bankLogo: item.bank?.logo
                  ? { uri: `${IMAGE_BASE_URL}${item.bank.logo}` }
                  : require('../../assets/image/bankIcon/sbi.png'),
                bankName: item.bank?.name || '',
                account: item.account_number,
                limit: `₹${creditLimit.toLocaleString('en-IN')}`,
                available: `₹${availableCredit.toLocaleString('en-IN')}`,
                used: `₹${usedCredit.toLocaleString('en-IN')}`,
                lastUsed: upi.updated_at
                  ? moment(upi.updated_at).fromNow()
                  : '',
                status: upi.status,
                is_primary: upi.is_primary,
                bank_credit_upi: upi,
                source: 'creditUpi',
                original: item,
              };
            })
            .filter(Boolean);

          if (formattedData.length > 0) {
            const defaultSelected = getDefaultFromList(formattedData);
            setBankAccounts(formattedData);
            setSelectedBank(prev => prev || defaultSelected);
          } else {
            showToast('No active Credit/UPI accounts found');
            setBankAccounts([]);
          }
        } else {
          showToast('Failed to load Credit/UPI list');
        }
      } catch (error) {
        showToast(
          error.response?.data?.messages ||
            'Something went wrong while fetching Credit/UPI list',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchBanks();
    fetchCreditUpiBanks();

    const timeout = setTimeout(() => {
      amountRef.current?.focus();
    }, 400);

    return () => clearTimeout(timeout);
  }, [id, code]);

  const handleTabChange = tab => {
    setSelectedTab(tab);
    if (tab === 'bank') {
      const defaultBank = getDefaultFromList(banks);
      setSelectedBank(defaultBank);
    } else if (tab === 'creditUpi') {
      const defaultCredit = getDefaultFromList(bankAccounts);
      setSelectedBank(defaultCredit);
    }
  };

  const handleAmountChange = text => {
    const numeric = text.replace(/[^0-9.]/g, '');
    const value = parseFloat(numeric) || 0;

    if (value > 500000) {
      showToast('Maximum limit is ₹500000');
      setAmount('500000');
    } else {
      setAmount(numeric);
    }
  };

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast(I18n.t('enter_valid_amount'));
      return;
    }

    if (parseFloat(amount) > 500000) {
      showToast('Maximum limit is ₹500000');
      return;
    }

    Keyboard.dismiss();
    setModalVisible(true);
  };

  const handlePay = () => {
    if (!selectedBank) {
      showToast(I18n.t('select_bank'));
      return;
    }
    setModalVisible(false);
    navigation.navigate('TransactionPinScreen', {
      amount,
      bank: selectedBank,
      user: userData,
      isViaUPI,
      note,
      creditUpiId: selectedBank?.bank_credit_upi?.upi_id || null, // ✅ Pass correct CreditUPI ID
    });
  };

  if (userLoading || userError || !userData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
        <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
      </SafeAreaView>
    );
  }

  const isItemSelected = item =>
    selectedBank &&
    selectedBank.id?.toString() === item.id?.toString() &&
    selectedBank.source === (item.source || 'bank');

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('enter_amount')}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={scaleUtils.scaleHeight(80)}
      >
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.userInfoContainer}>
            <View style={styles.circle}>
              <Text style={styles.initial}>
                {userData.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              Paying {userData.name}
            </Text>
            <Text style={[styles.userBank, { color: themeColors.text }]}>
              Banking name : {userData.bank_account?.account_holder_name}
            </Text>
            <Text style={[styles.userPhone, { color: themeColors.text }]}>
              {userData.phone}
            </Text>
          </View>

          <View style={styles.amountWrapper}>
            <TextInput
              ref={amountRef}
              style={[
                styles.amountInput,
                {
                  color: themeColors.text,
                  borderBottomColor: themeColors.subText,
                },
              ]}
              placeholder="₹ 0"
              placeholderTextColor={themeColors.subText}
              keyboardType="numeric"
              value={amount ? `₹ ${amount}` : ''}
              onChangeText={handleAmountChange}
              returnKeyType="next"
            />
          </View>

          <TextInput
            style={[
              styles.noteInput,
              {
                color: themeColors.text,
                borderColor: themeColors.subText,
                height: Math.max(40, inputHeight),
              },
            ]}
            placeholder={isFocused ? '' : I18n.t('add_note')}
            placeholderTextColor={themeColors.subText}
            value={note}
            onChangeText={setNote}
            returnKeyType="done"
            numberOfLines={5}
            multiline
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onContentSizeChange={event =>
              setInputHeight(event.nativeEvent.contentSize.height)
            }
          />
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handleProceed}
            >
              <Image
                source={require('../../assets/image/appIcon/right.png')}
                style={styles.arrowImage}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalContainer,
              { backgroundColor: themeColors.background, maxHeight: '60%' },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: scaleUtils.scaleHeight(10),
                paddingBottom: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => handleTabChange('bank')}
                style={{
                  borderBottomWidth: selectedTab === 'bank' ? 2 : 0,
                  borderBottomColor:
                    selectedTab === 'bank' ? Colors.primary : 'transparent',
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: scaleUtils.scaleFont(16),
                    fontFamily: 'Poppins-SemiBold',
                    color:
                      selectedTab === 'bank'
                        ? Colors.primary
                        : themeColors.subText,
                  }}
                >
                  Bank
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTabChange('creditUpi')}
                style={{
                  borderBottomWidth: selectedTab === 'creditUpi' ? 2 : 0,
                  borderBottomColor:
                    selectedTab === 'creditUpi'
                      ? Colors.primary
                      : 'transparent',
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: scaleUtils.scaleFont(16),
                    fontFamily: 'Poppins-SemiBold',
                    color:
                      selectedTab === 'creditUpi'
                        ? Colors.primary
                        : themeColors.subText,
                  }}
                >
                  Credit UPI
                </Text>
              </TouchableOpacity>
            </View>

            {selectedTab === 'bank' ? (
              <FlatList
                data={banks.filter(item => item.upiId !== code)}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      {
                        backgroundColor: isItemSelected(item)
                          ? themeColors.selectedBankColor
                          : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setSelectedBank({
                        ...item,
                        id: item.id?.toString(),
                        source: item.source || 'bank',
                      })
                    }
                  >
                    <Image source={item.logo} style={styles.modalIcon} />
                    <Text
                      style={[styles.modalText, { color: themeColors.text }]}
                    >
                      {item.bankName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={bankAccounts.filter(
                  item => item?.id !== userData?.bank_account?.id,
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      {
                        backgroundColor: isItemSelected(item)
                          ? themeColors.selectedBankColor
                          : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setSelectedBank({
                        ...item,
                        id: item.id?.toString(),
                        source: item.source || 'creditUpi',
                        bank_credit_upi: item.bank_credit_upi, // ✅ ensures correct upi_id passed
                      })
                    }
                  >
                    <Image source={item.bankLogo} style={styles.modalIcon} />
                    <View>
                      <Text
                        style={[styles.modalText, { color: themeColors.text }]}
                      >
                        {item.bankName}
                      </Text>
                      {item.bank_credit_upi?.upi_id && (
                        <Text
                          style={[
                            styles.modalText,
                            {
                              fontSize: scaleUtils.scaleFont(12),
                              color: themeColors.text,
                              marginTop: scaleUtils.scaleHeight(-4),
                            },
                          ]}
                        >
                          {item.bank_credit_upi.upi_id}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <Button
              onPress={handlePay}
              title={` ₹ ${amount} ${I18n.t('pay')}`}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

export default EnterAmountScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: scaleUtils.scaleWidth(20) },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  circle: {
    width: scaleUtils.scaleWidth(50),
    height: scaleUtils.scaleWidth(50),
    borderRadius: scaleUtils.scaleWidth(50),
    backgroundColor: Colors.gradientSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(20),
    fontWeight: 'bold',
  },
  userName: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(8),
  },
  userBank: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
  userPhone: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
  amountWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  amountInput: {
    fontSize: scaleUtils.scaleFont(34),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    paddingVertical: scaleUtils.scaleHeight(10),
  },
  noteInput: {
    flex: 1,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    height: scaleUtils.scaleHeight(40),
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(20),
    right: scaleUtils.scaleWidth(16),
  },
  arrowButton: {
    width: scaleUtils.scaleWidth(46),
    height: scaleUtils.scaleWidth(46),
    borderRadius: scaleUtils.scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gradientSecondary,
  },
  arrowImage: {
    width: '35%',
    height: '35%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: scaleUtils.scaleWidth(16),
    borderTopRightRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(16),
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(8),
    marginVertical: scaleUtils.scaleHeight(3),
  },
  modalIcon: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    marginRight: scaleUtils.scaleWidth(12),
  },
  modalText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
});
