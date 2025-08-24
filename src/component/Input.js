import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import scaleUtils from '../utils/Responsive';
import { Colors } from '../themes/Colors';

const Input = ({
  label,
  value,
  secureTextEntry = false,
  multiline = false,
  placeholder,
  placeholderTextColor,
  onChange,
  keyboardType,
  returnKeyType,
  onFocus,
  editable = true,
  maxLength,
  isSecure,
  setIsSecure,
  errorText,
  style,
  isSearch = false, // 👈 added prop for search input
  onSearchPress,
}) => {
  const isPhoneInput = keyboardType === 'phone-pad';

  return (
    <View style={{ marginBottom: scaleUtils.scaleHeight(16) }}>
      {/* Label on top */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Search Input */}
      {isSearch && (
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={onSearchPress} style={styles.eyeWrapper}>
            <Image
              source={require('../assets/image/appIcon/search.png')}
              style={{
                width: scaleUtils.scaleWidth(16),
                height: scaleUtils.scaleWidth(16),
                tintColor: Colors.grey,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInput
            value={value}
            onChangeText={onChange}
            onFocus={onFocus}
            style={[styles.insideText, style]}
            keyboardType="default"
            returnKeyType="search"
            placeholder={placeholder || 'Search...'}
            editable={editable}
            maxLength={maxLength}
            placeholderTextColor={placeholderTextColor || Colors.white}
          />
        </View>
      )}

      {/* Normal Input */}
      {!secureTextEntry && !isSearch && (
        <>
          {isPhoneInput ? (
            <View style={styles.phoneContainer}>
              <View style={styles.replaceStyle}>
                <Text style={styles.prefix}>+91</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                value={value}
                onChangeText={text => {
                  onChange(text.replace(/^(\+91)/, ''));
                }}
                onFocus={onFocus}
                style={[styles.phoneTextInput, style]}
                keyboardType={'phone-pad'}
                returnKeyType={returnKeyType || 'default'}
                placeholder={placeholder || ''}
                editable={editable}
                maxLength={maxLength}
                textAlignVertical="center"
                placeholderTextColor={placeholderTextColor || Colors.white}
              />
            </View>
          ) : (
            <>
              <TextInput
                value={value}
                onChangeText={onChange}
                onFocus={onFocus}
                style={[styles.textInput, style]}
                keyboardType={keyboardType || 'default'}
                returnKeyType={returnKeyType || 'default'}
                placeholder={placeholder || ''}
                multiline={multiline}
                editable={editable}
                numberOfLines={multiline ? 5 : 1}
                maxLength={maxLength}
                textAlignVertical={multiline ? 'top' : 'center'}
                placeholderTextColor={placeholderTextColor || Colors.white}
              />
              {errorText ? (
                <Text style={styles.errorTextStyle}>{errorText}</Text>
              ) : null}
            </>
          )}
        </>
      )}

      {/* Secure Input (Password field) */}
      {secureTextEntry && !isSearch && (
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            onChangeText={onChange}
            onFocus={onFocus}
            style={[styles.insideText, style]}
            keyboardType={keyboardType || 'default'}
            returnKeyType={returnKeyType || 'default'}
            placeholder={placeholder || ''}
            multiline={multiline}
            secureTextEntry={isSecure}
            editable={editable}
            numberOfLines={multiline ? 5 : 1}
            maxLength={maxLength}
            textAlignVertical={multiline ? 'top' : 'center'}
            placeholderTextColor={placeholderTextColor || Colors.white}
          />
          <TouchableOpacity onPress={setIsSecure} style={styles.eyeWrapper}>
            <Image
              source={
                isSecure
                  ? require('../assets/image/appIcon/eyes.png')
                  : require('../assets/image/appIcon/eye.png')
              }
              style={{
                width: scaleUtils.scaleWidth(20),
                height: scaleUtils.scaleWidth(20),
                tintColor: Colors.gray,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    marginLeft: scaleUtils.scaleWidth(4),
    marginBottom: scaleUtils.scaleHeight(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scaleUtils.scaleHeight(45),
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.bg,
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    alignSelf: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  insideText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
  },
  eyeWrapper: {
    padding: scaleUtils.scaleWidth(8),
  },
  errorTextStyle: {
    color: Colors.error,
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(12),
    marginLeft: scaleUtils.scaleWidth(10),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scaleUtils.scaleHeight(45),
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.bg,
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    alignSelf: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(8),
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.grey,
    marginHorizontal: scaleUtils.scaleWidth(15),
  },
  replaceStyle: {
    width: scaleUtils.scaleWidth(40),
    height: '70%',
    borderRadius: scaleUtils.scaleHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  prefix: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    textAlign: 'center',
  },
  phoneTextInput: {
    flex: 1,
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingVertical: 0,
    includeFontPadding: false,
    fontFamily: 'Poppins-Regular',
  },
  textInput: {
    paddingHorizontal: scaleUtils.scaleWidth(12),
    paddingVertical: 0,
    width: '100%',
    height: scaleUtils.scaleHeight(45),
    alignSelf: 'center',
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.bg,
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    marginBottom: scaleUtils.scaleHeight(8),
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
