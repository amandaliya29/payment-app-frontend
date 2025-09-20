import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';

const SelectBankScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Banks passed from HomePage
  const banks = route.params?.banks || [];

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
    divider: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
  };

  const handleBankSelect = bank => {
    navigation.navigate('EnterPinScreen', { selectedBank: bank });
  };

  // Auto navigate if only one bank exists
  useEffect(() => {
    if (banks.length === 1) {
      handleBankSelect(banks[0]);
    }
  }, [banks]);

  const renderItem = ({ item, index }) => (
    <>
      <TouchableOpacity
        style={styles.bankRow}
        onPress={() => handleBankSelect(item)}
      >
        <Image
          source={item.logo}
          style={styles.bankLogo}
          resizeMode="contain"
        />
        <Text style={[styles.bankName, { color: themeColors.text }]}>
          {item.name}
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
      {banks.length > 1 && (
        <>
          <Header
            title={I18n.t('select_bank')}
            onBack={() => navigation.goBack()}
          />
          <FlatList
            data={banks}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingHorizontal: scaleUtils.scaleWidth(20) },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(14),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(32),
    height: scaleUtils.scaleWidth(32),
    marginRight: scaleUtils.scaleWidth(14),
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
  },
});

export default SelectBankScreen;
