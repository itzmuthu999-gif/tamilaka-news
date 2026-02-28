import { configureStore } from "@reduxjs/toolkit";
import newsformReducer from "./Pages/Slice/newsformSlice.js";
import editpaperReducer from "./Pages/Slice/editpaperSlice/editpaperSlice.js";
import adminReducer from "./Pages/Slice/adminSlice.js";
import userReducer from "./Pages/Slice/userSlice.js";
import newspageReducer from "./Pages/Slice/newspageSlice.js";

const store = configureStore({
  reducer: {
    newsform: newsformReducer,
    editpaper: editpaperReducer,
    admin: adminReducer,
    users: userReducer,
    newspage: newspageReducer
  }
});

export default store;
