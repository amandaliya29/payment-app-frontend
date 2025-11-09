import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import { getBankAccountList } from '../../utils/apiHelper/Axios';
import { Toast } from '../../utils/Toast';
import Button from '../../component/Button';
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

const SelfTransfer = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scrollRef = useRef(null);

  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedFromBank, setSelectedFromBank] = useState(null);
  const [selectedToBank, setSelectedToBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showFromList, setShowFromList] = useState(true);
  const [showToList, setShowToList] = useState(false);

  const showToast = message => {
    setToastVisible(false);
    setToastMessage(message);
    setTimeout(() => setToastVisible(true), 50);
  };

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    card: isDark ? Colors.bg : Colors.white,
    placeholder: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    iconBox: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: isDark ? Colors.white : Colors.black,
    bankIcon: isDark ? Colors.cardGrey : Colors.darkGrey,
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getBankAccountList();
        if (response.data?.status && Array.isArray(response.data?.data)) {
          setBankAccounts(response.data.data);
        } else {
          setBankAccounts([]);
          showToast(I18n.t('no_linked_account'));
        }
      } catch (error) {
        setBankAccounts([]);
        showToast(
          error.response?.data?.messages || I18n.t('something_went_wrong'),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleFromSelect = bank => {
    setSelectedFromBank(bank);
    setShowFromList(false);
    setShowToList(true);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleToSelect = bank => {
    setSelectedToBank(bank);
    setShowToList(false);
  };

  const handleNext = () => {
    if (!selectedFromBank || !selectedToBank) {
      showToast(I18n.t('please_select_both_accounts'));
      return;
    }

    navigation.navigate('SelfTransferEnterAmount', {
      fromBank: selectedFromBank,
      toBank: selectedToBank,
    });
  };

  const isSameBankSelected =
    selectedFromBank &&
    selectedToBank &&
    selectedFromBank.id === selectedToBank.id;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderSelectedCard = (bank, onChange) => (
    <View
      style={[styles.selectedCard, { backgroundColor: themeColors.iconBox }]}
    >
      <View style={styles.bankInfoRow}>
        <View
          style={[styles.bankIconBox, { backgroundColor: themeColors.iconBox }]}
        >
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${bank.bank.logo}` }}
            style={styles.bankLogo}
          />
        </View>
        <View style={styles.bankInfo}>
          <Text style={[styles.bankName, { color: themeColors.text }]}>
            {bank.bank.name}
          </Text>
          <Text
            style={[styles.bankDetails, { color: themeColors.placeholder }]}
          >
            {bank.account_number} {bank.account_type}
          </Text>
        </View>
        <TouchableOpacity onPress={onChange}>
          <Text style={[styles.changeText, { color: Colors.primary }]}>
            {I18n.t('change') || 'Change'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('self_transfer_title')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== FROM SECTION ====== */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {I18n.t('select_bank_account_from')}
        </Text>

        {selectedFromBank && !showFromList
          ? renderSelectedCard(selectedFromBank, () => setShowFromList(true))
          : bankAccounts.map(bank => (
              <TouchableOpacity
                key={`from-${bank.id}`}
                style={[styles.bankCard]}
                onPress={() => handleFromSelect(bank)}
              >
                <View
                  style={[
                    styles.bankIconBox,
                    { backgroundColor: themeColors.iconBox },
                  ]}
                >
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${bank.bank.logo}` }}
                    style={styles.bankLogo}
                  />
                </View>

                <View style={styles.bankInfo}>
                  <Text style={[styles.bankName, { color: themeColors.text }]}>
                    {bank.bank.name}
                  </Text>
                  <Text
                    style={[
                      styles.bankDetails,
                      { color: themeColors.placeholder },
                    ]}
                  >
                    {bank.account_number} {bank.account_type}
                  </Text>
                </View>

                <View style={styles.radioOuter}>
                  {selectedFromBank?.id === bank.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

        {/* ====== TO SECTION (only show after from selected) ====== */}
        {selectedFromBank && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.text,
                  marginTop: scaleUtils.scaleHeight(10),
                },
              ]}
            >
              {I18n.t('select_bank_account_to')}
            </Text>

            {selectedToBank && !showToList
              ? renderSelectedCard(selectedToBank, () => setShowToList(true))
              : bankAccounts.map(bank => (
                  <TouchableOpacity
                    key={`to-${bank.id}`}
                    style={[styles.bankCard]}
                    onPress={() => handleToSelect(bank)}
                    disabled={selectedFromBank?.id === bank.id}
                  >
                    <View
                      style={[
                        styles.bankIconBox,
                        { backgroundColor: themeColors.iconBox },
                      ]}
                    >
                      <Image
                        source={{ uri: `${IMAGE_BASE_URL}${bank.bank.logo}` }}
                        style={styles.bankLogo}
                      />
                    </View>

                    <View style={styles.bankInfo}>
                      <Text
                        style={[styles.bankName, { color: themeColors.text }]}
                      >
                        {bank.bank.name}
                      </Text>
                      <Text
                        style={[
                          styles.bankDetails,
                          { color: themeColors.placeholder },
                        ]}
                      >
                        {bank.account_number} {bank.account_type}
                      </Text>
                    </View>

                    <View style={styles.radioOuter}>
                      {selectedToBank?.id === bank.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
          </>
        )}

        {/* ====== ADD BANK OPTION ====== */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            { marginTop: scaleUtils.scaleHeight(15) },
          ]}
          onPress={() => {
            showToast(I18n.t('navigating_add_bank'));
            navigation.navigate('BankLinkScreen');
          }}
        >
          <View
            style={[
              styles.dottedContainer,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.iconBox,
              },
            ]}
          >
            <Image
              source={require('../../assets/image/appIcon/add.png')}
              style={[styles.paymentIcon, { tintColor: themeColors.bankIcon }]}
            />
          </View>
          <Text style={[styles.paymentText, { color: themeColors.text }]}>
            {I18n.t('add_bank_account')}
          </Text>
        </TouchableOpacity>

        {/* ====== NEXT BUTTON ====== */}
        <View style={{ marginTop: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('next')}
            onPress={handleNext}
            disabled={
              !selectedFromBank || !selectedToBank || isSameBankSelected
            }
          />
        </View>
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

export default SelfTransfer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    marginBottom: scaleUtils.scaleHeight(10),
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  bankIconBox: {
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    resizeMode: 'contain',
  },
  bankInfo: { flex: 1, marginLeft: scaleUtils.scaleWidth(16) },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  bankDetails: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  radioOuter: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(10),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: scaleUtils.scaleWidth(10),
    height: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(5),
    backgroundColor: Colors.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(16),
  },
  dottedContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
  },
  paymentIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
  },
  paymentText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  selectedCard: {
    borderRadius: scaleUtils.scaleWidth(10),
    padding: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Medium',
  },
});
