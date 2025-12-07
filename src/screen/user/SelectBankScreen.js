import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import {useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import i18n from '../../utils/language/i18n';
import { CreditUpiBankList, getNBFCDetail } from '../../utils/apiHelper/Axios';

const SelectBankScreen = () => {
  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { banks, linked_account, fromProfile } = route?.params;

  const [creditUpiList, setCreditUpiList] = React.useState([]);
  const [nbfcList, setNbfcList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
    divider: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
  };

  const handleBankSelect = (bank, linked_account) => {
    if (fromProfile) {
      let selectedBankData = bank;
      let isCredit = false;
      let isNbfc = false;

      if (bank.bank_credit_upi) {
        isCredit = true;
        selectedBankData = {
            ...bank,
            id: bank.bank_credit_upi.id,
            bank_credit_upi: bank.bank_credit_upi
        };
      } else if (bank.upi_id && !bank.bank) { 
         isNbfc = true;
         selectedBankData = {
             ...bank,
             id: bank.id || 'nbfc_id', 
         };
      }

      navigation.navigate('ForgotPasswordPhoneScreen', {
        selectedBank: selectedBankData,
        isCredit,
        isNbfc
      });
    } else {
      navigation.navigate('EnterPinScreen', {
        banks: bank,
        linked_account: linked_account,
      });
    }
  };

  useEffect(() => {
    if (banks.length === 1) handleBankSelect(banks[0], linked_account);
    
    if (fromProfile) {
      fetchCreditUpiAndNbfc();
    }
  }, [banks, fromProfile]);

  const fetchCreditUpiAndNbfc = async () => {
    try {
      setLoading(true);
      
      const creditUpiRes = await CreditUpiBankList();
      if (creditUpiRes.data?.status && Array.isArray(creditUpiRes.data?.data)) {
        const activeCreditUpi = creditUpiRes.data.data.filter(
          item => item.bank_credit_upi?.status === 'active',
        );
        setCreditUpiList(activeCreditUpi);
      }

      const nbfcRes = await getNBFCDetail();
      if (nbfcRes?.data && Object.keys(nbfcRes.data).length > 0) {
        const nbfcData = nbfcRes.data.data;
        if (nbfcData?.status === 'active' || nbfcData?.bank_credit_upi?.status === 'active') {
             setNbfcList([nbfcData]);
        } else {
             setNbfcList([]);
        }
      }
    } catch (error) {
      console.log('Error fetching Credit UPI/NBFC:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <>
      <TouchableOpacity
        style={styles.bankRow}
        onPress={() => handleBankSelect(item, linked_account)}
      >
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.bank.logo}` }}
          style={styles.bankLogo}
          resizeMode="contain"
        />
        <View>
          <Text style={[styles.bankName, { color: themeColors.text }]}>
            {item.bank.name}
          </Text>
          {fromProfile && item.account_number && (
            <Text style={[styles.subText, { color: themeColors.subText }]}>
               XXXX XXXX {item.account_number.slice(-4)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {index < banks.length - 1 && (
        <View
          style={[styles.divider, { backgroundColor: themeColors.divider }]}
        />
      )}
    </>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={i18n.t('select_bank')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ padding: scaleUtils.scaleWidth(16) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Bank Section */}
        {fromProfile && renderSectionHeader(i18n.t('bank'))}
        <FlatList
          data={banks}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        {fromProfile && creditUpiList.length > 0 && (
          <>
            {renderSectionHeader(i18n.t('credit_upi_s'))}
            <FlatList
              data={creditUpiList}
              keyExtractor={(item, index) => `credit-${index}`}
              renderItem={({ item, index }) => (
                <>
                  <TouchableOpacity
                    style={styles.bankRow}
                    onPress={() => handleBankSelect(item, linked_account)}
                  >
                    <Image
                      source={{ uri: `${IMAGE_BASE_URL}${item.bank.logo}` }}
                      style={styles.bankLogo}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={[styles.bankName, { color: themeColors.text }]}>
                        {item.bank.name}
                      </Text>
                      {fromProfile && item.bank_credit_upi?.upi_id && (
                        <Text style={[styles.subText, { color: themeColors.subText }]}>
                          {item.bank_credit_upi.upi_id}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  {index < creditUpiList.length - 1 && (
                    <View
                      style={[styles.divider, { backgroundColor: themeColors.divider }]}
                    />
                  )}
                </>
              )}
              scrollEnabled={false}
            />
          </>
        )}

        {fromProfile && nbfcList.length > 0 && (
          <>
            {renderSectionHeader(i18n.t('nbfc_credit_upi'))}
            <FlatList
              data={nbfcList}
              keyExtractor={(item, index) => `nbfc-${index}`}
              renderItem={({ item, index }) => (
                <>
                  <TouchableOpacity
                    style={styles.bankRow}
                    onPress={() => handleBankSelect(item, linked_account)}
                  >
                    <View style={styles.bankLogo}>
                      <Text style={{ fontSize: 20 }}>🏦</Text>
                    </View>
                    <View>
                      <Text style={[styles.bankName, { color: themeColors.text }]}>
                        NBFC Credit UPI
                      </Text>
                      {fromProfile && (item.upi_id || item.bank_credit_upi?.upi_id) && (
                        <Text style={[styles.subText, { color: themeColors.subText }]}>
                          {item.upi_id || item.bank_credit_upi?.upi_id}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  {index < nbfcList.length - 1 && (
                    <View
                      style={[styles.divider, { backgroundColor: themeColors.divider }]}
                    />
                  )}
                </>
              )}
              scrollEnabled={false}
            />
          </>
        )}

        {fromProfile && creditUpiList.length === 0 && (
          <>
            {renderSectionHeader(i18n.t('credit_upi_s'))}
            <View style={styles.emptySection}>
              <Text style={[styles.emptyText, { color: themeColors.subText }]}>
                {i18n.t('no_active_credit_upi_accounts')}
              </Text>
            </View>
          </>
        )}

        {fromProfile && nbfcList.length === 0 && (
          <>
            {renderSectionHeader(i18n.t('nbfc_credit_upi'))}
            <View style={styles.emptySection}>
              <Text style={[styles.emptyText, { color: themeColors.subText }]}>
                {i18n.t('no_active_credit_upi_accounts')}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
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
  },
  sectionHeader: {
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(4),
  },
  sectionTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-SemiBold',
  },
  emptySection: {
    paddingVertical: scaleUtils.scaleHeight(20),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  subText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
});
