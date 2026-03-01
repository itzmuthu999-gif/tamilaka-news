import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const videoReducers = {
  addVideoSlot(state, action) {
    const { catName, containerId, slotId, isNested, parentContainerId } = action.payload;
    
    if (isNested && parentContainerId) {
      const nestedCont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId)
        ?.nestedContainers?.find(nc => nc.id === containerId);

      if (nestedCont) {
        nestedCont.items.push({
          slotId: slotId || nanoid(),
          containerType: "Video Container",
          videoData: null,
          showSeparator: false,
          dimensions: {
            width: 800
          }
        });
      }
    } else {
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.items.push({
          slotId: slotId || nanoid(),
          containerType: "Video Container",
          videoData: null,
          showSeparator: false,
          dimensions: {
            width: 800
          }
        });
      }
    }
    logState(state, "addVideoSlot");
  },

  addVideoSlotToSlider(state, action) {
    const { catName, containerId, sliderId, slotId, isNested, parentContainerId } = action.payload;
    
    let slider = null;
    if (isNested && parentContainerId) {
      const parentCont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      slider = parentCont?.nestedContainers
        ?.find(nc => nc.id === containerId)
        ?.sliders?.find(s => s.id === sliderId);
    } else {
      slider = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.sliders?.find(s => s.id === sliderId);
    }

    if (slider) {
      if (slider.items.length === 0) {
        slider.lockedType = "Video Container";
      }

      slider.items.push({
        slotId: slotId || nanoid(),
        containerType: "Video Container",
        videoData: null,
        showSeparator: false,
        dimensions: {
          width: 800
        }
      });
    }
    logState(state, "addVideoSlotToSlider");
  },

  updateVideoData(state, action) {
    const { catName, containerId, slotId, videoData, isNested, parentContainerId, sliderId } = action.payload;
    
    let slot = null;
    
    if (sliderId) {
      // Video in slider
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        slot = parentCont?.nestedContainers
          ?.find(nc => nc.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      }
    } else {
      // Video in regular container
      if (isNested && parentContainerId) {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId)
          ?.nestedContainers?.find(nc => nc.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      }
    }

    if (slot) {
      slot.videoData = videoData;
    }
    logState(state, "updateVideoData");
  },

  updateVideoDimensions(state, action) {
    const { catName, containerId, slotId, width, isNested, parentContainerId, sliderId } = action.payload;
    
    let slot = null;
    
    if (sliderId) {
      // Video in slider
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        slot = parentCont?.nestedContainers
          ?.find(nc => nc.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      }
    } else {
      // Video in regular container
      if (isNested && parentContainerId) {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId)
          ?.nestedContainers?.find(nc => nc.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      }
    }

    if (slot) {
      if (!slot.dimensions) {
        slot.dimensions = { width: 800 };
      }
      if (width !== undefined) {
        slot.dimensions.width = width;
      }
    }
    logState(state, "updateVideoDimensions");
  },

  removeVideoFromSlot(state, action) {
    const { catName, containerId, slotId, isNested, parentContainerId, sliderId } = action.payload;
    
    let slot = null;
    
    if (sliderId) {
      // Video in slider
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        slot = parentCont?.nestedContainers
          ?.find(nc => nc.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.sliders?.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      }
    } else {
      // Video in regular container
      if (isNested && parentContainerId) {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId)
          ?.nestedContainers?.find(nc => nc.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      } else {
        slot = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId)
          ?.items.find(i => i.slotId === slotId);
      }
    }

    if (slot) {
      slot.videoData = null;
    }
    logState(state, "removeVideoFromSlot");
  }
};