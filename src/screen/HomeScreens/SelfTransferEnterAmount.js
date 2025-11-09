import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useColorScheme,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { Toast } from '../../utils/Toast';
import { useNavigation, useRoute } from '@react-navigation/native';

const SelfTransferEnterAmount = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Get data from route params
  const { fromBank, toBank } = route.params || {};

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const amountRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      amountRef.current?.focus();
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleAmountChange = text => {
    const numeric = text.replace(/[^0-9.]/g, '');
    // Prevent entering more than 500000
    if (parseFloat(numeric) > 500000) {
      setAmount('500000');
      showToast('Amount limit exceeded (₹500,000 maximum)');
      return;
    }
    setAmount(numeric);
  };

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast(I18n.t('enter_valid_amount'));
      return;
    }

    if (parseFloat(amount) > 500000) {
      showToast('Maximum transfer limit is ₹500,000');
      return;
    }

    Keyboard.dismiss();

    const transferData = {
      amount: parseFloat(amount),
      note: note || '',
      bank: fromBank,
      user: { bank_account: toBank },
      isViaUPI: false,
      creditUpiId: null,
    };
    navigation.navigate('TransactionPinScreen', transferData);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('self_transfer_title')}
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
          {/* ✅ Display selected user or bank info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.circle}>
              <Image
                source={require('../../assets/image/homeIcon/transfer.png')}
                style={styles.transferImage}
              />
            </View>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {I18n.t('self_transfer_title')}
            </Text>

            {/* {fromBank?.bank?.name && (
              <Text style={[styles.userBank, { color: themeColors.subText }]}>
                From: {fromBank.bank.name}
              </Text>
            )}

            {toBank?.bank?.name && (
              <Text style={[styles.userBank, { color: themeColors.subText }]}>
                To: {toBank.bank.name}
              </Text>
            )} */}
          </View>

          {/* Amount Input */}
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
              returnKeyType="done"
            />
          </View>

          {/* Note Input */}
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

          <View style={{ flex: 1 }} />
        </ScrollView>

        {/* Bottom Proceed Button */}
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

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

export default SelfTransferEnterAmount;

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
    marginBottom: scaleUtils.scaleHeight(6),
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
  transferImage: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});
