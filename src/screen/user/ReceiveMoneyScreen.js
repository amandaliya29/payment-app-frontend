import React, { useState, useRef, useEffect } from 'react';
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
  Platform,
  PanResponder,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import QRCode from 'react-native-qrcode-svg';
import I18n from '../../utils/language/i18n';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { getBankAccountList } from '../../utils/apiHelper/Axios';
import { useNavigation } from '@react-navigation/native';
import { Toast } from '../../utils/Toast';

const ReceiveMoneyScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const viewShotRef = useRef(null);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
  };

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await getBankAccountList();
        if (res.data?.status && res.data?.data?.length > 0) {
          const bankData = res.data?.data?.map(account => ({
            id: account.id,
            name: account.account_holder_name,
            upiId: account.upi_id,
            logo: account.bank?.logo
              ? { uri: `${IMAGE_BASE_URL}/${account.bank.logo}` }
              : require('../../assets/image/bankIcon/sbi.png'),
            bankName: account.bank?.name || '',
          }));
          setBanks(bankData);
          setSelectedBank(bankData[0]);
        } else {
          showToast(I18n.t('no_bank_accounts'));
        }
      } catch (error) {
        showToast(
          error.response?.data?.messages || I18n.t('failed_fetch_banks'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const copyUPI = () => {
    if (!selectedBank) return;
    Clipboard.setString(selectedBank.upiId);
    showToast(I18n.t('upi_id_copied'));
  };

  const getInitial = name => name?.charAt(0)?.toUpperCase() || '';

  const handleBankSelect = bank => {
    const index = banks.findIndex(b => b.id === bank.id);
    setCurrentIndex(index);
    setSelectedBank(bank);
    setModalVisible(false);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!banks.length) return;
      if (gestureState.dx > 50) {
        const prevIndex =
          currentIndex === 0 ? banks.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        setSelectedBank(banks[prevIndex]);
      } else if (gestureState.dx < -50) {
        const nextIndex = (currentIndex + 1) % banks.length;
        setCurrentIndex(nextIndex);
        setSelectedBank(banks[nextIndex]);
      }
    },
  });

  const getUpiLink = bank =>
    `upi://pay?pa=${bank.upiId}&pn=${encodeURIComponent(bank.name)}&cu=INR`;

  const handleShare = async () => {
    if (!selectedBank) return;
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        type: 'image/png',
      });
    } catch (error) {
      console.log('Share Error:', error);
      showToast(I18n.t('share_failed'));
    }
  };

  const handleScan = () => {
    navigation.navigate('QrPage');
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <ActivityIndicator
          size="large"
          color={Colors.gradientPrimary}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      </SafeAreaView>
    );
  }

  if (!banks.length) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Header
          title={I18n.t('receive_money_title')}
          onBack={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: themeColors.text, fontSize: 16 }}>
            {I18n.t('no_bank_accounts')}
          </Text>
        </View>
        <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('receive_money_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View {...panResponder.panHandlers}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1 }}
            style={{
              position: 'absolute',
              top: -9999,
              left: 0,
              right: 0,
              backgroundColor: Colors.bg,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinearGradient
                colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
                style={[
                  styles.qrCard,
                  {
                    width: '80%',
                    alignSelf: 'center',
                    borderRadius: scaleUtils.scaleWidth(12),
                    padding: scaleUtils.scaleWidth(20),
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarWrapper,
                    { backgroundColor: themeColors.background },
                  ]}
                >
                  <Text
                    style={[styles.avatarText, { color: themeColors.text }]}
                  >
                    {getInitial(selectedBank.name)}
                  </Text>
                </View>
                <Text style={styles.userNameImage}>{selectedBank.name}</Text>
                <Text style={styles.upiIdImage}>{selectedBank.upiId}</Text>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={getUpiLink(selectedBank)}
                    size={scaleUtils.scaleWidth(190)}
                    color={Colors.black}
                    backgroundColor={Colors.white}
                  />
                </View>
              </LinearGradient>
            </View>
          </ViewShot>

          <View>
            <LinearGradient
              colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
              style={styles.qrCard}
            >
              <View
                style={[
                  styles.avatarWrapper,
                  { backgroundColor: themeColors.background },
                ]}
              >
                <Text style={[styles.avatarText, { color: themeColors.text }]}>
                  {getInitial(selectedBank.name)}
                </Text>
              </View>
              <Text style={styles.userName}>{selectedBank.name}</Text>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={getUpiLink(selectedBank)}
                  size={scaleUtils.scaleWidth(220)}
                  color={Colors.black}
                  backgroundColor={Colors.white}
                />
              </View>
              <View style={styles.upiContainer}>
                <Text style={styles.upiId}>{selectedBank.upiId}</Text>
                <TouchableOpacity
                  onPress={copyUPI}
                  style={styles.copyIconWrapper}
                >
                  <Image
                    source={require('../../assets/image/appIcon/copy.png')}
                    style={styles.copyIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.bankSelector}
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.bankIconWrapper}>
                  <Image
                    source={selectedBank.logo}
                    style={styles.bankIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.bankName}>{selectedBank.bankName}</Text>
                  <Text style={styles.savingTxt}>Saving</Text>
                </View>
                <Image
                  source={require('../../assets/image/appIcon/right.png')}
                  style={styles.rightIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleScan}>
          <Image
            source={require('../../assets/image/homeIcon/scan.png')}
            style={styles.bottomIcon}
            resizeMode="contain"
          />
          <Text style={styles.bottomButtonText}>Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={handleShare}>
          <Image
            source={require('../../assets/image/appIcon/share.png')}
            style={styles.bottomIcon}
            resizeMode="contain"
          />
          <Text style={styles.bottomButtonText}>Share QR</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
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
                  <Text style={[styles.modalText, { color: themeColors.text }]}>
                    {item.bankName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* 🔹 Custom Toast */}
      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  qrCard: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(20),
    alignItems: 'center',
    elevation: scaleUtils.scaleWidth(5),
    shadowColor: Colors.darkGrey,
    shadowOffset: { width: 0, height: scaleUtils.scaleHeight(6) },
    shadowOpacity: 0.3,
    shadowRadius: scaleUtils.scaleWidth(8),
    position: 'relative',
    marginTop: '10%',
  },
  avatarWrapper: {
    width: scaleUtils.scaleWidth(50),
    height: scaleUtils.scaleWidth(50),
    borderRadius: scaleUtils.scaleWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleUtils.scaleWidth(20),
    position: 'absolute',
    top: scaleUtils.scaleHeight(-25),
    borderWidth: scaleUtils.scaleWidth(3),
    borderColor: Colors.gradientPrimary,
  },
  avatarText: { fontSize: scaleUtils.scaleFont(24), fontWeight: 'bold' },
  userName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginVertical: scaleUtils.scaleHeight(20),
  },
  userNameImage: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginVertical: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(6),
  },
  upiId: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
  upiIdImage: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    marginBottom: scaleUtils.scaleHeight(16),
  },
  qrWrapper: {
    backgroundColor: Colors.white,
    padding: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(16),
  },
  bankIconWrapper: {
    width: scaleUtils.scaleWidth(34),
    height: scaleUtils.scaleWidth(34),
    borderRadius: scaleUtils.scaleWidth(34),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  copyIconWrapper: {
    width: scaleUtils.scaleWidth(26),
    height: scaleUtils.scaleWidth(26),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(30),
  },
  copyIcon: {
    width: scaleUtils.scaleWidth(14),
    height: scaleUtils.scaleWidth(14),
    tintColor: Colors.black,
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(10),
    marginTop: scaleUtils.scaleHeight(10),
  },
  bankSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(14),
    borderRadius: scaleUtils.scaleWidth(10),
    columnGap: scaleUtils.scaleWidth(10),
  },
  bankIcon: {
    width: scaleUtils.scaleWidth(26),
    height: scaleUtils.scaleWidth(26),
  },
  rightIcon: {
    width: scaleUtils.scaleWidth(12),
    height: scaleUtils.scaleWidth(12),
    tintColor: Colors.white,
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    lineHeight: scaleUtils.scaleHeight(15),
  },
  textContainer: {},
  savingTxt: {
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    lineHeight: scaleUtils.scaleHeight(15),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: scaleUtils.scaleWidth(16),
    borderTopRightRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(16),
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleHeight(10),
    color: Colors.black,
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
    color: Colors.black,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(16),
    justifyContent: 'center',
    paddingVertical: scaleUtils.scaleHeight(10),
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gradientSecondary,
    width: scaleUtils.scaleWidth(130),
    height: scaleUtils.scaleHeight(40),
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(12),
  },
  bottomIcon: {
    width: scaleUtils.scaleWidth(18),
    height: scaleUtils.scaleWidth(18),
    tintColor: Colors.white,
    marginRight: scaleUtils.scaleWidth(8),
  },
  bottomButtonText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  receiver: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  iconStyle: {
    width: scaleUtils.scaleWidth(30),
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  phonePeIconStyle: {
    width: scaleUtils.scaleWidth(45),
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  bhimIconStyle: {
    width: scaleUtils.scaleWidth(35),
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  iconContainer: {
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(10),
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(2),
  },
});

export default ReceiveMoneyScreen;
