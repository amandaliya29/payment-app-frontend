import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';

const formatIndian = num => {
  if (!num) return '0';
  return Number(num).toLocaleString('en-IN');
};

const NbfcCreditUpiHome = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { upi_id, credit_limit, available_credit, status } = route.params || {};

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  const availableLimit = Number(available_credit) || 0;
  const totalLimit = Number(credit_limit) || 0;
  const progressValue = totalLimit > 0 ? availableLimit / totalLimit : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('nbfc_credit_upi')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* TOP CARD */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.topCard}
        >
          <View style={styles.row}>
            <Text style={styles.email}>{upi_id}</Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    status === 'active' ? Colors.green : Colors.error,
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {status === 'active' ? I18n.t('active') : I18n.t('inactive')}
              </Text>
            </View>
          </View>

          <Text style={styles.nbfcTitle}>{I18n.t('nbfc_credit_upi')}</Text>

          <View style={styles.limitRow}>
            <Text style={styles.amount}>₹{formatIndian(availableLimit)}</Text>
            <Text style={styles.totalLimit}>₹{formatIndian(totalLimit)}</Text>
          </View>

          <Progress.Bar
            progress={progressValue}
            width={null}
            color={Colors.white}
            height={scaleUtils.scaleHeight(6)}
            borderRadius={scaleUtils.scaleHeight(6)}
          />

          {/* BUTTONS */}
          {status === 'inactive' ? (
            <TouchableOpacity
              style={[styles.activateButton, { backgroundColor: Colors.white }]}
              onPress={() => navigation.navigate('NbfcCreditUpiPin')}
            >
              <Text style={[styles.activateText, { color: Colors.primary }]}>
                {I18n.t('enter_pin_activate')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>{I18n.t('pay_now')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>
                  {I18n.t('view_transactions')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NbfcCreditUpiHome;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: scaleUtils.scaleWidth(14) },
  topCard: {
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(20),
    paddingVertical: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  email: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  nbfcTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    marginTop: scaleUtils.scaleHeight(10),
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  amount: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  totalLimit: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
  badge: {
    paddingHorizontal: scaleUtils.scaleWidth(10),
    paddingVertical: scaleUtils.scaleHeight(3),
    borderRadius: scaleUtils.scaleWidth(8),
  },
  badgeText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: scaleUtils.scaleHeight(10),
  },
  actionButton: {
    width: '46%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleUtils.scaleWidth(6),
    height: scaleUtils.scaleHeight(35),
    borderWidth: 0.5,
    borderColor: Colors.white,
    marginTop: scaleUtils.scaleHeight(10),
  },
  actionText: {
    fontSize: scaleUtils.scaleFont(13),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  activateButton: {
    marginTop: scaleUtils.scaleHeight(20),
    width: '100%',
    height: scaleUtils.scaleHeight(35),
    backgroundColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
  },
});
