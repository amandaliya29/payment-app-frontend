import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import scaleUtils from '../utils/Responsive';
import { Colors } from '../themes/Colors';
import { LanguageContext } from '../utils/language/LanguageContext';
import { useTheme } from '@react-navigation/native';

const LanguageModal = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { language, changeLanguage } = useContext(LanguageContext);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const selectLanguage = langCode => {
    changeLanguage(langCode); // updates i18n and triggers global re-render
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Select Language
          </Text>

          {languages.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langOption,
                { borderColor: Colors.primary },
                language === lang.code && { backgroundColor: Colors.primary },
              ]}
              onPress={() => selectLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.langOptionText,
                  { color: Colors.primary },
                  language === lang.code && { color: colors.text },
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    borderRadius: 12,
    padding: scaleUtils.scaleWidth(20),
  },
  modalTitle: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(6),
    textAlign: 'center',
  },
  langOption: {
    paddingVertical: scaleUtils.scaleHeight(10),
    paddingHorizontal: scaleUtils.scaleWidth(10),
    borderRadius: 8,
    marginVertical: scaleUtils.scaleHeight(6),
    borderWidth: 1,
  },
  langOptionText: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
