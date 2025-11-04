import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { getBankBalance, getBankDetail } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast';

const EnterPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { banks, linked_account } = route.params || {};

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  const pinLength = banks.pin_code_length;

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(false);
    setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }, 100);
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      let payload = {
        account_id: banks.id,
        pin_code: pin,
      };
      // ✅ If the account is already linked, call getBankDetail API
      if (linked_account) {
        try {
          const res = await getBankDetail(payload);

          if (res?.data?.status) {
            navigation.replace('BankBalanceScreen', {
              linked_account: linked_account,
              selectedBank: res?.data?.data, // pass bank detail result
            });
          } else {
            showToast(res?.data?.messages || 'Failed to fetch bank detail');
          }
        } catch (error) {
          showToast(error?.response?.data?.messages || 'Something went wrong');
        } finally {
          setLoading(false);
        }
        return;
      }

      // ✅ Otherwise, fetch balance from API

      const res = await getBankBalance(payload);
      if (!res.data.status) {
        showToast(res.data.messages);
      }

      navigation.replace('BankBalanceScreen', {
        selectedBank: banks,
        balance: res.data.data?.amount || 0,
      });
    } catch (error) {
      showToast(error?.response?.data?.messages || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('enter_your_pin')}
        onBack={() => navigation.goBack()}
      />

      {/* PIN Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image/appIcon/pin-lock.png')}
          style={[styles.pinImage, { tintColor: Colors.primary }]}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('enter_your_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('enter_pin_to_continue')}
        </Text>

        {/* PIN Input */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_your_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            code={pin}
            setCode={setPin}
            length={pinLength}
            isSecure={true}
          />
        </View>

        {/* Continue Button or Loader */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Button
              title={I18n.t('continue')}
              onPress={handleContinue}
              disabled={pin.length !== pinLength}
            />
          )}
        </View>
      </ScrollView>

      {/* Custom Toast */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  pinImage: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginTop: scaleUtils.scaleWidth(20),
  },
  scrollContent: { padding: scaleUtils.scaleWidth(20) },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  label: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
  },
});

export default EnterPinScreen;
