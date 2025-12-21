import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MLayout: 1,
  allNews: [],      // multiple saved news
  trash: [],        // deleted news
  currentNews: null,
  language: "ta", 
  translatedNews: [] // news being edited (full object)
};

const newsFormSlice = createSlice({
  name: "newsform",
  initialState,
  reducers: {
    // Create a new news item
    saveNews: (state, action) => {
      const news = {
        id: Date.now(),
        ...action.payload,
        time: new Date().toLocaleString(),
      };
      state.allNews.push(news);
    },

    // Set current news to be edited/viewed
    setCurrentNews: (state, action) => {
      state.currentNews = action.payload;
    },
    setLayout: (state, action) => {
  state.MLayout = action.payload; // payload is 1 or 2
},

    // Update an existing news item (in-place)
    updateNews: (state, action) => {
      const { id, updatedNews } = action.payload;
      const index = state.allNews.findIndex(n => n.id === id);
      if (index !== -1) {
        state.allNews[index] = { ...state.allNews[index], ...updatedNews };
      }
      // if currentNews is the same id, update it too
      if (state.currentNews && state.currentNews.id === id) {
        state.currentNews = { ...state.currentNews, ...updatedNews };
      }
    },

    // Move to trash
    deleteNews: (state, action) => {
      const id = action.payload;
      const news = state.allNews.find(n => n.id === id);
      if (news) {
        state.trash.push(news);
      }
      state.allNews = state.allNews.filter(n => n.id !== id);
      if (state.currentNews && state.currentNews.id === id) {
        state.currentNews = null;
      }
    },

    // Restore from trash
    restoreNews: (state, action) => {
      const id = action.payload;
      const restored = state.trash.find(n => n.id === id);
      if (restored) {
        state.allNews.push(restored);
      }
      state.trash = state.trash.filter(n => n.id !== id);
    },

    // Permanently delete
    permanentDelete: (state, action) => {
      const id = action.payload;
      state.trash = state.trash.filter(n => n.id !== id);
    },
    setLanguage: (state, action) => {
  state.language = action.payload; // "ta" or "en"
},

setTranslatedNews: (state, action) => {
  state.translatedNews = action.payload;
}

  },
});

export const {
  saveNews,
  updateNews,
  deleteNews,
  restoreNews,
  permanentDelete,
  setCurrentNews,
  setLayout, 
    setLanguage,          // 👈 ADD
  setTranslatedNews 
} = newsFormSlice.actions;

export default newsFormSlice.reducer;

