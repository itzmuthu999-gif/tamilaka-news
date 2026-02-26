import { createSlice, nanoid } from "@reduxjs/toolkit";

// ---------- COMPREHENSIVE HELPER FUNCTIONS ----------

/**
 * Updates ALL page positions based on current navigation state
 * This ensures positions are ALWAYS in sync with the UI
 */
const updateAllPagePositions = (state) => {
  // Reset all positions first
  state.allPages.forEach(page => {
    page.topnavpos = null;
    page.sidenavpos = null;
  });

  // Update topnavpos based on topNavHeaders1
  // Position depends on dropdown placement
  state.topNavHeaders1.forEach((pageId, index) => {
    const page = state.allPages.find(p => p.id === pageId);
    if (page) {
      // If dropdown is before this item, add 1 to position
      const actualPosition = index < state.dropdownPosition1 ? index : index + 1;
      page.topnavpos = actualPosition; // 0-indexed position
    }
  });

  // Update sidenavpos based on topNavHeaders2
  state.topNavHeaders2.forEach((pageId, index) => {
    const page = state.allPages.find(p => p.id === pageId);
    if (page) {
      // If dropdown is before this item, add 1 to position
      const actualPosition = index < state.dropdownPosition2 ? index : index + 1;
      page.sidenavpos = actualPosition; // 0-indexed position
    }
  });
};

/**
 * Validates dropdown position after navigation changes
 */
const validateDropdownPosition = (state, navNumber) => {
  if (navNumber === 1) {
    if (state.dropdownPosition1 > state.topNavHeaders1.length) {
      state.dropdownPosition1 = state.topNavHeaders1.length;
    }
  } else {
    if (state.dropdownPosition2 > state.topNavHeaders2.length) {
      state.dropdownPosition2 = state.topNavHeaders2.length;
    }
  }
};

/**
 * Removes page from all navigations and cleans up
 */
const removePageFromNavigations = (state, pageId) => {
  // Remove from nav 1
  const nav1Index = state.topNavHeaders1.indexOf(pageId);
  if (nav1Index !== -1) {
    state.topNavHeaders1.splice(nav1Index, 1);
    validateDropdownPosition(state, 1);
  }

  // Remove from nav 2
  const nav2Index = state.topNavHeaders2.indexOf(pageId);
  if (nav2Index !== -1) {
    state.topNavHeaders2.splice(nav2Index, 1);
    validateDropdownPosition(state, 2);
  }
};

// ---------- INITIAL STATE ----------
const initialState = {
  allPages: [
    {
      id: nanoid(),
      name: { tam: "வரத்தகம்", eng: "Business" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "சினிமா", eng: "Cinema" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "உலகம்", eng: "World" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "இந்தியா", eng: "India" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "தமிழகம்", eng: "Tamil Nadu" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "நியூஸ்", eng: "News" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "அரசியல்", eng: "Politics" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "விளையாட்டு", eng: "Sports" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "ட்ரெண்டிங்", eng: "Trending" },
      topnavpos: null,
      sidenavpos: null
    },
    {
      id: nanoid(),
      name: { tam: "மாவட்டம்", eng: "Select District" },
      districts: [
        { tam: "சென்னை", eng: "Chennai" },
        { tam: "கோயம்புத்தூர்", eng: "Coimbatore" },
        { tam: "மதுரை", eng: "Madurai" },
        { tam: "திருச்சிராப்பள்ளி", eng: "Tiruchirappalli" },
        { tam: "சேலம்", eng: "Salem" },
        { tam: "திருநெல்வேலி", eng: "Tirunelveli" }
      ],
      topnavpos: null,
      sidenavpos: null
    }
  ],
  topNavHeaders1: [],
  topNavHeaders2: [],
  dropdownPosition1: 0,
  dropdownPosition2: 0,
  selectedDistrict1: "",
  selectedDistrict2: ""
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // -------------------- PAGE MANAGEMENT --------------------
    addPage: (state, action) => {
      const newPage = {
        id: nanoid(),
        name: {
          tam: action.payload.tam,
          eng: action.payload.eng
        },
        topnavpos: null,
        sidenavpos: null
      };

      // Insert before the last item (district selector)
      state.allPages.splice(state.allPages.length - 1, 0, newPage);

      // Update all positions (in case this affects anything)
      updateAllPagePositions(state);
    },

    updatePage: (state, action) => {
      const { id, tam, eng } = action.payload;
      const page = state.allPages.find(p => p.id === id);
      if (page) {
        page.name = { tam, eng };
        // Name update doesn't affect positions, but keeping consistency
        updateAllPagePositions(state);
      }
    },

    deletePage: (state, action) => {
      const { id } = action.payload;
      const pageIndex = state.allPages.findIndex(p => p.id === id);

      if (pageIndex !== -1) {
        // Remove from all navigations
        removePageFromNavigations(state, id);

        // Remove page
        state.allPages.splice(pageIndex, 1);

        // Update all positions after deletion
        updateAllPagePositions(state);
      }
    },

    // -------------------- DISTRICT MANAGEMENT --------------------
    addDistrict: (state, action) => {
      const { tam, eng } = action.payload;
      const districtPage = state.allPages[state.allPages.length - 1];

      if (districtPage && districtPage.districts) {
        districtPage.districts.push({ tam, eng });
      }
      // Districts don't affect page positions, no update needed
    },

    updateDistrict: (state, action) => {
      const { index, tam, eng } = action.payload;
      const districtPage = state.allPages[state.allPages.length - 1];

      if (districtPage && districtPage.districts && districtPage.districts[index]) {
        const oldDistrict = districtPage.districts[index];
        districtPage.districts[index] = { tam, eng };

        // Update selected districts if they were using the old values
        if (state.selectedDistrict1 === oldDistrict.tam || state.selectedDistrict1 === oldDistrict.eng) {
          state.selectedDistrict1 = tam; // Update to new Tamil name
        }
        if (state.selectedDistrict2 === oldDistrict.tam || state.selectedDistrict2 === oldDistrict.eng) {
          state.selectedDistrict2 = tam; // Update to new Tamil name
        }
      }
    },

    deleteDistrict: (state, action) => {
      const { index } = action.payload;
      const districtPage = state.allPages[state.allPages.length - 1];

      if (districtPage && districtPage.districts) {
        const deletedDistrict = districtPage.districts[index];

        // Clear selected districts if they match (check both languages)
        if (state.selectedDistrict1 === deletedDistrict.tam ||
          state.selectedDistrict1 === deletedDistrict.eng) {
          state.selectedDistrict1 = "";
        }
        if (state.selectedDistrict2 === deletedDistrict.tam ||
          state.selectedDistrict2 === deletedDistrict.eng) {
          state.selectedDistrict2 = "";
        }

        districtPage.districts.splice(index, 1);
      }
    },

    // -------------------- TOP NAV 1 MANAGEMENT --------------------
    addTopNavHeader1: (state, action) => {
      const { pageId } = action.payload;

      // Prevent duplicates
      if (!state.topNavHeaders1.includes(pageId)) {
        state.topNavHeaders1.push(pageId);

        // CRITICAL: Update all page positions after adding
        updateAllPagePositions(state);
      }
    },

    updateTopNavHeader1: (state, action) => {
      const { index, pageId } = action.payload;

      if (index >= 0 && index < state.topNavHeaders1.length) {
        state.topNavHeaders1[index] = pageId;

        // CRITICAL: Update all page positions after changing
        updateAllPagePositions(state);
      }
    },

    deleteTopNavHeader1: (state, action) => {
      const { index } = action.payload;

      if (index >= 0 && index < state.topNavHeaders1.length) {
        state.topNavHeaders1.splice(index, 1);

        // Validate dropdown position
        validateDropdownPosition(state, 1);

        // CRITICAL: Update all page positions after deletion
        updateAllPagePositions(state);
      }
    },

    reorderTopNavHeaders1: (state, action) => {
      const { sourceIndex, targetIndex } = action.payload;

      if (sourceIndex !== targetIndex &&
        sourceIndex >= 0 && sourceIndex < state.topNavHeaders1.length &&
        targetIndex >= 0 && targetIndex <= state.topNavHeaders1.length) {

        // Remove from source
        const [removed] = state.topNavHeaders1.splice(sourceIndex, 1);

        // Insert at target
        state.topNavHeaders1.splice(targetIndex, 0, removed);

        // CRITICAL: Update all page positions after reordering
        updateAllPagePositions(state);
      }
    },

    setDropdownPosition1: (state, action) => {
      const newPosition = action.payload;

      // Validate position
      if (newPosition >= 0 && newPosition <= state.topNavHeaders1.length) {
        state.dropdownPosition1 = newPosition;

        // CRITICAL: Dropdown position affects all page positions!
        updateAllPagePositions(state);
      }
    },

    setSelectedDistrict1: (state, action) => {
      state.selectedDistrict1 = action.payload;
      // Selected district doesn't affect positions
    },

    // -------------------- TOP NAV 2 MANAGEMENT --------------------
    addTopNavHeader2: (state, action) => {
      const { pageId } = action.payload;

      // Prevent duplicates
      if (!state.topNavHeaders2.includes(pageId)) {
        state.topNavHeaders2.push(pageId);

        // CRITICAL: Update all page positions after adding
        updateAllPagePositions(state);
      }
    },

    updateTopNavHeader2: (state, action) => {
      const { index, pageId } = action.payload;

      if (index >= 0 && index < state.topNavHeaders2.length) {
        state.topNavHeaders2[index] = pageId;

        // CRITICAL: Update all page positions after changing
        updateAllPagePositions(state);
      }
    },

    deleteTopNavHeader2: (state, action) => {
      const { index } = action.payload;

      if (index >= 0 && index < state.topNavHeaders2.length) {
        state.topNavHeaders2.splice(index, 1);

        // Validate dropdown position
        validateDropdownPosition(state, 2);

        // CRITICAL: Update all page positions after deletion
        updateAllPagePositions(state);
      }
    },

    reorderTopNavHeaders2: (state, action) => {
      const { sourceIndex, targetIndex } = action.payload;

      if (sourceIndex !== targetIndex &&
        sourceIndex >= 0 && sourceIndex < state.topNavHeaders2.length &&
        targetIndex >= 0 && targetIndex <= state.topNavHeaders2.length) {

        // Remove from source
        const [removed] = state.topNavHeaders2.splice(sourceIndex, 1);

        // Insert at target
        state.topNavHeaders2.splice(targetIndex, 0, removed);

        // CRITICAL: Update all page positions after reordering
        updateAllPagePositions(state);
      }
    },

    setDropdownPosition2: (state, action) => {
      const newPosition = action.payload;

      // Validate position
      if (newPosition >= 0 && newPosition <= state.topNavHeaders2.length) {
        state.dropdownPosition2 = newPosition;

        // CRITICAL: Dropdown position affects all page positions!
        updateAllPagePositions(state);
      }
    },

    setSelectedDistrict2: (state, action) => {
      state.selectedDistrict2 = action.payload;
      // Selected district doesn't affect positions
    },

    // -------------------- UTILITY ACTIONS --------------------

    /**
     * Manual position recalculation trigger
     * Useful for edge cases or after batch operations
     */
    recalculateAllPositions: (state) => {
      updateAllPagePositions(state);
    },

    /**
     * Reset navigation state (useful for testing/debugging)
     */
    resetNavigations: (state) => {
      state.topNavHeaders1 = [];
      state.topNavHeaders2 = [];
      state.dropdownPosition1 = 0;
      state.dropdownPosition2 = 0;
      state.selectedDistrict1 = "";
      state.selectedDistrict2 = "";
      updateAllPagePositions(state);
    }
  }
});

export const {
  addPage,
  updatePage,
  deletePage,
  addDistrict,
  updateDistrict,
  deleteDistrict,
  addTopNavHeader1,
  updateTopNavHeader1,
  deleteTopNavHeader1,
  reorderTopNavHeaders1,
  setDropdownPosition1,
  setSelectedDistrict1,
  addTopNavHeader2,
  updateTopNavHeader2,
  deleteTopNavHeader2,
  reorderTopNavHeaders2,
  setDropdownPosition2,
  setSelectedDistrict2,
  recalculateAllPositions,
  resetNavigations
} = adminSlice.actions;

export default adminSlice.reducer;