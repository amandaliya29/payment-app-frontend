import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');
const isTablet = DeviceInfo.isTablet();

const tabletScaleFactor = isTablet ? 0.85 : 1;

const scaleWidth = size => scale(size) * tabletScaleFactor;
const scaleHeight = size => verticalScale(size) * tabletScaleFactor;
const scaleFont = size => moderateScale(size, isTablet ? 0.3 : 0.5);

export default {
  scaleWidth,
  scaleFont,
  scaleHeight,
  width,
  height,
  isTablet,
};
