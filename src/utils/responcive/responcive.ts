import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;


// width percentage
export const wp = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};


// height percentage
export const hp = (size: number) => {
  return (height / guidelineBaseHeight) * size;
};


// font scale (IMPORTANT)
export const scaleFont = (size: number) => {
  const scale = width / guidelineBaseWidth;
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};