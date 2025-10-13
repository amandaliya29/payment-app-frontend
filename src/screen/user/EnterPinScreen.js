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
import { getBankBalance } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast';

const EnterPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { banks } = route.params || {};

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
  console.log(banks);

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Make API call with bank_id and pin
      const response = await getBankBalance(banks.id, pin);

      if (response.status) {
        // Success: navigate to BankBalanceScreen
        navigation.replace('BankBalanceScreen', {
          selectedBank: banks,
          balance: response.data.amount,
        });
      } else {
        showToast(response.messages);
        setPin('');
      }
    } catch (error) {
      console.log(error);
      showToast(error?.response?.data?.messages || 'Invalid PIN');
      setPin('');
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
