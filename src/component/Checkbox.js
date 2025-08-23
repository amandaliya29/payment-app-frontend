import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';

const Checkbox = ({ label, checked = false, onChange, style, labelStyle }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Checkbox box */}
      <TouchableOpacity
        onPress={() => onChange(!checked)}
        activeOpacity={0.7}
        style={[styles.box, checked && styles.checkedBox]}
      >
        {checked && (
          <Image
            source={require('../assets/image/appIcon/check.png')}
            style={styles.checkIcon}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>

      {/* Label */}
      {typeof label === 'string' ? (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      ) : (
        <View style={{ marginHorizontal: scaleUtils.scaleWidth(10) }}>
          {label}
        </View>
      )}
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(6),
  },
  box: {
    width: scaleUtils.scaleWidth(18),
    height: scaleUtils.scaleWidth(18),
    borderRadius: scaleUtils.scaleWidth(6),
    borderWidth: 1,
    borderColor: Colors.grey,
    backgroundColor: Colors.secondaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  checkIcon: {
    width: scaleUtils.scaleWidth(14),
    height: scaleUtils.scaleWidth(14),
    tintColor: Colors.white,
  },
  label: {
    marginLeft: scaleUtils.scaleWidth(10),
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    includeFontPadding: false,
  },
  link: {
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
});
