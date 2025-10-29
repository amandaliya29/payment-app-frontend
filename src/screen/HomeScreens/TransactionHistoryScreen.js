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
import Button from '../../component/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  startLoading,
  startLoadingMore,
  setTransactionsPage,
  appendTransactionsPage,
  clearTransactions,
  setError,
} from '../../utils/redux/TransactionSlice';
import {
  getTransactions,
  getBankAccountList,
} from '../../utils/apiHelper/Axios';

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
  const [filters, setFilters] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    status: [
      { label: I18n.t('pending'), value: 'pending' },
      { label: I18n.t('completed'), value: 'completed' },
      { label: I18n.t('failed'), value: 'failed' },
    ],
    paymentMethod: [],
    date: [
      { label: I18n.t('last_24h'), value: '24h' },
      { label: I18n.t('last_7d'), value: '7d' },
      { label: I18n.t('last_14d'), value: '14d' },
      { label: I18n.t('last_1m'), value: '1m' },
      { label: I18n.t('last_3m'), value: '3m' },
    ],
    amount: [
      { label: I18n.t('upto_1000'), value: 'upto_1000' },
      { label: I18n.t('1000_10000'), value: '1000_10000' },
      { label: I18n.t('15000_25000'), value: '15000_25000' },
      { label: I18n.t('25000_50000'), value: '25000_50000' },
      { label: I18n.t('50000_75000'), value: '50000_75000' },
      { label: I18n.t('75000_100000'), value: '75000_100000' },
    ],
    paymentType: [
      { label: I18n.t('send_money'), value: 'send_money' },
      { label: I18n.t('receive_money'), value: 'receive_money' },
      { label: I18n.t('self_transfer'), value: 'self_transfer' },
    ],
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchBanks();
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
    const name =
      item.counterparty?.name ||
      item.counterparty?.upi ||
      item.counterparty?.account ||
      '';

    const dateObj = item.created_at ? new Date(item.created_at) : null;
    let dateStr = item.created_at;
    if (dateObj) {
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('default', { month: 'long' });
      dateStr = `${day} ${month}`;
    }

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
          ? `${dateObj.toLocaleString('default', {
              month: 'long',
            })} ${dateObj.getFullYear()}`
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
    return Object.keys(grouped).map(k => grouped[k]);
  };

  const fetchBanks = async () => {
    try {
      const res = await getBankAccountList();
      if (res?.data) {
        const banks = res.data.data || res.data;
        if (Array.isArray(banks) && banks.length) {
          const names = banks.map(b => ({
            label: b.bank?.name || b.name || `Bank ${b.id}`,
            value: b.id,
          }));
          setFilterOptions(prev => ({ ...prev, paymentMethod: names }));
        }
      }
    } catch (err) {
      console.warn('fetchBanks error', err);
    }
  };

  const buildPayloadFromFilters = (currentFilters = filters) => {
    const payload = {};
    if (!currentFilters) return payload;

    const key = Object.keys(currentFilters)[0];
    const value = currentFilters[key]?.value;
    if (!value) return payload;

    switch (key) {
      case 'status':
        payload.status = value;
        break;
      case 'paymentMethod':
        payload.payment_method = value;
        break;
      case 'date':
        payload.date_range = value;
        break;
      case 'amount':
        payload.amount_range = value;
        break;
      case 'paymentType':
        payload.payment_type = value;
        break;
    }

    return payload;
  };

  const clearActiveFilter = () => {
    setFilters(null);
    dispatch(clearTransactions());
    fetchTransactions(1, true, {});
  };

  const fetchTransactions = async (
    page = 1,
    replace = false,
    overrideFilters = null,
  ) => {
    try {
      if (!mountedRef.current) return;

      const payload = buildPayloadFromFilters(overrideFilters || filters);
      console.log('payload', payload);

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

      const payloadForStore = {
        sections: newSections,
        page: pageNum,
        lastPage,
        total: pageData.total || transactionsArray.length,
        per_page: pageData.per_page || 20,
      };

      if (pageNum === 1 || replace)
        dispatch(setTransactionsPage(payloadForStore));
      else dispatch(appendTransactionsPage(payloadForStore));
    } catch (err) {
      console.warn('fetchTransactions err', err);
      const message =
        err?.response?.data?.message || err?.message || 'Network Error';
      dispatch(setError(message));
    }
  };

  const applyFilter = option => {
    const updatedFilter = { [selectedFilter]: option };
    setFilters(updatedFilter);
    setModalVisible(false);
    dispatch(clearTransactions());
    fetchTransactions(1, true, updatedFilter);
  };

  const onEndReachedCalledDuringMomentum = useRef(false);

  const handleLoadMore = () => {
    if (reduxIsLoadingMore || reduxIsLoading) return;
    const nextPage = reduxPage + 1;
    if (nextPage <= reduxLastPage) fetchTransactions(nextPage, false);
  };

  // ✅ Updated: add ₹ symbol
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
        {item.amount >= 0
          ? `+₹${item.amount.toFixed(2)}`
          : `-₹${Math.abs(item.amount).toFixed(2)}`}
      </Text>
    </View>
  );

  // ✅ Updated: add ₹ symbol for totals
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
        {section.total >= 0
          ? `+₹${section.total.toFixed(2)}`
          : `-₹${Math.abs(section.total).toFixed(2)}`}
      </Text>
    </View>
  );

  const ListFooterComponent = () =>
    reduxIsLoadingMore ? (
      <View style={{ padding: 12, alignItems: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    ) : null;

  const isEmpty =
    !reduxSections.length ||
    reduxSections.every(section => !section.data.length);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('transaction_history')}
        onBack={() => navigation.goBack()}
      />

      {/* FILTER BUTTONS */}
      <View style={{ marginVertical: scaleUtils.scaleHeight(10) }}>
        <FlatList
          horizontal
          data={Object.keys(filterOptions)}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => {
            const isActive =
              filters && Object.keys(filters)[0] === item && filters[item];
            return (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    borderColor: themeColors.border,
                    backgroundColor: isActive
                      ? Colors.gradientSecondary
                      : themeColors.modalBg,
                  },
                ]}
                onPress={() => openFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? Colors.white : themeColors.text },
                  ]}
                >
                  {isActive
                    ? `${I18n.t(item)}: ${filters[item].label}`
                    : I18n.t(item)}
                </Text>
                {isActive && (
                  <TouchableOpacity
                    onPress={() => {
                      clearActiveFilter();
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* TRANSACTION LIST */}
      {isEmpty && !reduxIsLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: themeColors.text, fontSize: 16 }}>
            {I18n.t('no_transactions_found')}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={reduxSections}
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
      )}

      {/* FILTER MODAL */}
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
            { backgroundColor: themeColors.background },
          ]}
        >
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>
            {I18n.t('select')} {I18n.t(selectedFilter)}
          </Text>

          <FlatList
            data={filterOptions[selectedFilter] || []}
            keyExtractor={item => item.value.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => applyFilter(item)}
              >
                <Text style={[styles.modalText, { color: themeColors.text }]}>
                  {item.label}
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
    flexDirection: 'row',
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
