import { createSlice } from "@reduxjs/toolkit";
import { pageReducers } from "./reducers/pageReducers";
import { containerReducers } from "./reducers/containerReducers";
import { slotReducers } from "./reducers/slotReducers";
import { sliderReducers } from "./reducers/sliderReducers";
import { nestedReducers } from "./reducers/nestedReducers";
import { lineReducers } from "./reducers/lineReducers";
import { syncReducers } from "./reducers/syncReducers";

/* ---------- initial state ---------- */
const initialState = {
  activePage: "main",
  activeLineId: null,
  pages: [
    {
      catName: "main",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "politics",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "cinema",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "business",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "world",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "india",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "tamil nadu",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "news",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "sports",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "trending",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "chennai",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "coimbatore",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "madurai",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "tiruchirappalli",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "salem",
      settings: {
        height: 600,
        gridColumns: 12,
        gap: 10,
        padding: 20
      },
      containers: [],
      sliders: [],
      lines: []
    },
    {
      catName: "tirunelveli",
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
  ]
};

const pageLayoutSlice = createSlice({
  name: "pageLayout",
  initialState,
  reducers: {
    ...pageReducers,
    ...containerReducers,
    ...slotReducers,
    ...sliderReducers,
    ...nestedReducers,
    ...lineReducers,
    ...syncReducers
  }
});

/* ---------- exports ---------- */
export const {
  // Page actions
  addPage,
  setActivePage,
  updatePageSettings,
  deletePage,

  // Container actions
  addContainer,
  updateContainerGrid,
  deleteContainer,
  updateContainerHeader,
  updateContainerSpacing,

  // Slot actions
  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot,
  removeSlotFromContainer,
  toggleContainerSeparator,

  // Slider actions
  addSliderToContainer,
  updateSliderWidth,
  updateContainerSliderGap,
  deleteContainerSlider,
  addSlotToContainerSlider,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  removeSlotFromContainerSlider,
  toggleSliderSeparator,
  updateContainerSliderHeader,
  updateContainerSliderPadding,

  // Nested container actions
  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerHeader,
  updateNestedContainerSpacing,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  removeSlotFromNestedContainer,
  toggleNestedSeparator,

  // Line actions
  addLine,
  updateLinePosition,
  updateLineLength,
  updateLineArguments,
  deleteLine,
  setActiveLine,

  // Sync actions
  syncPagesFromAdmin
} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;
