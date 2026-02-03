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
        comments: [],
        containers: [] // Changed from contentContainers to containers
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
    },

    // ==================== CONTAINER OVERLAY ACTIONS ====================
    
    addContainer: (state, action) => {
      const { newsId } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1) {
        if (!state.allNews[newsIndex].containers) {
          state.allNews[newsIndex].containers = [];
        }
        
        const newContainer = {
          id: Date.now(),
          columns: 2,
          gap: 10,
          padding: 20,
          boxes: []
        };
        
        state.allNews[newsIndex].containers.push(newContainer);
        
        if (state.currentNews && state.currentNews.id === newsId) {
          if (!state.currentNews.containers) {
            state.currentNews.containers = [];
          }
          state.currentNews.containers.push(newContainer);
        }
      }
    },

    deleteContainer: (state, action) => {
      const { newsId, containerId } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1 && state.allNews[newsIndex].containers) {
        state.allNews[newsIndex].containers = state.allNews[newsIndex].containers.filter(
          c => c.id !== containerId
        );
        
        if (state.currentNews && state.currentNews.id === newsId) {
          state.currentNews.containers = state.allNews[newsIndex].containers;
        }
      }
    },

    updateContainerSettings: (state, action) => {
      const { newsId, containerId, settings } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1 && state.allNews[newsIndex].containers) {
        const containerIndex = state.allNews[newsIndex].containers.findIndex(
          c => c.id === containerId
        );
        
        if (containerIndex !== -1) {
          state.allNews[newsIndex].containers[containerIndex] = {
            ...state.allNews[newsIndex].containers[containerIndex],
            ...settings
          };
          
          if (state.currentNews && state.currentNews.id === newsId) {
            state.currentNews.containers = state.allNews[newsIndex].containers;
          }
        }
      }
    },

    addBoxToContainer: (state, action) => {
      const { newsId, containerId, box } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1 && state.allNews[newsIndex].containers) {
        const container = state.allNews[newsIndex].containers.find(c => c.id === containerId);
        if (container) {
          container.boxes.push(box);
          
          if (state.currentNews && state.currentNews.id === newsId) {
            state.currentNews.containers = state.allNews[newsIndex].containers;
          }
        }
      }
    },

    removeBoxFromContainer: (state, action) => {
      const { newsId, containerId, boxId } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1 && state.allNews[newsIndex].containers) {
        const container = state.allNews[newsIndex].containers.find(c => c.id === containerId);
        if (container) {
          container.boxes = container.boxes.filter(b => b.id !== boxId);
          
          if (state.currentNews && state.currentNews.id === newsId) {
            state.currentNews.containers = state.allNews[newsIndex].containers;
          }
        }
      }
    },

    updateBoxInContainer: (state, action) => {
      const { newsId, containerId, boxId, updates } = action.payload;
      
      const newsIndex = state.allNews.findIndex(n => n.id === newsId);
      
      if (newsIndex !== -1 && state.allNews[newsIndex].containers) {
        const container = state.allNews[newsIndex].containers.find(c => c.id === containerId);
        if (container) {
          const box = container.boxes.find(b => b.id === boxId);
          if (box) {
            Object.assign(box, updates);
            
            if (state.currentNews && state.currentNews.id === newsId) {
              state.currentNews.containers = state.allNews[newsIndex].containers;
            }
          }
        }
      }
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
  addComment,
  deleteComment,
  addContainer,
  
  deleteContainer,
  updateContainerSettings,
  addBoxToContainer,
  removeBoxFromContainer,
  updateBoxInContainer
} = newsFormSlice.actions;

export default newsFormSlice.reducer;