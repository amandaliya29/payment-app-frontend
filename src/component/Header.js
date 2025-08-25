import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';

const Header = ({ title, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Image
          source={require('../assets/image/appIcon/back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: scaleUtils.scaleHeight(4),
  },
  backButton: {
    position: 'absolute',
    left: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(4),
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(8),
    borderColor: Colors.secondary,
  },
  backIcon: {
    width: scaleUtils.scaleWidth(25),
    height: scaleUtils.scaleWidth(25),
    tintColor: Colors.white,
  },
  title: {
    fontSize: scaleUtils.scaleFont(18),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});
