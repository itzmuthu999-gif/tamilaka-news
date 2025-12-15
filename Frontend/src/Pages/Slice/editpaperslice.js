import { createSlice, nanoid } from "@reduxjs/toolkit";

/**
 * FINAL DATA MODEL (CLEAN)
 *
 * pages[] = [
 *   {
 *     catName,
 *     height,
 *     containers: [
 *       {
 *         id,
 *         position: { x, y },
 *         grid: { columns, gap },
 *         items: [
 *           { slotId, newsId: null, containerType }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 */

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


    addPage: {
      reducer(state, action) {
        state.pages.push(action.payload);
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
    },

    setPageHeight(state, action) {
      const { catName, height } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) page.height = height;
    },


    addContainer: {
      reducer(state, action) {
        const { catName, container } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.containers.push(container);
      },
      prepare(catName, position) {
        return {
          payload: {
            catName,
            container: {
              id: nanoid(),
              position,      // { x, y }
              grid: {
                columns: 2,
                gap: 10
              },
              items: []      // empty news slots
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
    },

    deleteContainer(state, action) {
      const { catName, containerId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.containers = page.containers.filter(c => c.id !== containerId);
      }
    },

    /* -------------------- NEWS SLOTS -------------------- */

    addEmptySlot(state, action) {
      const { catName, containerId, containerType } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.items.push({
          slotId: nanoid(),
          newsId: null,
          containerType
        });
      }
    },

    dropNewsIntoSlot(state, action) {
      const { catName, containerId, slotId, newsId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = newsId;
    },

    removeNewsFromSlot(state, action) {
      const { catName, containerId, slotId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = null;
    }
  }
});

export const {
  addPage,
  setActivePage,
  setPageHeight,

  addContainer,
  updateContainerPosition,
  updateContainerGrid,
  deleteContainer,

  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot
} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;
