import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button'; // ✅ Reuse your shared Button component
import { useNavigation } from '@react-navigation/native';

const TransactionHistoryScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();

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

  const openFilter = type => {
    setSelectedFilter(type);
    setModalVisible(true);
  };

  const filterOptions = {
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
  };

  const data = [
    {
      title: 'October 2025',
      total: 6876.2,
      data: [
        { id: 1, name: 'Ravi Kumar', date: '26 October', amount: 199.9 },
        { id: 2, name: 'Anjali Sharma', date: '25 October', amount: -120.5 },
      ],
    },
    {
      title: 'September 2025',
      total: -560.0,
      data: [
        { id: 3, name: 'Vikas Patel', date: '10 September', amount: -560.0 },
      ],
    },
  ];

  const renderTransaction = ({ item }) => (
    <View
      style={[styles.transactionRow, { borderBottomColor: themeColors.border }]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
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

  const applyFilter = option => {
    setFilters(prev => ({ ...prev, [selectedFilter]: option }));
    setModalVisible(false);
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
                {filters[item] || I18n.t(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Transaction Section List */}
      <SectionList
        sections={data}
        keyExtractor={item => item.id.toString()}
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
            data={filterOptions[selectedFilter]}
            keyExtractor={item => item}
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
    paddingVertical: scaleUtils.scaleHeight(10),
    borderRadius: scaleUtils.scaleWidth(8),
    marginTop: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(4),
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: scaleUtils.scaleFont(16),
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
    // marginVertical: scaleUtils.scaleHeight(12),
  },
});
