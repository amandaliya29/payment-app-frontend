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
  ToastAndroid,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import I18n from '../../utils/language/i18n';

const ReceiveMoneyScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
  };

  const banks = [
    {
      id: 1,
      name: 'Ashish Jagdishbhai Mandaliya',
      upiId: 'ashishmandaliay123@sbi',
      logo: require('../../assets/image/bankIcon/sbi.png'),
      bankName: 'State Bank of India',
    },
    {
      id: 2,
      name: 'Ashish Jagdishbhai Mandaliya',
      upiId: 'ashishmandaliay456@hdfcbank',
      logo: require('../../assets/image/bankIcon/hdfc.png'),
      bankName: 'HDFC Bank',
    },
    {
      id: 3,
      name: 'Ashish Jagdishbhai Mandaliya',
      upiId: 'ashishmandaliay789@icici',
      logo: require('../../assets/image/bankIcon/icici.png'),
      bankName: 'ICICI Bank',
    },
  ];

  const [selectedBank, setSelectedBank] = useState(banks[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const copyUPI = () => {
    Clipboard.setString(selectedBank.upiId);
    if (Platform.OS === 'android') {
      ToastAndroid.show(I18n.t('upi_id_copied'), ToastAndroid.SHORT);
    } else {
      Alert.alert(I18n.t('copied'), I18n.t('upi_id_copied'));
    }
  };

  const getInitial = name => name?.charAt(0)?.toUpperCase() || '';

  const handleBankSelect = bank => {
    setSelectedBank(bank);
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('receive_money_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              value={selectedBank.upiId}
              size={scaleUtils.scaleWidth(220)}
              color={Colors.black}
              backgroundColor={Colors.white}
            />
          </View>

          {/* <Text style={styles.upiId}>{I18n.t('upi_id_label')}</Text> */}

          <View style={styles.upiContainer}>
            <Text style={styles.upiId}>{selectedBank.upiId}</Text>
            <TouchableOpacity onPress={copyUPI} style={styles.copyIconWrapper}>
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
            <Text style={styles.bankName}>{selectedBank.bankName}</Text>
            <Image
              source={require('../../assets/image/appIcon/right.png')}
              style={styles.rightIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

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
    </SafeAreaView>
  );
};

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
  avatarText: {
    fontSize: scaleUtils.scaleFont(24),
    fontFamily: 'Poppins-Bold',
  },
  userName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    marginVertical: scaleUtils.scaleHeight(20),
  },
  upiId: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
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
    width: scaleUtils.scaleWidth(30),
    height: scaleUtils.scaleWidth(30),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(30),
  },
  copyIcon: {
    width: scaleUtils.scaleWidth(18),
    height: scaleUtils.scaleWidth(18),
    tintColor: Colors.gradientPrimary,
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scaleUtils.scaleWidth(10),
    marginBottom: scaleUtils.scaleHeight(20),
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
  closeButton: {
    marginTop: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
    padding: scaleUtils.scaleWidth(8),
    backgroundColor: Colors.gradientSecondary,
    borderRadius: scaleUtils.scaleWidth(10),
  },
  closeText: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
});

export default ReceiveMoneyScreen;
