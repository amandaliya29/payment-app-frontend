import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Button from '../../component/Button';
import I18n from '../../utils/language/i18n';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
// import moment from 'moment';
import moment from 'moment-timezone';

const PaymentSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const viewShotRef = useRef(null);

  const { transaction } = route.params || {};
  console.log('transaction', transaction);

  // Extract dynamic data from transaction
  const amount = transaction?.amount || '0';
  const txnId = transaction?.transaction_id || 'N/A';
  const receiverName = transaction?.receiver?.account_holder_name || 'N/A';
  const bankName = transaction?.receiver?.name || 'N/A';
  const bankAccount = transaction?.receiver?.bank_account_number || '****';
  const transactionTime = moment(transaction?.timestamp)
    .tz('Asia/Kolkata')
    .format('DD MMM YYYY | hh:mm A');

  const PlaySound = () => {
    const sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      sound.play(success => {
        if (!success) console.log('Playback failed');
      });
    });
  };

  useEffect(() => {
    PlaySound();
  }, []);

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        type: 'image/png',
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const themeColors = {
    bg: isDark ? Colors.bg : Colors.white,
    card: isDark ? Colors.darkGrey : Colors.cardGrey,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    primary: Colors.gradientPrimary,
    divider: isDark ? Colors.grey : Colors.darkGrey,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
    >
      <View style={styles.topSection}>
        <LottieView
          source={require('../../assets/animation/success.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Text style={[styles.amountText, { color: themeColors.text }]}>
          ₹{amount}
        </Text>
        <Text style={[styles.paidTo, { color: themeColors.text }]}>
          {I18n.t('paid_to')}
        </Text>
        <Text style={[styles.userName, { color: themeColors.text }]}>
          {receiverName}
        </Text>
        <Text style={[styles.bankName, { color: themeColors.text }]}>
          {I18n.t('bank_name')}: {bankName}
        </Text>
      </View>

      {/* Hidden ViewShot for shareable receipt */}
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
            alignItems: 'center',
            justifyContent: 'center',
            padding: scaleUtils.scaleWidth(20),
          }}
        >
          <LinearGradient
            colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
            style={[styles.qrCard, { padding: scaleUtils.scaleWidth(20) }]}
          >
            <Text style={[styles.amountText, { color: Colors.white }]}>
              ₹{amount}
            </Text>
            <Text style={[styles.userName, { color: Colors.white }]}>
              {I18n.t('paid_to')} {receiverName}
            </Text>
            <Text style={[styles.bankName, { color: Colors.white }]}>
              {I18n.t('bank_name')}: {bankName}
            </Text>
            <View style={styles.divider} />
            <Text style={[styles.transactionLabel, { color: Colors.white }]}>
              {I18n.t('upi_transaction_id')}: {txnId}
            </Text>
            <Text style={[styles.transactionLabel, { color: Colors.white }]}>
              {I18n.t('to')}: ****{bankAccount.slice(-4)}
            </Text>
            <Text style={[styles.dateText, { color: Colors.white }]}>
              {transactionTime}
            </Text>
          </LinearGradient>
        </View>
      </ViewShot>

      {/* Visible Transaction Card */}
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.transactionStatus, { color: themeColors.text }]}>
          {I18n.t('paid_to')} ₹ {amount}
        </Text>
        <Text style={[styles.dateText, { color: themeColors.text }]}>
          {transactionTime}
        </Text>

        <View
          style={[styles.divider, { backgroundColor: themeColors.divider }]}
        />

        <View style={styles.transactionRow}>
          <Text style={[styles.transactionLabel, { color: themeColors.text }]}>
            {I18n.t('upi_transaction_id')}
          </Text>
          <Text style={[styles.transactionValue, { color: themeColors.text }]}>
            {txnId}
          </Text>
        </View>
        <View style={styles.transactionRow}>
          <Text style={[styles.transactionLabel, { color: themeColors.text }]}>
            {I18n.t('to')}
          </Text>
          <Text style={[styles.transactionValue, { color: themeColors.text }]}>
            ****{bankAccount.slice(-4)}
          </Text>
        </View>

        <View style={styles.bottomButtons}>
          <View style={{ flex: 1 }}>
            <Button title={I18n.t('share_receipt')} onPress={handleShare} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={I18n.t('continue')}
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'HomePage' }],
                  }),
                )
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  topSection: { alignItems: 'center', marginTop: scaleUtils.scaleHeight(40) },
  lottie: {
    width: scaleUtils.scaleWidth(200),
    height: scaleUtils.scaleWidth(200),
  },
  amountText: {
    fontSize: scaleUtils.scaleFont(30),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  paidTo: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
  },
  userName: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
  },
  card: {
    width: '90%',
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(20),
    alignSelf: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  transactionStatus: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  dateText: {
    fontSize: scaleUtils.scaleFont(11),
    fontFamily: 'Poppins-Regular',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scaleUtils.scaleHeight(4),
  },
  transactionLabel: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
  transactionValue: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Medium',
  },
  bottomButtons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(10),
    alignItems: 'center',
    marginTop: scaleUtils.scaleWidth(10),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: scaleUtils.scaleHeight(12),
  },
  qrCard: {
    borderRadius: scaleUtils.scaleWidth(16),
    // alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
});

export default PaymentSuccessScreen;
