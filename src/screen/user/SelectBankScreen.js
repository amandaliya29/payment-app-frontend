import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import i18n from '../../utils/language/i18n';

const SelectBankScreen = () => {
  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const banks = route.params?.banks || [];

  // console.log(banks);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
    divider: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
  };

  const handleBankSelect = bank => {
    navigation.navigate('EnterPinScreen', {
      selectedBank: bank,
    });
  };

  useEffect(() => {
    if (banks.length === 1) handleBankSelect(banks[0]);
  }, [banks]);

  const renderItem = ({ item, index }) => (
    <>
      <TouchableOpacity
        style={styles.bankRow}
        onPress={() => handleBankSelect(item)}
      >
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.bank.logo}` }}
          style={styles.bankLogo}
          resizeMode="contain"
        />
        <Text style={[styles.bankName, { color: themeColors.text }]}>
          {item.bank.name}
        </Text>
      </TouchableOpacity>
      {index < banks.length - 1 && (
        <View
          style={[styles.divider, { backgroundColor: themeColors.divider }]}
        />
      )}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={i18n.t('select_bank')}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={banks}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(16) }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SelectBankScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(12),
    paddingHorizontal: scaleUtils.scaleWidth(12),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    marginRight: scaleUtils.scaleWidth(16),
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: scaleUtils.scaleHeight(4),
  },
});
