// src/screens/TransactionHistoryScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Modal,
  FlatList,
  useColorScheme,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button'; // ✅ Reuse your shared Button component
import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import {
  startLoading,
  startLoadingMore,
  setTransactionsPage,
  appendTransactionsPage,
  clearTransactions,
  setError,
} from '../../utils/redux/TransactionSlice'; // adjust path if needed
import {
  getTransactions,
  getBankAccountList,
} from '../../utils/apiHelper/Axios'; // adjust path to your api file

const TransactionHistoryScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    sections: reduxSections,
    page: reduxPage,
    lastPage: reduxLastPage,
    isLoading: reduxIsLoading,
    isLoadingMore: reduxIsLoadingMore,
  } = useSelector(state => state.transaction);

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    border: isDark ? Colors.grey : Colors.greyLight,
    modalBg: isDark ? Colors.darkCard : Colors.lightCard,
    divider: isDark ? Colors.darkGrey : Colors.grey,
  };

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    date: '',
    amount: '',
    paymentType: '',
  });

  const [filterOptions, setFilterOptions] = useState({
    status: [I18n.t('completed'), I18n.t('failed'), I18n.t('processing')],
    paymentMethod: ['Bank A', 'Bank B', 'Bank C'],
    date: [
      I18n.t('this_month'),
      I18n.t('last_30_days'),
      I18n.t('last_90_days'),
    ],
    amount: [
      I18n.t('upto_200'),
      I18n.t('200_500'),
      I18n.t('500_2000'),
      I18n.t('above_2000'),
    ],
    paymentType: [
      I18n.t('money_sent'),
      I18n.t('money_received'),
      I18n.t('self_transfer'),
    ],
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchBanks();
    // initial load page 1
    fetchTransactions(1, true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const openFilter = type => {
    setSelectedFilter(type);
    setModalVisible(true);
  };

  const mapApiItemToRow = item => {
    // Determine name for UI
    const name =
      item.counterparty?.name ||
      item.counterparty?.upi ||
      item.counterparty?.account ||
      '';

    // parse created_at to readable date like '26 October'
    const dateObj = item.created_at ? new Date(item.created_at) : null;
    let dateStr = item.created_at;
    if (dateObj) {
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('default', { month: 'long' });
      dateStr = `${day} ${month}`;
    }

    // mode: "debit" -> negative amount, "credit" -> positive amount
    const rawAmount = parseFloat(item.amount || 0);
    const signedAmount =
      item.mode === 'debit' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    return {
      id: item.transaction_id || `${item.transaction_id}-${Math.random()}`,
      name,
      date: dateStr,
      amount: signedAmount,
      raw: item,
      month:
        item.month ||
        (dateObj
          ? `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`
          : ''),
    };
  };

  const groupIntoSections = apiDataArray => {
    const grouped = {};
    apiDataArray.forEach(tx => {
      const mapped = mapApiItemToRow(tx);
      const month = mapped.month || 'Unknown';
      if (!grouped[month])
        grouped[month] = { title: month, total: 0, data: [] };
      grouped[month].data.push(mapped);
      grouped[month].total = grouped[month].data.reduce(
        (acc, it) => acc + (it.amount || 0),
        0,
      );
    });

    // Preserve API order by using insertion order of keys
    const sectionArray = Object.keys(grouped).map(k => grouped[k]);
    return sectionArray;
  };

  const fetchBanks = async () => {
    try {
      const res = await getBankAccountList();
      if (res?.data) {
        const banks = res.data.data || res.data;
        if (Array.isArray(banks) && banks.length) {
          // map to { label, value } to show label in modal and store value
          const names = banks.map(b => ({
            label: b.bank_name || b.name || `Bank ${b.id}`,
            value: b.id,
          }));
          setFilterOptions(prev => ({ ...prev, paymentMethod: names }));
        }
      }
    } catch (err) {
      console.warn('fetchBanks error', err);
    }
  };

  const buildPayloadFromFilters = () => {
    const payload = {};
    if (filters.status) payload.status = filters.status;
    if (filters.paymentMethod) {
      if (
        typeof filters.paymentMethod === 'object' &&
        filters.paymentMethod.value
      ) {
        payload.payment_method = filters.paymentMethod.value;
      } else {
        payload.payment_method = filters.paymentMethod;
      }
    }
    if (filters.date) payload.date_range = filters.date;
    if (filters.amount) payload.amount_range = filters.amount;
    if (filters.paymentType) payload.payment_type = filters.paymentType;
    return payload;
  };

  const fetchTransactions = async (page = 1, replace = false) => {
    try {
      if (!mountedRef.current) return;
      const payload = buildPayloadFromFilters();

      if (page === 1) dispatch(startLoading());
      else dispatch(startLoadingMore());

      const res = await getTransactions(payload, page);

      if (!res || !res.data) {
        dispatch(setError('Invalid response'));
        return;
      }

      const body = res.data;
      if (!body.status) {
        dispatch(setError(body.messages || 'Error fetching'));
        return;
      }

      const pageData = body.data || body;
      const transactionsArray = pageData.data || [];
      const newSections = groupIntoSections(transactionsArray);

      const pageNum = pageData.current_page || page;
      const lastPage = pageData.last_page || pageNum;
      const total = pageData.total || transactionsArray.length;
      const per_page = pageData.per_page || 20;

      const payloadForStore = {
        sections: newSections,
        page: pageNum,
        lastPage,
        total,
        per_page,
      };

      if (pageNum === 1 || replace) {
        dispatch(setTransactionsPage(payloadForStore));
      } else {
        dispatch(appendTransactionsPage(payloadForStore));
      }
    } catch (err) {
      console.warn('fetchTransactions err', err);
      const message =
        err?.response?.data?.message || err?.message || 'Network Error';
      dispatch(setError(message));
    }
  };

  const applyFilter = option => {
    let valToStore = option;
    if (
      selectedFilter === 'paymentMethod' &&
      Array.isArray(filterOptions.paymentMethod)
    ) {
      const match = filterOptions.paymentMethod.find(
        o =>
          (typeof o === 'string' && o === option) ||
          (typeof o === 'object' &&
            (o.label === option ||
              o.value === option ||
              (option && option.label === o.label))),
      );
      if (match) valToStore = match;
    }

    setFilters(prev => ({ ...prev, [selectedFilter]: valToStore }));
    setModalVisible(false);

    // clear redux and fetch fresh
    dispatch(clearTransactions());
    fetchTransactions(1, true);
  };

  const onEndReachedCalledDuringMomentum = useRef(false);

  const handleLoadMore = () => {
    if (reduxIsLoadingMore || reduxIsLoading) return;
    const nextPage = reduxPage + 1;
    if (nextPage <= reduxLastPage) {
      fetchTransactions(nextPage, false);
    }
  };

  // Render unchanged except amount color & sign controlled by amount value (negative => debit)
  const renderTransaction = ({ item }) => (
    <View
      style={[styles.transactionRow, { borderBottomColor: themeColors.border }]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name?.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: themeColors.text }]}>
          {item.name}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: item.amount >= 0 ? Colors.green : Colors.error },
        ]}
      >
        {item.amount >= 0 ? `+${item.amount}` : `${item.amount}`}
      </Text>
    </View>
  );

  const renderHeader = ({ section }) => (
    <View
      style={[styles.sectionHeader, { backgroundColor: themeColors.modalBg }]}
    >
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        {section.title}
      </Text>
      <Text
        style={[
          styles.sectionTotal,
          { color: section.total >= 0 ? Colors.green : Colors.error },
        ]}
      >
        {section.total >= 0 ? `+${section.total}` : `${section.total}`}
      </Text>
    </View>
  );

  const ListFooterComponent = () => {
    if (reduxIsLoadingMore) {
      return (
        <View style={{ padding: 12, alignItems: 'center' }}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('transaction_history')}
        onBack={() => navigation.goBack()}
      />

      {/* Horizontal Filter FlatList */}
      <View style={{ marginVertical: scaleUtils.scaleHeight(10) }}>
        <FlatList
          horizontal
          data={Object.keys(filters)}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.modalBg,
                },
              ]}
              onPress={() => openFilter(item)}
            >
              <Text style={[styles.filterText, { color: themeColors.text }]}>
                {filters[item] && typeof filters[item] === 'object'
                  ? filters[item].label || filters[item].value || I18n.t(item)
                  : filters[item] || I18n.t(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Transaction Section List */}
      <SectionList
        sections={reduxSections.length ? reduxSections : []}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderTransaction}
        renderSectionHeader={renderHeader}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.divider, { backgroundColor: themeColors.divider }]}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: scaleUtils.scaleWidth(16),
          paddingBottom: scaleUtils.scaleHeight(16),
        }}
        stickySectionHeadersEnabled={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (onEndReachedCalledDuringMomentum.current) return;
          onEndReachedCalledDuringMomentum.current = true;
          handleLoadMore();
          setTimeout(() => {
            onEndReachedCalledDuringMomentum.current = false;
          }, 500);
        }}
        ListFooterComponent={ListFooterComponent}
      />

      {/* Bottom Modal (styled like EnterAmountScreen) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.bottomModalContent,
            {
              backgroundColor: themeColors.background,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>
            {I18n.t('select')} {I18n.t(selectedFilter)}
          </Text>

          <FlatList
            data={
              selectedFilter === 'paymentMethod' &&
              Array.isArray(filterOptions.paymentMethod)
                ? filterOptions.paymentMethod.map(opt =>
                    typeof opt === 'string' ? opt : opt.label,
                  )
                : filterOptions[selectedFilter]
            }
            keyExtractor={item =>
              typeof item === 'string' ? item : item.label
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => applyFilter(item)}
              >
                <Text style={[styles.modalText, { color: themeColors.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={{ marginTop: scaleUtils.scaleHeight(16) }}>
            <Button
              title={I18n.t('cancel')}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  filterScroll: {
    height: scaleUtils.scaleHeight(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(20),
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(14),
    marginRight: scaleUtils.scaleWidth(8),
  },
  filterText: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(13),
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaleUtils.scaleHeight(6),
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: scaleUtils.scaleFont(18),
  },
  sectionTotal: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(16),
  },

  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(12),
  },
  avatar: {
    width: scaleUtils.scaleWidth(40),
    height: scaleUtils.scaleWidth(40),
    borderRadius: scaleUtils.scaleWidth(40),
    backgroundColor: Colors.gradientSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaleUtils.scaleWidth(12),
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: scaleUtils.scaleFont(18),
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(12),
    color: Colors.grey,
  },
  amount: {
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
  },
  bottomModalContent: {
    borderTopLeftRadius: scaleUtils.scaleWidth(20),
    borderTopRightRadius: scaleUtils.scaleWidth(20),
    padding: scaleUtils.scaleWidth(16),
    maxHeight: '60%',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: scaleUtils.scaleFont(16),
    marginBottom: scaleUtils.scaleHeight(10),
  },
  modalItem: {
    paddingVertical: scaleUtils.scaleHeight(10),
  },
  modalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: scaleUtils.scaleHeight(12),
  },
  cancelText: {
    color: Colors.red,
    fontFamily: 'Poppins-Medium',
    fontSize: scaleUtils.scaleFont(14),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
