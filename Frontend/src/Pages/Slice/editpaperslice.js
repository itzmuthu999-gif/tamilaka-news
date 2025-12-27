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
      containers: [],
      sliders: [],
      lines: [] // ✅ NEW: Lines array
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
            containers: [],
            sliders: [],
            lines: []
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

      if (state.activePage === catName) {
        state.activePage = state.pages[0]?.catName || null;
      }

      logState(state, "deletePage");
    },

    /* -------------------- CONTAINERS -------------------- */

    addContainer: {
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
              position,
              grid: {
                columns: 2,
                gap: 10
              },
              items: [],
              header: {
                enabled: false,
                title: ""
              }
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
    },

    updateContainerHeader(state, action) {
      const { catName, containerId, enabled, title } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        if (enabled !== undefined) cont.header.enabled = enabled;
        if (title !== undefined) cont.header.title = title;
      }
      logState(state, "updateContainerHeader");
    },

    addItemToContainer(state, action) {
      const { catName, containerId, item } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) cont.items.push(item);
    },

    /* -------------------- NEWS SLOTS -------------------- */

    addEmptySlot(state, action) {
      const { catName, containerId, containerType, slotId } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.items.push({
          slotId: slotId || nanoid(),
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
    },

    /* -------------------- SLIDERS (UNIFIED - Type 1 & Type 2) -------------------- */

    addSlider: {
      reducer(state, action) {
        const { catName, slider } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.sliders.push(slider);
        logState(state, "addSlider");
      },
      prepare(catName, position, sliderType = "type1") {
        return {
          payload: {
            catName,
            slider: {
              id: nanoid(),
              type: sliderType,
              position,
              gap: 10,
              items: [],
              lockedType: null
            }
          }
        };
      }
    },

    updateSliderPosition(state, action) {
      const { catName, sliderId, position } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.position = position;
      logState(state, "updateSliderPosition");
    },

    updateSliderSize(state, action) {
      const { catName, sliderId, size } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.size = size;
      logState(state, "updateSliderSize");
    },

    updateSliderGap(state, action) {
      const { catName, sliderId, gap } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.gap = gap;
      logState(state, "updateSliderGap");
    },

    deleteSlider(state, action) {
      const { catName, sliderId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.sliders = page.sliders.filter(s => s.id !== sliderId);
      }
      logState(state, "deleteSlider");
    },

    addSlotToSlider(state, action) {
      const { catName, sliderId, containerType, slotId } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) {
        if (slider.items.length === 0) {
          slider.lockedType = containerType;
        }

        slider.items.push({
          slotId: slotId || nanoid(),
          newsId: null,
          containerType
        });
      }
      logState(state, "addSlotToSlider");
    },

    dropNewsIntoSliderSlot(state, action) {
      const { catName, sliderId, slotId, newsId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = newsId;
      logState(state, "dropNewsIntoSliderSlot");
    },

    removeNewsFromSliderSlot(state, action) {
      const { catName, sliderId, slotId } = action.payload;
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) slot.newsId = null;
      logState(state, "removeNewsFromSliderSlot");
    },

    removeSlotFromSlider(state, action) {
      const { catName, sliderId, slotId } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) {
        slider.items = slider.items.filter(i => i.slotId !== slotId);
        
        if (slider.items.length === 0) {
          slider.lockedType = null;
        }
      }
      logState(state, "removeSlotFromSlider");
    },

    /* -------------------- LINES -------------------- */

    addLine: {
      reducer(state, action) {
        const { catName, line } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.lines.push(line);
        logState(state, "addLine");
      },
      prepare(catName, lineType, orientation, position) {
        return {
          payload: {
            catName,
            line: {
              id: nanoid(),
              lineType, // "pink-bold" or "light-grey"
              orientation, // "horizontal" or "vertical"
              length: orientation === "horizontal" ? 500 : 300,
              x: position?.x ?? 100,
              y: position?.y ?? 100
            }
          }
        };
      }
    },

    updateLinePosition(state, action) {
      const { catName, lineId, x, y } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) {
        if (x !== undefined) line.x = x;
        if (y !== undefined) line.y = y;
      }
      logState(state, "updateLinePosition");
    },

    updateLineLength(state, action) {
      const { catName, lineId, length } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) line.length = length;
      logState(state, "updateLineLength");
    },

    updateLineArguments(state, action) {
      const { catName, lineId, length, x, y } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) {
        if (length !== undefined) line.length = length;
        if (x !== undefined) line.x = x;
        if (y !== undefined) line.y = y;
      }
      logState(state, "updateLineArguments");
    },

    deleteLine(state, action) {
      const { catName, lineId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.lines = page.lines.filter(l => l.id !== lineId);
      }
      logState(state, "deleteLine");
    },

    setActiveLine(state, action) {
      const { lineId } = action.payload;
      state.activeLineId = lineId;
      logState(state, "setActiveLine");
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
  updateContainerHeader,

  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot,

  addSlider,
  updateSliderPosition,
  updateSliderSize,
  updateSliderGap,
  deleteSlider,
  addSlotToSlider,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  removeSlotFromSlider,

  // ✅ LINE ACTIONS
  addLine,
  updateLinePosition,
  updateLineLength,
  updateLineArguments,
  deleteLine,
  setActiveLine
} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;