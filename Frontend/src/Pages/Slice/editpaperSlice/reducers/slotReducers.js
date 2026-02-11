import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const slotReducers = {
  addEmptySlot(state, action) {
    const { catName, containerId, containerType, slotId, presetId } = action.payload;
    const cont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId);

    if (cont) {
      // Find preset dimensions if presetId is provided
      let presetDimensions = null;
      if (presetId) {
        const preset = state.presetContainers.find(p => p.id === presetId);
        if (preset) {
          presetDimensions = preset.dimensions;
        }
      }

      // Default dimensions
      const defaultDimensions = {
        containerWidth: 800,
        containerHeight: 300,
        imgWidth: 750,
        imgHeight: 300,
        padding: 8
      };

      cont.items.push({
        slotId: slotId || nanoid(),
        newsId: null,
        containerType,
        showSeparator: false,
        shfval: 1,
        // Add dimensions for Universal Container at slot level
        ...(containerType === "Universal Container" && {
          dimensions: presetDimensions || defaultDimensions
        })
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

  removeSlotFromContainer(state, action) {
    const { catName, containerId, slotId } = action.payload;
    const container = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId);

    if (container) {
      container.items = container.items.filter(i => i.slotId !== slotId);
    }
    logState(state, "removeSlotFromContainer");
  },

  toggleContainerSeparator(state, action) {
    const { catName, containerId, slotId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.showSeparator = !slot.showSeparator;
    }
    logState(state, "toggleContainerSeparator");
  },

  updateSlotShfval(state, action) {
    const { catName, containerId, slotId, shfval } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.shfval = shfval;
    }
    logState(state, "updateSlotShfval");
  },

  // FIXED: Better error handling and logging for slot-level dimensions
  updateSlotDimensions(state, action) {
    const { catName, containerId, slotId, containerWidth, containerHeight, imgWidth, imgHeight, padding } = action.payload;
    
    console.log('🔧 updateSlotDimensions called with:', {
      catName,
      containerId,
      slotId,
      containerWidth,
      containerHeight,
      imgWidth,
      imgHeight,
      padding
    });
    
    const page = state.pages.find(p => p.catName === catName);
    if (!page) {
      console.error('❌ Page not found:', catName);
      return;
    }
    
    const container = page.containers.find(c => c.id === containerId);
    if (!container) {
      console.error('❌ Container not found:', containerId);
      return;
    }
    
    const slot = container.items.find(i => i.slotId === slotId);
    if (!slot) {
      console.error('❌ Slot not found:', slotId);
      return;
    }

    // Initialize dimensions if they don't exist
    if (!slot.dimensions) {
      slot.dimensions = { 
        containerWidth: 800, 
        containerHeight: 300, 
        imgWidth: 750, 
        imgHeight: 300, 
        padding: 8 
      };
      console.log(' Initialized dimensions for slot:', slotId);
    }
    
    // Update each dimension if provided
    if (containerWidth !== undefined) {
      slot.dimensions.containerWidth = containerWidth;
      console.log(' Updated containerWidth:', containerWidth);
    }
    if (containerHeight !== undefined) {
      slot.dimensions.containerHeight = containerHeight;
      console.log('Updated containerHeight:', containerHeight);
    }
    if (imgWidth !== undefined) {
      slot.dimensions.imgWidth = imgWidth;
      console.log(' Updated imgWidth:', imgWidth);
    }
    if (imgHeight !== undefined) {
      slot.dimensions.imgHeight = imgHeight;
      console.log('Updated imgHeight:', imgHeight);
    }
    if (padding !== undefined) {
      slot.dimensions.padding = padding;
      console.log(' Updated padding:', padding);
    }
    
    console.log(' Final slot.dimensions:', slot.dimensions);
    logState(state, "updateSlotDimensions");
  }
};