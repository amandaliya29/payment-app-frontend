import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';

const LineButton = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: scaleUtils.scaleHeight(40),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(8),
    paddingVertical: scaleUtils.scaleHeight(6),
    paddingHorizontal: scaleUtils.scaleWidth(12),
    alignSelf: 'center',
  },
  text: {
    color: Colors.primary,
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default LineButton;
