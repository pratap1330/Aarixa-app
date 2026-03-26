import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;

export const scaleFont = (size: number) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };