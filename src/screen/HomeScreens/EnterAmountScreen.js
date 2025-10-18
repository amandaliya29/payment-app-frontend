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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { Toast } from '../../utils/Toast';
import { useNavigation } from '@react-navigation/native';

const EnterAmountScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const amountRef = useRef(null);

  const user = {
    name: 'Rahul Mehta',
    bank: 'Rahul Mehta',
    phone: '+91 9876543210',
  };

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
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

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast(I18n.t('enter_valid_amount'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Keyboard.dismiss();
      showToast(`${I18n.t('payment_ready')} ₹${amount}`);
      // Navigate to next screen if needed
    }, 1000);
  };

  const handleAmountChange = text => {
    const numeric = text.replace(/[^0-9.]/g, '');
    setAmount(numeric);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('enter_amount')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.circle}>
            <Text style={styles.initial}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: themeColors.text }]}>
            Paying {user.name}
          </Text>
          <Text style={[styles.userBank, { color: themeColors.text }]}>
            Banking name : {user.bank}
          </Text>
          <Text style={[styles.userPhone, { color: themeColors.text }]}>
            {user.phone}
          </Text>
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
          />
        </View>

        {/* Note Input */}
        <TextInput
          style={[
            styles.noteInput,
            { color: themeColors.text, borderColor: themeColors.subText },
          ]}
          placeholder={I18n.t('add_note')}
          placeholderTextColor={themeColors.subText}
          value={note}
          onChangeText={setNote}
        />
      </ScrollView>

      {/* Bottom Image Button */}
      <View style={styles.bottomButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <TouchableOpacity style={styles.arrowButton} onPress={handleProceed}>
            <Image
              source={require('../../assets/image/appIcon/right.png')} // <-- your arrow image
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        )}
      </View>

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
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    paddingHorizontal: scaleUtils.scaleWidth(12),
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    minHeight: scaleUtils.scaleHeight(25),
    height: scaleUtils.scaleHeight(40),
    width: '55%',
    alignSelf: 'center',
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
    overflow: 'hidden',
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
});
