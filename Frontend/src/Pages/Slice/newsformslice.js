import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MLayout: 1,
  allNews: [],
  trash: [],
  currentNews: null,
  language: "ta",
  translatedNews: []
};

const newsFormSlice = createSlice({
  name: "newsform",
  initialState,
  reducers: {
    saveNews: (state, action) => {
      const news = {
        id: Date.now(),
        ...action.payload,
        time: new Date().toLocaleString(),
        comments: [] // Initialize empty comments array
      };
      state.allNews.push(news);
    },

    setCurrentNews: (state, action) => {
      state.currentNews = action.payload;
    },

    setLayout: (state, action) => {
      state.MLayout = action.payload;
    },

    updateNews: (state, action) => {
      const { id, updatedNews } = action.payload;
      const index = state.allNews.findIndex(n => n.id === id);
      if (index !== -1) {
        state.allNews[index] = { ...state.allNews[index], ...updatedNews };
      }
      if (state.currentNews && state.currentNews.id === id) {
        state.currentNews = { ...state.currentNews, ...updatedNews };
      }
    },

    // NEW: Add comment to specific news
    addComment: (state, action) => {
      const { newsId, comment } = action.payload;
      const news = state.allNews.find(n => n.id === newsId);
      if (news) {
        if (!news.comments) {
          news.comments = [];
        }
        news.comments.push({
          id: Date.now(),
          name: comment.name,
          text: comment.text,
          timestamp: new Date().toLocaleString()
        });
      }
    },

    // NEW: Delete comment from specific news
    deleteComment: (state, action) => {
      const { newsId, commentId } = action.payload;
      const news = state.allNews.find(n => n.id === newsId);
      if (news && news.comments) {
        news.comments = news.comments.filter(c => c.id !== commentId);
      }
    },

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

    restoreNews: (state, action) => {
      const id = action.payload;
      const restored = state.trash.find(n => n.id === id);
      if (restored) {
        state.allNews.push(restored);
      }
      state.trash = state.trash.filter(n => n.id !== id);
    },

    permanentDelete: (state, action) => {
      const id = action.payload;
      state.trash = state.trash.filter(n => n.id !== id);
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
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
  setLanguage,
  setTranslatedNews,
  addComment,      // NEW
  deleteComment    // NEW
} = newsFormSlice.actions;

export default newsFormSlice.reducer;