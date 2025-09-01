import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import scaleUtils from '../utils/Responsive';
import { Colors } from '../themes/Colors';
import { isTablet } from 'react-native-device-info';
import { useTheme } from '@react-navigation/native';

const OTPInput = ({ code, setCode, length = 6, isSecure = false }) => {
  const inputs = useRef([]);
  const { colors, dark } = useTheme(); // 👈 theme hook

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = code.split('');
      newCode[index] = text;
      setCode(newCode.join(''));

      // Move to next box if not last
      if (text && index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = code.split('');

      if (newCode[index]) {
        newCode[index] = '';
        setCode(newCode.join(''));
      } else if (index > 0) {
        inputs.current[index - 1].focus();
        newCode[index - 1] = '';
        setCode(newCode.join(''));
      }
    }
  };

  return (
    <View style={[styles.container, { width: isTablet && '50%' }]}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => (inputs.current[index] = ref)}
          style={[
            styles.input,
            {
              color: colors.text, // 👈 text adapts
              backgroundColor: dark ? Colors.secondaryBg : colors.card, // 👈 bg adapts
              borderColor: Colors.bg, // 👈 border adapts
            },
          ]}
          value={code[index] || ''}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          secureTextEntry={isSecure}
        />
      ))}
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    columnGap: scaleUtils.scaleWidth(8),
    marginVertical: scaleUtils.scaleHeight(20),
  },
  input: {
    width: scaleUtils.scaleWidth(45),
    height: scaleUtils.scaleHeight(50),
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(10),
    textAlign: 'center',
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Medium',
  },
});
