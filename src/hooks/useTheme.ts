import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { LightColors, DarkColors } from "../theme/color";

export const useAppTheme = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const colors = mode === "light" ? LightColors : DarkColors;
  return { mode, colors };
};