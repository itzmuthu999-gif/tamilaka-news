import { configureStore } from "@reduxjs/toolkit";
import newsformReducer from "./Pages/Slice/newsformslice.js";
import editpaperReducer from "./Pages/Slice/editpaperSlice/editpaperslice.js";
import adminReducer from "./Pages/Slice/adminSlice.js";
import userReducer from "./Pages/Slice/userSlice.js";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("redux-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("redux-state", serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    newsform: newsformReducer,
    editpaper: editpaperReducer,
    admin: adminReducer,
    users: userReducer
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;