import { configureStore } from '@reduxjs/toolkit';
import  formreducer from './Pages/Slice/newsformslice.js'

export const store = configureStore({
  reducer: {
    formslice: formreducer
  }
});
