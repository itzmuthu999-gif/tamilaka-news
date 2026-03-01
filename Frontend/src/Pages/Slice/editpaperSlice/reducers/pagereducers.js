import { logState } from "../utils/sliceHelpers";

export const pageReducers = {
  addPage: {
    reducer(state, action) {
      state.pages.push(action.payload);
      logState(state, "addPage");
    },
    prepare(catName) {
      return {
        payload: {
          catName,
          settings: {
            height: 600,
            gridColumns: 12,
            gap: 10,
            padding: 20
          },
          containers: [],
          sliders: [],
          lines: []
        }
      };
    }
  },

  setActivePage(state, action) {
    const newActivePage = action.payload;
    state.activePage = newActivePage;
    
    // Create page if it doesn't exist
    const existingPage = state.pages.find(p => p.catName === newActivePage);
    if (!existingPage) {
      state.pages.push({
        catName: newActivePage,
        settings: {
          height: 600,
          gridColumns: 12,
          gap: 10,
          padding: 20
        },
        containers: [],
        sliders: [],
        lines: []
      });
    }
    
    logState(state, "setActivePage");
  },

  updatePageSettings(state, action) {
    const { catName, settings } = action.payload;
    const page = state.pages.find(p => p.catName === catName);
    if (page) {
      page.settings = { ...page.settings, ...settings };
    }
    logState(state, "updatePageSettings");
  },

  deletePage(state, action) {
    const catName = action.payload;
    state.pages = state.pages.filter(p => p.catName !== catName);

    if (state.activePage === catName) {
      state.activePage = state.pages[0]?.catName || null;
    }

    logState(state, "deletePage");
  }
};
