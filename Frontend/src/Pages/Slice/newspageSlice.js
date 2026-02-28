import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  config: null
};

const newspageSlice = createSlice({
  name: "newspage",
  initialState,
  reducers: {
    setNewsPageConfig: (state, action) => {
      state.config = action.payload;
    }
  }
});

export const { setNewsPageConfig } = newspageSlice.actions;

export default newspageSlice.reducer;
