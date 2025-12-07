import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../themes/Colors';
import scaleUtils from '../utils/Responsive';
import LineButton from './LineButton';

const CustomAlert = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  const { colors, dark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.alertBox,
            { backgroundColor: dark ? Colors.bg : Colors.white },
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          ) : null}

          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>

          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }}>
              <LineButton title={cancelText} onPress={onCancel} />
            </View>
            <View style={{ flex: 1 }}>
              <LineButton title={confirmText} onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },

  alertBox: {
    width: '100%',
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(20),
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },

  title: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: scaleUtils.scaleHeight(8),
    textAlign: 'center',
  },

  message: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    opacity: 0.85,
    textAlign: 'center',
    marginBottom: scaleUtils.scaleHeight(18),
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: scaleUtils.scaleWidth(10),
  },
});
