import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';

const EnterPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedBank } = route.params || {};

  const [pin, setPin] = useState('');
  const pinLength = 4;

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  const handleContinue = () => {
    navigation.replace('BankBalanceScreen', { selectedBank });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('enter_your_pin')}
        onBack={() => navigation.goBack()}
      />

      {/* PIN Image below header */}
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

        {/* Enter PIN */}
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

        {/* Continue Button */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('continue')}
            onPress={handleContinue}
            disabled={pin.length !== pinLength}
          />
        </View>
      </ScrollView>
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
