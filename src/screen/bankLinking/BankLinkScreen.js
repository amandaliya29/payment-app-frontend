import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import { useNavigation } from '@react-navigation/native';
import { banks } from '../../utils/BankList';
import Input from '../../component/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

const BankLinkScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderBank = ({ item }) => (
    <TouchableOpacity
      style={styles.bankItem}
      onPress={() => {
        console.log('Selected:', item.name);
        navigation.navigate('AadhaarVerification');
      }}
    >
      <Image source={item.logo} style={styles.bankLogo} />
      <View style={styles.bankInfo}>
        <Text style={styles.bankName}>{item.name}</Text>
        <Text style={styles.bankSubtitle}>{item.subtitle}</Text>
      </View>
      <Image
        style={styles.rightIconStyle}
        source={require('../../assets/image/appIcon/right.png')}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          padding: scaleUtils.scaleWidth(20),
        }}
      >
        {/* Subtitle */}
        <Text style={styles.title}>Link Your Bank Account</Text>
        <Text style={styles.subtitle}>
          Connect your bank account securely to enable seamless transactions and
          account management.
        </Text>

        <Input
          isSearch
          value={search}
          onChange={setSearch}
          placeholder="Search here..."
          onSearchPress={() => console.log('Search Pressed:', searchText)}
        />

        {/* Popular Banks */}
        <Text style={styles.sectionTitle}>Popular Banks</Text>
        <FlatList
          data={filteredBanks}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={renderBank}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={{ marginBottom: scaleUtils.scaleHeight(40) }} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BankLinkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    // padding: scaleUtils.scaleWidth(16),
  },
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
    color: Colors.white,
    alignSelf: 'center',
  },
  skip: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
  subtitle: {
    marginTop: scaleUtils.scaleHeight(8),
    marginBottom: scaleUtils.scaleHeight(18),
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: scaleUtils.scaleHeight(16),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(20),
    backgroundColor: Colors.secondaryBg,
    borderRadius: scaleUtils.scaleWidth(12),
    paddingHorizontal: scaleUtils.scaleWidth(10),
    height: scaleUtils.scaleHeight(45),
  },
  searchIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
    tintColor: Colors.grey,
    resizeMode: 'contain',
    marginRight: scaleUtils.scaleWidth(8),
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(8),
    fontSize: scaleUtils.scaleFont(15),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    alignSelf: 'center',
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
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
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
  },
  bankSubtitle: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.grey,
  },
  rightIconStyle: {
    width: scaleUtils.scaleWidth(10),
    height: scaleUtils.scaleWidth(10),
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
});
