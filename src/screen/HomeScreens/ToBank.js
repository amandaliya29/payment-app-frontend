import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../component/Button';
import Input from '../../component/Input';
import { useNavigation, useRoute } from '@react-navigation/native';

const ToBank = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();
  const route = useRoute();

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
  };

  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const isAccountValid =
    accountNumber.length >= 9 && accountNumber.length <= 18;
  const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode);
  const isButtonEnabled = isAccountValid && isIfscValid;

  const handleIfscChange = text => setIfscCode(text.toUpperCase());

  const recentTransfers = [
    { id: 1, name: 'Tejpal Singh' },
    { id: 2, name: 'Sura' },
    { id: 3, name: 'Sonu' },
    { id: 4, name: 'Sush' },
    { id: 5, name: 'Raj' },
    { id: 6, name: 'Mina' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.recentItem}>
      <View style={styles.circle}>
        <Text style={styles.initial}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.name, { color: themeColors.text }]}
      >
        {item.name}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('bank_transfer_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('receiver_bank_details')}
        </Text>

        {/* Account Number */}
        <View style={styles.bankCont}>
          <Input
            label={I18n.t('bank_account_number_label')}
            value={accountNumber}
            onChange={setAccountNumber}
            placeholder={I18n.t('bank_account_number_placeholder')}
            keyboardType="number-pad"
            maxLength={18}
          />
        </View>

        {/* IFSC Code */}
        <View style={styles.ifscContainer}>
          <View style={{ flex: 1 }}>
            <Input
              label={I18n.t('ifsc_code_label')}
              value={ifscCode}
              onChange={handleIfscChange}
              placeholder={I18n.t('ifsc_code_placeholder')}
              autoCapitalize="characters"
              maxLength={11}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchIfscScreen', {
                onGoBack: data => {
                  setIfscCode(data); // update IFSC when returning
                },
              })
            }
          >
            <Text style={styles.ifscLink}>{I18n.t('search_for_ifsc')}</Text>
          </TouchableOpacity>
        </View>

        {/* Continue */}
        <View style={styles.bankCont}>
          <Button
            title={I18n.t('continue')}
            disabled={!isButtonEnabled}
            style={{ opacity: isButtonEnabled ? 1 : 0.5 }}
          />
        </View>

        {/* Recent Transfers */}
        <Text style={[styles.recentTitle, { color: themeColors.text }]}>
          {I18n.t('recent_transfers')}
        </Text>

        <View style={styles.gridContainer}>
          <FlatList
            data={recentTransfers}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.recentList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: scaleUtils.scaleHeight(16) },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: scaleUtils.scaleFont(20),
    marginBottom: scaleUtils.scaleHeight(16),
    alignSelf: 'center',
  },
  bankCont: { paddingHorizontal: scaleUtils.scaleWidth(15) },
  ifscContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: scaleUtils.scaleWidth(10),
    paddingHorizontal: scaleUtils.scaleWidth(15),
  },
  ifscLink: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.gradientSecondary,
    fontFamily: 'Poppins-Medium',
  },
  recentTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(18),
    marginBottom: scaleUtils.scaleHeight(12),
    marginTop: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(15),
  },
  gridContainer: { paddingHorizontal: scaleUtils.scaleWidth(10) },
  row: {
    justifyContent: 'flex-start',
    marginBottom: scaleUtils.scaleHeight(20),
  },
  recentList: { paddingBottom: scaleUtils.scaleHeight(20) },
  recentItem: { alignItems: 'center', width: '25%' },
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
  name: {
    marginTop: scaleUtils.scaleHeight(6),
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(11),
    textAlign: 'center',
  },
});

export default ToBank;
