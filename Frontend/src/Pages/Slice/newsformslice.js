import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    timeAndDate: "",
    headline: "",
    oneLiner: "",
    thumbnail: null,
    zonal: "",
  },
  fullContent: [],
};

const newsFormSlice = createSlice({
  name: "newsform",
  initialState,
  reducers: {
    setNewsData: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
        timeAndDate: new Date().toLocaleString(),
      };
    },
    addBox: (state, action) => {
      state.fullContent.push(action.payload);
    },
    updateBox: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.fullContent.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.fullContent[index] = {
          ...state.fullContent[index],
          ...updatedData,
        };
      }
    },
    removeBox: (state, action) => {
      state.fullContent = state.fullContent.filter(
        (b) => b.id !== action.payload
      );
    },
    resetNewsData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setNewsData, addBox, updateBox, removeBox, resetNewsData } =
  newsFormSlice.actions;

export default newsFormSlice.reducer;
