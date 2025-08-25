import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import scaleUtils from '../utils/Responsive';
import { Colors } from '../themes/Colors';

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabledButton : {}, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <Text style={[styles.title, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: scaleUtils.scaleHeight(40),
    backgroundColor: Colors.primary,
    borderRadius: scaleUtils.scaleWidth(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(8),
  },
  title: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  disabledButton: {
    backgroundColor: Colors.grey,
  },
});
