import { createSlice, nanoid } from "@reduxjs/toolkit";

/* ---------- helper logger ---------- */
const logState = (state, actionName) => {
  console.log(`📦 PAGE LAYOUT UPDATED → ${actionName}`);
  console.log(JSON.parse(JSON.stringify(state)));
};

/* ---------- initial state ---------- */
const initialState = {
  activePage: "main",
  pages: [
    {
      catName: "main",
      height: 600,
      containers: []
    }
  ]
};

const pageLayoutSlice = createSlice({
  name: "pageLayout",
  initialState,
  reducers: {

    /* -------------------- PAGES -------------------- */

    addPage: {
      reducer(state, action) {
        state.pages.push(action.payload);
        logState(state, "addPage");
      },
      prepare(catName) {
        return {
          payload: {
            catName,
            height: 600,
            containers: []
          }
        };
      }
    },

    setActivePage(state, action) {
      state.activePage = action.payload;
      logState(state, "setActivePage");
    },

    setPageHeight(state, action) {
      const { catName, height } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) page.height = height;
      logState(state, "setPageHeight");
    },
    deletePage(state, action) {
      const catName = action.payload;
      state.pages = state.pages.filter(p => p.catName !== catName);

      // Safety: reset activePage
      if (state.activePage === catName) {
        state.activePage = state.pages[0]?.catName || null;
      }

      logState(state, "deletePage");
    }
    ,

    /* -------------------- CONTAINERS -------------------- */

    addContainer:
    {
      reducer(state, action) {
        const { catName, container } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.containers.push(container);
        logState(state, "addContainer");
      },
      prepare(catName, position) {
        return {
          payload: {
            catName,
            container: {
              id: nanoid(),
              position, // { x, y }
              grid: {
                columns: 2,
                gap: 10
              },
              items: []
            }
          }
        };
      }
    },

    updateContainerPosition(state, action) {
      const { catName, containerId, position } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) cont.position = position;
      logState(state, "updateContainerPosition");
    },

    updateContainerGrid(state, action) {
      const { catName, containerId, columns, gap } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.grid.columns = columns;
        cont.grid.gap = gap;
      }
      logState(state, "updateContainerGrid");
    },

    deleteContainer(state, action) {
      const { catName, containerId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.containers = page.containers.filter(c => c.id !== containerId);
      }
      logState(state, "deleteContainer");
    },
    updateContainerSize(state, action) {
      const { catName, containerId, size } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) cont.size = size;
    }
    ,
    addItemToContainer(state, action) {
      const { catName, containerId, item } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) cont.items.push(item);
    }
    ,

    /* -------------------- NEWS SLOTS -------------------- */

    addEmptySlot(state, action) {
      const { catName, containerId, containerType, slotId } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.items.push({
          slotId: slotId || nanoid(), // ✅ Use provided slotId if available
          newsId: null,
          containerType
        });
      }
      logState(state, "addEmptySlot");
    },

    dropNewsIntoSlot(state, action) {
      const { catName, containerId, slotId, newsId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = newsId;
      logState(state, "dropNewsIntoSlot");
    },

    removeNewsFromSlot(state, action) {
      const { catName, containerId, slotId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = null;
      logState(state, "removeNewsFromSlot");
    }
  }
});

/* ---------- exports ---------- */
export const {
  addPage,
  setActivePage,
  setPageHeight,
  deletePage,

  addContainer,
  updateContainerPosition,
  updateContainerGrid,
  deleteContainer,
  updateContainerSize,

  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot
} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;
