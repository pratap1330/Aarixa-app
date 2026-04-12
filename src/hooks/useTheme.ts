import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { getThemeColors } from "../theme/color";

export const useAppTheme = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const brandKey = useSelector((state: RootState) => state.theme.brandKey);
  const colors = getThemeColors(mode, brandKey);
  return { mode, brandKey, colors };
};
