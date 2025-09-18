import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { useNavigation } from '@react-navigation/native';
import I18n from '../../utils/language/i18n';

const BankBalanceScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: Colors.white,
    subText: isDark ? Colors.white : Colors.black,
    mText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
  };

  const banks = [
    {
      id: 1,
      name: 'State Bank of India',
      balance: '2,50,000',
      accountNumber: 'XXXX XXXX XXXX 1234',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/sbi.png'),
    },
    {
      id: 2,
      name: 'HDFC Bank',
      balance: '1,10,500',
      accountNumber: 'XXXX XXXX XXXX 5678',
      type: 'Current',
      logo: require('../../assets/image/bankIcon/hdfc.png'),
    },
    {
      id: 3,
      name: 'ICICI Bank',
      balance: '95,000',
      accountNumber: 'XXXX XXXX XXXX 9012',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/icici.png'),
    },
  ];

  const [selectedBank, setSelectedBank] = useState(banks[0]);
  const [showBalance, setShowBalance] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleBalance = () => setShowBalance(prev => !prev);

  const handleBankSelect = bank => {
    setSelectedBank(bank);
    setShowBalance(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('bank_balance_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.cardGradient}
        >
          <Text style={styles.balanceLabel}>
            {I18n.t('bank_balance_title')}
          </Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balance}>
              ₹{' '}
              {showBalance
                ? Number(selectedBank.balance.replace(/,/g, '')).toLocaleString(
                    'en-IN',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : selectedBank.balance.replace(/./g, '.')}
            </Text>
            <TouchableOpacity onPress={toggleBalance}>
              <Image
                source={
                  showBalance
                    ? require('../../assets/image/appIcon/eye-open.png')
                    : require('../../assets/image/appIcon/eye-closed.png')
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.bankRow}>
            <Image
              source={selectedBank.logo}
              style={styles.bankLogo}
              resizeMode="contain"
            />
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>{selectedBank.name}</Text>
              <Text style={styles.bankDetails}>
                {selectedBank.accountNumber}
              </Text>
              <Text style={styles.bankDetails}>{selectedBank.type}</Text>
            </View>
          </View>
        </LinearGradient>
        {/* Select Bank Button */}
        <TouchableOpacity
          style={[
            styles.bankSelector,
            { backgroundColor: themeColors.btnColor },
          ]}
          onPress={() => setModalVisible(true)}
        >
          {/* <Image
            source={selectedBank.logo}
            style={styles.bankIcon}
            resizeMode="contain"
          /> */}
          <Text style={[styles.bankName, { color: themeColors.subText }]}>
            {I18n.t('select_bank')}
          </Text>
          <Image
            source={require('../../assets/image/appIcon/right.png')}
            style={[styles.rightIcon, { tintColor: themeColors.subText }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.mText }]}>
              {I18n.t('select_bank')}
            </Text>
            <FlatList
              data={banks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleBankSelect(item)}
                >
                  <Image source={item.logo} style={styles.modalIcon} />
                  <Text
                    style={[styles.modalText, { color: themeColors.mText }]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  cardGradient: {
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(16),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    marginBottom: scaleUtils.scaleHeight(20),
  },
  balanceLabel: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  balance: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  eyeIcon: {
    width: scaleUtils.scaleWidth(22),
    height: scaleUtils.scaleWidth(22),
    tintColor: Colors.white,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: scaleUtils.scaleHeight(12),
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: scaleUtils.scaleHeight(12),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    marginRight: scaleUtils.scaleWidth(14),
    borderRadius: scaleUtils.scaleWidth(22),
    backgroundColor: 'white',
  },
  bankInfo: { flex: 1 },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
  },
  bankBtnName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  bankDetails: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  bankSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(10),
    columnGap: scaleUtils.scaleWidth(10),
    justifyContent: 'center',
    marginTop: scaleUtils.scaleHeight(12),
  },
  bankIcon: {
    width: scaleUtils.scaleWidth(26),
    height: scaleUtils.scaleWidth(26),
  },
  rightIcon: {
    width: scaleUtils.scaleWidth(12),
    height: scaleUtils.scaleWidth(12),
    tintColor: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: scaleUtils.scaleWidth(16),
    borderTopRightRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(16),
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(12),
  },
  modalIcon: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    marginRight: scaleUtils.scaleWidth(10),
  },
  modalText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
});

export default BankBalanceScreen;
