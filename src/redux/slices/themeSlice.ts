import { createSlice } from "@reduxjs/toolkit";
import { BrandThemeKey } from "../../theme/color";

const initialState = {
  mode: "light" as "light" | "dark",
  brandKey: "blue" as BrandThemeKey,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    setBrandTheme: (state, action) => {
      state.brandKey = action.payload;
    },
    setThemePreferences: (state, action) => {
      state.mode = action.payload.mode ?? state.mode;
      state.brandKey = action.payload.brandKey ?? state.brandKey;
    },
  },
});

export const { toggleTheme, setTheme, setBrandTheme, setThemePreferences } = themeSlice.actions;
export default themeSlice.reducer;
