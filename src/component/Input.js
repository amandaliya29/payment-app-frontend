import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from 'react-native';
import scaleUtils from '../utils/Responsive';
import { Colors } from '../themes/Colors';

const Input = forwardRef(
  (
    {
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
      isSearch = false,
      onSearchPress,
      uppercaseOnly = false,
    },
    ref,
  ) => {
    // 👈 forward ref here
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const isPhoneInput = keyboardType === 'phone-pad';

    const handleAadhaarChange = text => {
      let cleaned = text.replace(/\D/g, '');
      cleaned = cleaned.slice(0, 12);
      let formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      onChange(formatted);
    };

    const handleChange = text => {
      if (uppercaseOnly) {
        const formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        onChange(formatted);
      } else if (keyboardType === 'numeric' && maxLength === 12) {
        handleAadhaarChange(text);
      } else {
        onChange(text);
      }
    };

    return (
      <View style={{ marginBottom: scaleUtils.scaleHeight(16) }}>
        {label ? (
          <Text
            style={[
              styles.label,
              { color: isDark ? Colors.white : Colors.black },
            ]}
          >
            {label}
          </Text>
        ) : null}

        {isSearch && (
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? Colors.secondaryBg : Colors.white,
                borderColor: isDark ? Colors.bg : Colors.greyLight,
                marginTop: 20,
              },
            ]}
          >
            <TouchableOpacity onPress={onSearchPress} style={styles.eyeWrapper}>
              <Image
                source={require('../assets/image/appIcon/search.png')}
                style={{
                  width: scaleUtils.scaleWidth(16),
                  height: scaleUtils.scaleWidth(16),
                  tintColor: isDark ? Colors.grey : Colors.black,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              ref={ref} // ✅ attach forwarded ref here
              value={value}
              onChangeText={handleChange}
              onFocus={onFocus}
              style={[
                styles.insideText,
                style,
                { color: isDark ? Colors.white : Colors.black },
              ]}
              keyboardType="default"
              returnKeyType="search"
              placeholder={placeholder || 'Search...'}
              editable={editable}
              maxLength={maxLength}
              placeholderTextColor={
                placeholderTextColor || (isDark ? Colors.grey : Colors.greyDark)
              }
              autoCapitalize={uppercaseOnly ? 'characters' : 'none'}
            />
          </View>
        )}

        {!secureTextEntry && !isSearch && (
          <>
            {isPhoneInput ? (
              <View
                style={[
                  styles.phoneContainer,
                  {
                    backgroundColor: isDark
                      ? Colors.secondaryBg
                      : Colors.lightBg,
                    borderColor: isDark ? Colors.bg : Colors.greyLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.replaceStyle,
                    {
                      backgroundColor: isDark
                        ? Colors.secondary
                        : Colors.secondary,
                    },
                  ]}
                >
                  <Text style={[styles.prefix, { color: Colors.white }]}>
                    +91
                  </Text>
                </View>
                <View
                  style={[styles.divider, { backgroundColor: Colors.grey }]}
                />
                <TextInput
                  ref={ref} // ✅ attach ref here if needed for phone input too
                  value={value}
                  onChangeText={text => onChange(text.replace(/^(\+91)/, ''))}
                  onFocus={onFocus}
                  style={[
                    styles.phoneTextInput,
                    style,
                    { color: isDark ? Colors.white : Colors.black },
                  ]}
                  keyboardType={'phone-pad'}
                  returnKeyType={returnKeyType || 'default'}
                  placeholder={placeholder || ''}
                  editable={editable}
                  maxLength={maxLength}
                  textAlignVertical="center"
                  placeholderTextColor={
                    placeholderTextColor ||
                    (isDark ? Colors.grey : Colors.greyDark)
                  }
                />
              </View>
            ) : (
              <TextInput
                ref={ref} // ✅ attach ref for normal input if needed
                value={value}
                onChangeText={handleChange}
                onFocus={onFocus}
                style={[
                  styles.textInput,
                  style,
                  {
                    backgroundColor: isDark
                      ? Colors.secondaryBg
                      : Colors.lightBg,
                    borderColor: isDark ? Colors.bg : Colors.greyLight,
                    color: isDark ? Colors.white : Colors.black,
                  },
                ]}
                keyboardType={keyboardType || 'default'}
                returnKeyType={returnKeyType || 'default'}
                placeholder={placeholder || ''}
                multiline={multiline}
                editable={editable}
                numberOfLines={multiline ? 5 : 1}
                maxLength={
                  keyboardType === 'numeric' && maxLength === 12
                    ? 14
                    : maxLength
                }
                textAlignVertical={multiline ? 'top' : 'center'}
                placeholderTextColor={
                  placeholderTextColor ||
                  (isDark ? Colors.grey : Colors.greyDark)
                }
                autoCapitalize={uppercaseOnly ? 'characters' : 'none'}
              />
            )}
          </>
        )}

        {secureTextEntry && !isSearch && (
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? Colors.secondaryBg : Colors.lightBg,
                borderColor: isDark ? Colors.bg : Colors.greyLight,
              },
            ]}
          >
            <TextInput
              ref={ref} // ✅ attach ref for secure input
              value={value}
              onChangeText={handleChange}
              onFocus={onFocus}
              style={[
                styles.insideText,
                style,
                { color: isDark ? Colors.white : Colors.black },
              ]}
              keyboardType={keyboardType || 'default'}
              returnKeyType={returnKeyType || 'default'}
              placeholder={placeholder || ''}
              multiline={multiline}
              secureTextEntry={isSecure}
              editable={editable}
              numberOfLines={multiline ? 5 : 1}
              maxLength={maxLength}
              textAlignVertical={multiline ? 'top' : 'center'}
              placeholderTextColor={
                placeholderTextColor || (isDark ? Colors.grey : Colors.greyDark)
              }
              autoCapitalize={uppercaseOnly ? 'characters' : 'none'}
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
                  tintColor: isDark ? Colors.grey : Colors.black,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

export default Input;

const styles = StyleSheet.create({
  label: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    marginLeft: scaleUtils.scaleWidth(4),
    marginBottom: scaleUtils.scaleHeight(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scaleUtils.scaleHeight(45),
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    alignSelf: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(10),
  },
  insideText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
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
  },
  prefix: {
    fontSize: scaleUtils.scaleFont(14),
    textAlign: 'center',
  },
  phoneTextInput: {
    flex: 1,
    fontSize: scaleUtils.scaleFont(14),
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
    borderWidth: 1,
    borderRadius: scaleUtils.scaleWidth(12),
    fontFamily: 'Poppins-Regular',
    fontSize: scaleUtils.scaleFont(14),
    marginBottom: scaleUtils.scaleHeight(8),
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
