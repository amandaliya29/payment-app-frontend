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
import { getUser, getBankAccountList } from '../../utils/apiHelper/Axios';
import Button from '../../component/Button';

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
    } catch (error) {
      return null;
    }
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
            id: account.id,
            name: account.account_holder_name,
            upiId: account.upi_id,
            logo: account.bank?.logo
              ? { uri: `https://cyapay.ddns.net/${account.bank.logo}` }
              : require('../../assets/image/bankIcon/sbi.png'),
            bankName: account.bank?.name || '',
            is_primary: account.is_primary,
            pin_code_length: account.pin_code_length,
          }));
          console.log(bankData);

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

    fetchUser();
    fetchBanks();

    const timeout = setTimeout(() => {
      amountRef.current?.focus();
    }, 400);

    return () => clearTimeout(timeout);
  }, [id, code]);

  const handleAmountChange = text => {
    const numeric = text.replace(/[^0-9.]/g, '');
    setAmount(numeric);
  };

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast(I18n.t('enter_valid_amount'));
      return;
    }
    Keyboard.dismiss();
    setModalVisible(true); // Open bottom modal instead of navigating
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
    });
  };

  // console.log(
  //   'userData?.bank_account?.id,',
  //   banks.filter(item => item.id !== userData?.bank_account?.id),
  // );

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

      {/* 🔹 Bottom Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: themeColors.background,
                maxHeight: '50%',
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              {I18n.t('select_bank')}
            </Text>
            <FlatList
              data={banks.filter(
                item => item.id !== userData?.bank_account?.id,
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedBank?.id === item.id
                          ? themeColors.selectedBankColor
                          : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedBank(item)}
                >
                  <Image source={item.logo} style={styles.modalIcon} />
                  <Text style={[styles.modalText, { color: themeColors.text }]}>
                    {item.bankName}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {/* <View style={styles.modalBottom}>
              <Text style={[styles.amountText, { color: themeColors.text }]}>
                ₹ {amount}
              </Text>
              <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                <Text style={styles.payButtonText}>{I18n.t('pay')}</Text>
              </TouchableOpacity>
            </View> */}
            <Button
              onPress={handlePay}
              title={` ₹ ${amount} ${I18n.t('pay')}`}
            />
          </View>
        </View>
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
  modalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  amountText: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
  },
  payButton: {
    backgroundColor: Colors.gradientSecondary,
    paddingHorizontal: scaleUtils.scaleWidth(20),
    paddingVertical: scaleUtils.scaleHeight(10),
    borderRadius: scaleUtils.scaleWidth(12),
  },
  payButtonText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Medium',
  },
});
