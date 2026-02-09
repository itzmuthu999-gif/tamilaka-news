import { configureStore } from "@reduxjs/toolkit";
import newsformReducer from "./Pages/Slice/newsformslice.js";
import editpaperReducer from "./Pages/Slice/editpaperSlice/editpaperslice.js";
import adminReducer from "./Pages/Slice/adminSlice.js";
import userReducer from "./Pages/Slice/userSlice.js";

const loadState = () => {
  try {
    const newsData = localStorage.getItem("news-data");
    const usersData = localStorage.getItem("users-data");
    
    return {
      newsform: newsData ? JSON.parse(newsData) : undefined,
      users: usersData ? JSON.parse(usersData) : undefined
    };
  } catch (err) {
    return {
      newsform: undefined,
      users: undefined
    };
  }
};

const saveState = (state) => {
  try {
    if (state.newsform) {
      const newsSerialized = JSON.stringify(state.newsform);
      localStorage.setItem("news-data", newsSerialized);
    }
    if (state.users) {
      const usersSerialized = JSON.stringify(state.users);
      localStorage.setItem("users-data", usersSerialized);
    }
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