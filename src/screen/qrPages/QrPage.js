import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomQRScanner from '../../component/CustomQRScanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import scaleUtils from '../../utils/Responsive';

const QrPage = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ width: '100%', paddingVertical: scaleUtils.scaleHeight(8) }}
      >
        <Header title="QR Scanner" onBack={() => navigation.goBack()} />
      </View>
      <CustomQRScanner />
    </SafeAreaView>
  );
};

export default QrPage;

const styles = StyleSheet.create({});
