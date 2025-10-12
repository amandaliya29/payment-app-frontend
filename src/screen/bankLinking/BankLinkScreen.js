import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation, useTheme } from '@react-navigation/native';
import Input from '../../component/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import I18n from '../../utils/language/i18n';
import { BankList } from '../../utils/apiHelper/Axios';
import { getUserData } from '../../utils/async/storage';

const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

const BankLinkScreen = () => {
  // ✅ All hooks must stay at the top level
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  // ✅ Fetch bank list from API
  useEffect(() => {
    const fetchBankList = async () => {
      try {
        const res = await BankList();
        setData(res.data || []);
      } catch (error) {
        console.log('Bank List Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankList();
  }, []);

  // ✅ Function to handle bank selection (wrapped in useCallback for stability)
  const handleBankPress = useCallback(
    async item => {
      try {
        setIsChecking(true);
        const userData = await getUserData();
        console.log('User Data:', userData);

        if (userData?.user?.has_bank_accounts) {
          navigation.navigate('UPIPinSetup', {
            token: userData.token,
            Itemid: item.id,
          });
        } else {
          navigation.navigate('AadhaarVerification', { Itemid: item.id });
        }
      } catch (error) {
        console.log('Bank selection error:', error);
      } finally {
        setIsChecking(false);
      }
    },
    [navigation],
  );

  // ✅ Filter banks
  const filteredBanks = data.filter(bank =>
    bank.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ Render each bank
  const renderBank = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bankItem,
        { backgroundColor: dark ? Colors.secondaryBg : Colors.cardGrey },
      ]}
      disabled={isChecking}
      onPress={() => handleBankPress(item)}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}/${item.logo}` }}
        style={styles.bankLogo}
      />
      <View style={styles.bankInfo}>
        <Text style={[styles.bankName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.bankSubtitle, { color: Colors.grey }]}>
          {item.slogan || 'Bank Subtitle'}
        </Text>
      </View>
      <Image
        style={[styles.rightIconStyle, { tintColor: colors.text }]}
        source={require('../../assets/image/appIcon/right.png')}
      />
    </TouchableOpacity>
  );

  // ✅ UI
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.bg : colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <Text style={[styles.skip, { color: Colors.primary }]}>
            {I18n.t('skip')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: scaleUtils.scaleWidth(20) }}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {I18n.t('link_bank_title')}
        </Text>
        <Text style={[styles.subtitle, { color: Colors.grey }]}>
          {I18n.t('link_bank_subtitle')}
        </Text>

        {/* Search */}
        <Input
          isSearch
          value={search}
          onChange={setSearch}
          placeholder={I18n.t('search_placeholder')}
          onSearchPress={() => console.log('Search Pressed:', search)}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {I18n.t('popular_banks')}
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredBanks}
            scrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            renderItem={renderBank}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={{ marginBottom: scaleUtils.scaleHeight(40) }} />
            }
          />
        )}

        {isChecking && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BankLinkScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: scaleUtils.scaleWidth(20),
    marginTop: scaleUtils.scaleHeight(10),
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
  },
  skip: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    marginTop: scaleUtils.scaleHeight(8),
    marginBottom: scaleUtils.scaleHeight(18),
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: scaleUtils.scaleHeight(16),
  },
  sectionTitle: {
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(8),
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(12),
    marginTop: scaleUtils.scaleHeight(12),
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(30),
    height: scaleUtils.scaleWidth(30),
    borderRadius: scaleUtils.scaleWidth(12),
    marginRight: scaleUtils.scaleWidth(12),
    resizeMode: 'contain',
  },
  bankInfo: { flex: 1 },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
  },
  bankSubtitle: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  rightIconStyle: {
    width: scaleUtils.scaleWidth(10),
    height: scaleUtils.scaleWidth(10),
    resizeMode: 'contain',
  },
});
