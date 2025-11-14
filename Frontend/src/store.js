import { configureStore } from "@reduxjs/toolkit";
import newsformReducer from "./Pages/Slice/newsformslice.js"

const loadState = () => {
  try {
    const serialized = localStorage.getItem("news-data");
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state.newsform);
    localStorage.setItem("news-data", serialized);
  } catch {}
};

const preloadedState = {
  newsform: loadState() || undefined
};

const store = configureStore({
  reducer: {
    newsform: newsformReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
