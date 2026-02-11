import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const presetReducers = {
  // Initialize presetContainers (for backward compatibility)
  initializePresetContainers(state) {
    if (!state.presetContainers) {
      state.presetContainers = [];
    }
    logState(state, "initializePresetContainers");
  },

  // Add a new preset container
  addPresetContainer: {
    reducer(state, action) {
      const { preset } = action.payload;
      
      console.log('🎯 addPresetContainer called with:', preset);
      console.log('📊 Current state.presetContainers:', state.presetContainers);
      
      // Initialize presetContainers if it doesn't exist
      if (!state.presetContainers) {
        console.log('⚠️ presetContainers was undefined, initializing...');
        state.presetContainers = [];
      }
      
      state.presetContainers.push(preset);
      console.log('✅ Preset added. New presetContainers:', state.presetContainers);
      logState(state, "addPresetContainer");
    },
    prepare(presetName, dimensions) {
      return {
        payload: {
          preset: {
            id: nanoid(),
            presetName,
            dimensions: {
              containerWidth: dimensions.containerWidth || 800,
              containerHeight: dimensions.containerHeight || 300,
              imgWidth: dimensions.imgWidth || 750,
              imgHeight: dimensions.imgHeight || 300,
              padding: dimensions.padding || 8
            }
          }
        }
      };
    }
  },

  // Delete a preset container
  deletePresetContainer(state, action) {
    const { presetId } = action.payload;
    
    // Initialize presetContainers if it doesn't exist
    if (!state.presetContainers) {
      state.presetContainers = [];
      return;
    }
    
    state.presetContainers = state.presetContainers.filter(
      preset => preset.id !== presetId
    );
    logState(state, "deletePresetContainer");
  },

  // Update a preset container's dimensions
  updatePresetContainer(state, action) {
    const { presetId, presetName, dimensions } = action.payload;
    
    // Initialize presetContainers if it doesn't exist
    if (!state.presetContainers) {
      state.presetContainers = [];
      return;
    }
    
    const preset = state.presetContainers.find(p => p.id === presetId);
    
    if (preset) {
      if (presetName !== undefined) preset.presetName = presetName;
      if (dimensions) {
        preset.dimensions = { ...preset.dimensions, ...dimensions };
      }
    }
    logState(state, "updatePresetContainer");
  }
};