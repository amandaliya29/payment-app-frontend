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
      <CustomQRScanner />
    </SafeAreaView>
  );
};

export default QrPage;

const styles = StyleSheet.create({});
