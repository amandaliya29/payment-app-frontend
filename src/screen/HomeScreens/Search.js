import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import Input from '../../component/Input';
import I18n from '../../utils/language/i18n';
import { searchUser } from '../../utils/apiHelper/Axios'; // 👈 API call
import { useNavigation } from '@react-navigation/native';

const Search = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
  };

  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-focus input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search API call
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (searchText.trim() === '') {
        setFilteredPeople([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await searchUser(searchText);

        if (res.data?.status && Array.isArray(res.data?.data)) {
          setFilteredPeople(res.data.data);
        } else {
          setFilteredPeople([]);
        }
      } catch (error) {
        setFilteredPeople([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchText]);

  // Handle user selection and store in recent searches
  const handleSelectPerson = person => {
    const updatedRecent = [
      person,
      ...recentSearches.filter(p => p.id !== person.id),
    ].slice(0, 5); // keep only 5 recent items
    setRecentSearches(updatedRecent);
    navigation.navigate('EnterAmountScreen', {
      user: { name: person.name, upiCode: person.upi_id, phone: person.phone }, // static user
    });
  };

  const renderPersonItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.peopleItem,
        { borderBottomColor: isDark ? Colors.grey : Colors.greyLight },
      ]}
      onPress={() => handleSelectPerson(item)}
    >
      <View style={styles.peopleInfo}>
        <View style={styles.peopleCircle}>
          <Text style={styles.initial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text
            style={[styles.peopleName, { color: themeColors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.peopleNumber, { color: Colors.grey }]}>
            {item.phone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('search')} onBack={() => navigation.goBack()} />

      <View style={styles.inputContainer}>
        <Input
          ref={inputRef}
          isSearch
          value={searchText}
          onChange={setSearchText}
          placeholder={I18n.t('search_name_or_number')}
        />
      </View>

      <View style={{ marginHorizontal: scaleUtils.scaleWidth(16), flex: 1 }}>
        {searchText.trim() === '' ? (
          <>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {I18n.t('recent_searches')}
            </Text>
            {recentSearches.length > 0 ? (
              <FlatList
                data={recentSearches}
                renderItem={renderPersonItem}
                keyExtractor={item => item.id?.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.peopleList}
              />
            ) : (
              <Text
                style={[
                  styles.noResult,
                  { color: Colors.grey, textAlign: 'center' },
                ]}
              >
                No recent searches
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {I18n.t('people')}
            </Text>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={Colors.gradientSecondary}
                style={{ marginTop: 20 }}
              />
            ) : filteredPeople.length > 0 ? (
              <FlatList
                data={filteredPeople}
                renderItem={renderPersonItem}
                keyExtractor={item => item.id?.toString()}
                contentContainerStyle={styles.peopleList}
              />
            ) : (
              <Text
                style={[
                  styles.noResult,
                  { color: Colors.grey, textAlign: 'center' },
                ]}
              >
                {I18n.t('no_result_found')}
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { paddingHorizontal: scaleUtils.scaleWidth(16) },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(16),
    marginBottom: scaleUtils.scaleHeight(12),
    marginTop: scaleUtils.scaleHeight(10),
  },
  peopleItem: {
    paddingVertical: scaleUtils.scaleHeight(12),
  },
  peopleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(12),
  },
  peopleCircle: {
    width: scaleUtils.scaleWidth(45),
    height: scaleUtils.scaleWidth(45),
    borderRadius: scaleUtils.scaleWidth(45),
    backgroundColor: Colors.gradientSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: Colors.white,
    fontSize: scaleUtils.scaleFont(18),
    fontWeight: 'bold',
  },
  peopleName: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },
  peopleNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(12),
  },
  noResult: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
    marginTop: scaleUtils.scaleHeight(20),
  },
});
