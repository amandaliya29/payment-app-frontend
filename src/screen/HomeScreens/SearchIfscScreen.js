import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import Button from '../../component/Button';
import I18n from '../../utils/language/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';

const banksData = [
  {
    name: 'Axis Bank',
    branches: [
      { name: 'A B Road Indore, Indore', ifsc: 'UTIB0001680' },
      { name: 'MG Road, Mumbai', ifsc: 'UTIB0000192' },
      { name: 'Civil Lines, Delhi', ifsc: 'UTIB0000987' },
    ],
  },
  {
    name: 'HDFC Bank',
    branches: [
      { name: 'Ring Road, Surat', ifsc: 'HDFC0001234' },
      { name: 'C G Road, Ahmedabad', ifsc: 'HDFC0005678' },
      { name: 'Vesu, Surat', ifsc: 'HDFC0006754' },
      { name: 'Kalupur, Ahmedabad', ifsc: 'HDFC0006758' },
    ],
  },
  {
    name: 'ICICI Bank',
    branches: [
      { name: 'Connaught Place, Delhi', ifsc: 'ICIC0000456' },
      { name: 'Lalbagh, Lucknow', ifsc: 'ICIC0000897' },
    ],
  },
];

const ITEM_HEIGHT = scaleUtils.scaleHeight(40);
const VISIBLE_ITEMS = 3;

const SearchIfscScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { onGoBack } = route.params || {};

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    divider: isDark ? Colors.cardGrey : Colors.darkGrey,
  };

  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const handleSelectBank = bankName => {
    setSelectedBank(bankName);
    setSelectedBranch('');
    setIfscCode('');
    setShowBankDropdown(false);
  };

  const handleSelectBranch = branch => {
    setSelectedBranch(branch.name);
    setIfscCode(branch.ifsc);
    setShowBranchDropdown(false);
  };

  const toggleBankDropdown = () => {
    setShowBankDropdown(!showBankDropdown);
    setShowBranchDropdown(false);
  };

  const toggleBranchDropdown = () => {
    setShowBranchDropdown(!showBranchDropdown);
    setShowBankDropdown(false);
  };

  const selectedBankData = banksData.find(bank => bank.name === selectedBank);

  // ✅ Go back and pass IFSC to previous screen
  const handleContinue = () => {
    if (onGoBack && ifscCode) {
      onGoBack(ifscCode);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('search_for_ifsc')}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Bank Name */}
        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('bank_name')}
        </Text>
        <TouchableOpacity
          style={[styles.dropdown, { borderColor: themeColors.divider }]}
          onPress={toggleBankDropdown}
        >
          <Text style={[styles.dropdownText, { color: themeColors.text }]}>
            {selectedBank || I18n.t('select_bank')}
          </Text>
        </TouchableOpacity>

        {showBankDropdown && (
          <FlatList
            data={banksData}
            keyExtractor={item => item.name}
            style={[
              styles.dropdownList,
              {
                maxHeight:
                  ITEM_HEIGHT * Math.min(VISIBLE_ITEMS, banksData.length),
              },
            ]}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectBank(item.name)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Branch Name */}
        {selectedBank ? (
          <>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {I18n.t('bank_branch')}
            </Text>
            <TouchableOpacity
              style={[styles.dropdown, { borderColor: themeColors.divider }]}
              onPress={toggleBranchDropdown}
            >
              <Text style={[styles.dropdownText, { color: themeColors.text }]}>
                {selectedBranch || I18n.t('select_branch')}
              </Text>
            </TouchableOpacity>

            {showBranchDropdown && selectedBankData && (
              <FlatList
                data={selectedBankData.branches}
                keyExtractor={item => item.name}
                style={[
                  styles.dropdownList,
                  {
                    maxHeight:
                      ITEM_HEIGHT *
                      Math.min(VISIBLE_ITEMS, selectedBankData.branches.length),
                  },
                ]}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectBranch(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        ) : null}

        {/* IFSC Code */}
        {ifscCode ? (
          <View style={styles.ifscContainer}>
            <Text style={[styles.ifscLabel, { color: themeColors.text }]}>
              {I18n.t('ifsc_code_label')}
            </Text>
            <Text style={[styles.ifscValue, { color: themeColors.text }]}>
              {ifscCode}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={I18n.t('cancel')}
          style={[
            styles.cancelButton,
            { backgroundColor: themeColors.background },
          ]}
          textStyle={{ color: themeColors.text }}
          onPress={() => navigation.goBack()}
        />
        <Button
          title={I18n.t('continue')}
          disabled={!ifscCode}
          style={[styles.continueButton]}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: scaleUtils.scaleWidth(16) },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
    marginBottom: scaleUtils.scaleHeight(8),
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: scaleUtils.scaleWidth(10),
    paddingVertical: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(12),
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderRadius: scaleUtils.scaleWidth(8),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: scaleUtils.scaleHeight(12),
  },
  dropdownItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(12),
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.black,
  },
  ifscContainer: {
    marginTop: scaleUtils.scaleHeight(16),
    marginBottom: scaleUtils.scaleHeight(24),
  },
  ifscLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(13),
    marginBottom: scaleUtils.scaleHeight(6),
  },
  ifscValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: scaleUtils.scaleFont(16),
    color: Colors.black,
  },
  buttonContainer: {
    margin: scaleUtils.scaleWidth(16),
    marginTop: scaleUtils.scaleHeight(20),
    columnGap: scaleUtils.scaleWidth(10),
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gradientSecondary,
  },
});

export default SearchIfscScreen;
