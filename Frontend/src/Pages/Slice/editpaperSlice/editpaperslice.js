import { createSlice } from "@reduxjs/toolkit";
import { pageReducers } from "./reducers/pagereducers";
import { containerReducers } from "./reducers/containerreducers";
import { slotReducers } from "./reducers/slotreducers";
import { sliderReducers } from "./reducers/sliderreducers";
import { nestedReducers } from "./reducers/nestedreducers";
import { lineReducers } from "./reducers/linereducers";
import { syncReducers } from "./reducers/syncreducers";
import { presetReducers } from "./reducers/presetreducers";
import { pollReducers } from "./reducers/pollreducers";
import { videoReducers } from "./reducers/videoreducers";

/* ---------- initial state ---------- */
const initialState = {
  hydrated: false,
  activePage: "main",
  activeLineId: null,
  presetContainers: [], // Array to store saved preset containers
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
    setLayoutHydrated: (state) => {
      state.hydrated = true;
    },
    setLayoutState: (state, action) => {
      const { pages, presetContainers, activePage, activeLineId } = action.payload || {};

      if (Array.isArray(pages)) state.pages = pages;
      if (Array.isArray(presetContainers)) state.presetContainers = presetContainers;
      if (typeof activePage === "string" && activePage.length > 0) {
        state.activePage = activePage;
      }
      if (activeLineId !== undefined) {
        state.activeLineId = activeLineId;
      }
      state.hydrated = true;
    },
    ...pageReducers,
    ...containerReducers,
    ...slotReducers,
    ...sliderReducers,
    ...nestedReducers,
    ...lineReducers,
    ...syncReducers,
    ...presetReducers,
      ...pollReducers,
    ...videoReducers,
  }
});

/* ---------- exports ---------- */
export const {
  setLayoutHydrated,
  setLayoutState,
  // Page actions
  addPage,
  setActivePage,
  updatePageSettings,
  deletePage,

  // Container actions
  addContainer,
  updateContainerGrid,
  updateContainerDimensions,
  updateContainerSpacing,
  deleteContainer,
  updateContainerHeader,

  // Slot actions
  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot,
  removeSlotFromContainer,
  toggleContainerSeparator,
  updateSlotShfval,
  updateSlotDimensions,

  // Slider actions
  addSliderToContainer,
  updateSliderWidth,
  updateContainerSliderGap,
  updateContainerSliderDimensions,
  deleteContainerSlider,
  addSlotToContainerSlider,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  removeSlotFromContainerSlider,
  toggleSliderSeparator,
  updateSliderShfval,
  updateSliderSlotShfval,
  updateContainerSliderHeader,
  updateContainerSliderPadding,
  updateSliderSlotDimensions,


  // Nested container actions
  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerDimensions,
  updateNestedContainerHeader,
  updateNestedContainerSpacing,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  removeSlotFromNestedContainer,
  toggleNestedSeparator,
  updateNestedSlotShfval,
  updateNestedSlotDimensions,

  // Line actions
  addLine,
  updateLinePosition,
  updateLineLength,
  updateLineArguments,
  deleteLine,
  setActiveLine,

  // Sync actions
  syncPagesFromAdmin,
    // Poll actions
  addPollSlot,
  updatePollData,
  removePollFromSlot,
  removePollFromNestedSlot,

  // Preset actions
  addPresetContainer,
  deletePresetContainer,
  updatePresetContainer,

  // Video actions
  addVideoSlot,
  addVideoSlotToSlider,
  updateVideoData,
  updateVideoDimensions,
  removeVideoFromSlot
} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;
