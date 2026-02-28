import { createSlice } from "@reduxjs/toolkit";

const resolveEnglishParagraph = (box) => {
  if (!box || box.type !== "paragraph") return box;
  const english = box.contentEn;
  if (english == null || english === "") return box;
  return { ...box, content: english };
};

const buildTranslatedNews = (allNews) => {
  if (!Array.isArray(allNews)) return [];
  return allNews.map((news) => {
    const baseData = news?.data || {};
    const enData = news?.dataEn || {};
    const data = { ...baseData, ...enData };

    const fullContent = Array.isArray(news?.fullContent)
      ? news.fullContent.map(resolveEnglishParagraph)
      : news?.fullContent;

    const containerOverlays = Array.isArray(news?.containerOverlays)
      ? news.containerOverlays.map((container) => {
          if (!container?.settings?.boxes) return container;
          return {
            ...container,
            settings: {
              ...container.settings,
              boxes: container.settings.boxes.map(resolveEnglishParagraph),
            },
          };
        })
      : news?.containerOverlays;

    return {
      ...news,
      data,
      fullContent,
      containerOverlays,
    };
  });
};

const syncTranslatedNews = (state) => {
  if (state.language !== "en") return;
  state.translatedNews = buildTranslatedNews(state.allNews);
};

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
    setAllNews: (state, action) => {
      state.allNews = Array.isArray(action.payload) ? action.payload : [];
      syncTranslatedNews(state);
    },

    saveNews: (state, action) => {
      console.log('saveNews action called with payload:', action.payload);
      console.log('Current state.allNews:', state.allNews);
      
      // Ensure allNews is initialized
      if (!state.allNews) {
        state.allNews = [];
      }
      
      const news = {
        id: Date.now(),
        ...action.payload,
        time: new Date().toISOString(),
        comments: [],
        containers: [] // Changed from contentContainers to containers
      };
      console.log('Created news object:', news);
      state.allNews.push(news);
      console.log('Updated allNews array:', state.allNews);
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
    },

    deleteComment: (state, action) => {
      const { newsId, commentId } = action.payload;
      const news = state.allNews.find(n => n.id === newsId);
      if (news && news.comments) {
        news.comments = news.comments.filter(c => c.id !== commentId);
      }
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
    },

    restoreNews: (state, action) => {
      const id = action.payload;
      const restored = state.trash.find(n => n.id === id);
      if (restored) {
        state.allNews.push(restored);
      }
      state.trash = state.trash.filter(n => n.id !== id);
      syncTranslatedNews(state);
    },

    permanentDelete: (state, action) => {
      const id = action.payload;
      state.trash = state.trash.filter(n => n.id !== id);
      syncTranslatedNews(state);
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
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
      syncTranslatedNews(state);
    }
  },
  
});

export const {
  setAllNews,
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
