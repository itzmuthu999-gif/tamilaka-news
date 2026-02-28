import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const sliderReducers = {
  addSliderToContainer: {
    reducer(state, action) {
      const { catName, containerId, slider, isNested, parentContainerId } = action.payload;
      
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
        
        if (nestedCont) {
          if (!nestedCont.sliders) nestedCont.sliders = [];
          nestedCont.sliders.push(slider);
        }
      } else {
        const cont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId);
        
        if (cont) {
          if (!cont.sliders) cont.sliders = [];
          cont.sliders.push(slider);
        }
      }
      logState(state, "addSliderToContainer");
    },
    prepare(catName, containerId, sliderType = "type1", isNested = false, parentContainerId = null) {
      return {
        payload: {
          catName,
          containerId,
          isNested,
          parentContainerId,
          slider: {
            id: `slider_${Date.now()}`,
            type: sliderType,
            dimensions: { containerWidth: 400, containerHeight: 300, imgWidth: 200, imgHeight: 150, padding: 10 },
            padding: 10,                              
            size: { width: 0 },
            gap: 10,
            items: [],
            lockedType: null,
            header: {
              enabled: false,
              title: ""
            }
          }
        }
      };
    }
  },

  updateSliderWidth(state, action) {
    const { catName, containerId, sliderId, width, isNested, parentContainerId } = action.payload;
    
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
      if (!slider.size) slider.size = {};
      slider.size.width = width;
    }
    logState(state, "updateSliderWidth");
  },

  updateContainerSliderGap(state, action) {
    const { catName, containerId, sliderId, gap, isNested, parentContainerId } = action.payload;
    
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

    if (slider) slider.gap = gap;
    logState(state, "updateContainerSliderGap");
  },

  deleteContainerSlider(state, action) {
    const { catName, containerId, sliderId, isNested, parentContainerId } = action.payload;
    
    if (isNested && parentContainerId) {
      const parentCont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
      
      if (nestedCont && nestedCont.sliders) {
        nestedCont.sliders = nestedCont.sliders.filter(s => s.id !== sliderId);
      }
    } else {
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);
      
      if (cont && cont.sliders) {
        cont.sliders = cont.sliders.filter(s => s.id !== sliderId);
      }
    }
    logState(state, "deleteContainerSlider");
  },

  addSlotToContainerSlider(state, action) {
    const { catName, containerId, sliderId, containerType, slotId, isNested, parentContainerId, presetId } = action.payload;
    
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
        slider.lockedType = containerType;
      }

      // Find preset dimensions if presetId is provided
      let presetDimensions = null;
      let presetShfval = null;
      if (presetId) {
        const preset = state.presetContainers.find(p => p.id === presetId);
        if (preset) {
          presetDimensions = preset.dimensions;
          presetShfval = preset.shfval;
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

      slider.items.push({
        slotId: slotId || nanoid(),
        newsId: null,
        containerType,
        showSeparator: false,
        shfval: presetShfval || 1,
        // Add dimensions for Universal Container at slot level
        ...(containerType === "Universal Container" && {
          dimensions: presetDimensions || defaultDimensions
        })
      });
    }
    logState(state, "addSlotToContainerSlider");
  },

  dropNewsIntoSliderSlot(state, action) {
    const { catName, sliderId, slotId, newsId, isNested, parentContainerId, containerId } = action.payload;
    
    let slot = null;
    
    // Check if it's a slider inside a container
    if (containerId) {
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
      // Page-level slider
      slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);
    }

    if (slot) slot.newsId = newsId;
    logState(state, "dropNewsIntoSliderSlot");
  },

  removeNewsFromSliderSlot(state, action) {
    const { catName, sliderId, slotId, isNested, parentContainerId, containerId } = action.payload;
    
    let slot = null;
    
    // Check if it's a slider inside a container
    if (containerId) {
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
      // Page-level slider
      slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);
    }

    if (slot) slot.newsId = null;
    logState(state, "removeNewsFromSliderSlot");
  },

  removeSlotFromContainerSlider(state, action) {
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
      slider.items = slider.items.filter(i => i.slotId !== slotId);
    }
    logState(state, "removeSlotFromContainerSlider");
  },

  toggleSliderSeparator(state, action) {
    const { catName, sliderId, slotId, isNested, parentContainerId, containerId } = action.payload;
    
    let slot = null;
    
    // Check if it's a slider inside a container
    if (containerId) {
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
      // Page-level slider
      slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);
    }

    if (slot) {
      slot.showSeparator = !slot.showSeparator;
    }
    logState(state, "toggleSliderSeparator");
  },

  updateSliderShfval(state, action) {
    const { catName, sliderId, slotId, shfval, isNested, parentContainerId, containerId } = action.payload;
    
    let slot = null;
    
    // Check if it's a slider inside a container
    if (containerId) {
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
        slot = nestedCont?.sliders?.find(s => s.id === sliderId)?.items.find(i => i.slotId === slotId);
      } else {
        const cont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId);
        slot = cont?.sliders?.find(s => s.id === sliderId)?.items.find(i => i.slotId === slotId);
      }
    } else {
      // Standalone slider
      slot = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId)
        ?.items.find(i => i.slotId === slotId);
    }

    if (slot) {
      slot.shfval = shfval;
    }
    logState(state, "updateSliderShfval");
  },

  updateSliderSlotShfval: {
    reducer(state, action) {
      const { catName, sliderId, slotId, shfval, isNested, parentContainerId, containerId } = action.payload;
      
      let slot = null;
      
      // Check if it's a slider inside a container
      if (containerId) {
        if (isNested && parentContainerId) {
          const parentCont = state.pages
            .find(p => p.catName === catName)
            ?.containers.find(c => c.id === parentContainerId);
          const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
          slot = nestedCont?.sliders?.find(s => s.id === sliderId)?.items.find(i => i.slotId === slotId);
        } else {
          const cont = state.pages
            .find(p => p.catName === catName)
            ?.containers.find(c => c.id === containerId);
          slot = cont?.sliders?.find(s => s.id === sliderId)?.items.find(i => i.slotId === slotId);
        }
      } else {
        // Standalone slider
        slot = state.pages
          .find(p => p.catName === catName)
          ?.sliders.find(s => s.id === sliderId)
          ?.items.find(i => i.slotId === slotId);
      }

      if (slot) {
        slot.shfval = shfval;
      }
      logState(state, "updateSliderSlotShfval");
    },
  },

  updateContainerSliderDimensions(state, action) {
    const { catName, containerId, sliderId, containerWidth, containerHeight, imgWidth, imgHeight, padding, isNested, parentContainerId } = action.payload;
    
    const page = state.pages.find(p => p.catName === catName);
    if (!page) return;
    
    let container;
    if (isNested && parentContainerId) {
      const parentCont = page.containers.find(c => c.id === parentContainerId);
      container = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
    } else {
      container = page.containers.find(c => c.id === containerId);
    }
    
    if (!container) return;
    
    const slider = container.sliders?.find(s => s.id === sliderId);
    if (slider) {
      if (!slider.dimensions) slider.dimensions = { containerWidth: 400, containerHeight: 300, imgWidth: 200, imgHeight: 150, padding: 10 };
      if (containerWidth !== undefined) slider.dimensions.containerWidth = containerWidth;
      if (containerHeight !== undefined) slider.dimensions.containerHeight = containerHeight;
      if (imgWidth !== undefined) slider.dimensions.imgWidth = imgWidth;
      if (imgHeight !== undefined) slider.dimensions.imgHeight = imgHeight;
      if (padding !== undefined) slider.dimensions.padding = padding;
    }
    logState(state, "updateContainerSliderDimensions");
  },

  updateContainerSliderPadding(state, action) {
    const { catName, containerId, sliderId, padding, isNested, parentContainerId } = action.payload;
    
    const page = state.pages.find(p => p.catName === catName);
    if (!page) return;
    
    let container;
    if (isNested && parentContainerId) {
      const parentCont = page.containers.find(c => c.id === parentContainerId);
      container = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
    } else {
      container = page.containers.find(c => c.id === containerId);
    }
    
    if (container) {
      const slider = container.sliders?.find(s => s.id === sliderId);
      if (slider) {
        slider.padding = padding;
      }
    }
    logState(state, "updateContainerSliderPadding");
  },

  // FIXED: Changed slot.slots to slot.items throughout this function
  updateSliderSlotDimensions(state, action) {
    const { catName, sliderId, slotId, containerWidth, containerHeight, imgWidth, imgHeight, padding, isNested, parentContainerId, containerId } = action.payload;
    
    let slot = null;
    
    // Check if it's a slider inside a container
    if (containerId) {
      if (isNested && parentContainerId) {
        const parentCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId);
        const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
        
        if (nestedCont) {
          // FIXED: Changed from .slots to .items
          slot = nestedCont.sliders?.find(s => s.id === sliderId)?.items?.find(item => item.slotId === slotId);
        }
      } else {
        const cont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId);
        
        if (cont) {
          // FIXED: Changed from .slots to .items
          slot = cont.sliders?.find(s => s.id === sliderId)?.items?.find(item => item.slotId === slotId);
        }
      }
    } else {
      // Direct slider (not in container)
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);
      
      if (slider) {
        // FIXED: Changed from .slots to .items
        slot = slider.items?.find(item => item.slotId === slotId);
      }
    }

    if (slot) {
      if (!slot.dimensions) {
        slot.dimensions = { 
          containerWidth: 800, 
          containerHeight: 300, 
          imgWidth: 750, 
          imgHeight: 300, 
          padding: 8 
        };
      }
      if (containerWidth !== undefined) slot.dimensions.containerWidth = containerWidth;
      if (containerHeight !== undefined) slot.dimensions.containerHeight = containerHeight;
      if (imgWidth !== undefined) slot.dimensions.imgWidth = imgWidth;
      if (imgHeight !== undefined) slot.dimensions.imgHeight = imgHeight;
      if (padding !== undefined) slot.dimensions.padding = padding;
    }
    logState(state, "updateSliderSlotDimensions");
  },

  updateContainerSliderHeader(state, action) {
    const { catName, containerId, sliderId, enabled, title, isNested, parentContainerId } = action.payload;

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
      if (!slider.header) slider.header = { enabled: false, title: "" };
      if (enabled !== undefined) slider.header.enabled = enabled;
      if (title !== undefined) slider.header.title = title;
    }
    logState(state, "updateContainerSliderHeader");
  }
};
