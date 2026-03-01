import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const nestedReducers = {
  addNestedContainer: {
    reducer(state, action) {
      const { catName, parentContainerId, container } = action.payload;
      const parentCont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);

      if (parentCont) {
        if (!parentCont.nestedContainers) {
          parentCont.nestedContainers = [];
        }
        parentCont.nestedContainers.push(container);
      }
      logState(state, "addNestedContainer");
    },
    prepare(catName, parentContainerId) {
      return {
        payload: {
          catName,
          parentContainerId,
          container: {
            id: `nested_container_${Date.now()}`,
            grid: {
              columns: 2,
              gap: 10
            },
            items: [],
            header: {
              enabled: false,
              title: ""
            },
            spacing: {
              padding: 10,
              margin: 0
            },
            nestedContainers: [],
            sliders: [],
            lines: []
          }
        }
      };
    }
  },

  deleteNestedContainer(state, action) {
    const { catName, parentContainerId, nestedContainerId } = action.payload;
    const parentCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId);

    if (parentCont && parentCont.nestedContainers) {
      parentCont.nestedContainers = parentCont.nestedContainers.filter(
        c => c.id !== nestedContainerId
      );
    }
    logState(state, "deleteNestedContainer");
  },

  updateNestedContainerGrid(state, action) {
    const { catName, parentContainerId, nestedContainerId, columns, gap } = action.payload;
    const nestedCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

    if (nestedCont) {
      nestedCont.grid.columns = columns;
      nestedCont.grid.gap = gap;
    }
    logState(state, "updateNestedContainerGrid");
  },

  updateNestedContainerHeader(state, action) {
    const { catName, parentContainerId, nestedContainerId, enabled, title } = action.payload;
    const nestedCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

    if (nestedCont) {
      if (enabled !== undefined) nestedCont.header.enabled = enabled;
      if (title !== undefined) nestedCont.header.title = title;
    }
    logState(state, "updateNestedContainerHeader");
  },

  updateNestedContainerSpacing(state, action) {
    const { catName, parentContainerId, nestedContainerId, padding, margin } = action.payload;
    const nestedCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

    if (nestedCont) {
      if (!nestedCont.spacing) nestedCont.spacing = { padding: 10, margin: 0 };
      if (padding !== undefined) nestedCont.spacing.padding = padding;
      if (margin !== undefined) nestedCont.spacing.margin = margin;
    }
    logState(state, "updateNestedContainerSpacing");
  },

  addEmptySlotToNested(state, action) {
    const { catName, parentContainerId, nestedContainerId, containerType, slotId, presetId } = action.payload;
    const nestedCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

    if (nestedCont) {
      let presetDimensions = null;
      let presetShfval = null;
      if (presetId) {
        const preset = state.presetContainers.find(p => p.id === presetId);
        if (preset) {
          presetDimensions = preset.dimensions;
          presetShfval = preset.shfval;
        }
      }

      const defaultDimensions = {
        containerWidth: 800,
        containerHeight: 300,
        imgWidth: 750,
        imgHeight: 300,
        padding: 8
      };

      nestedCont.items.push({
        slotId: slotId || nanoid(),
        newsId: null,
        containerType,
        showSeparator: false,
        shfval: presetShfval || 1,
        ...(containerType === "Universal Container" && {
          dimensions: presetDimensions || defaultDimensions
        })
      });
    }
    logState(state, "addEmptySlotToNested");
  },

  dropNewsIntoNestedSlot(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId, newsId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) slot.newsId = newsId;
    logState(state, "dropNewsIntoNestedSlot");
  },

  removeNewsFromNestedSlot(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) slot.newsId = null;
    logState(state, "removeNewsFromNestedSlot");
  },

  removeSlotFromNestedContainer(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId } = action.payload;
    const nestedCont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

    if (nestedCont) {
      nestedCont.items = nestedCont.items.filter(i => i.slotId !== slotId);
    }
    logState(state, "removeSlotFromNestedContainer");
  },

  toggleNestedSeparator(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.showSeparator = !slot.showSeparator;
    }
    logState(state, "toggleNestedSeparator");
  },

  updateNestedSlotShfval(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId, shfval } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.shfval = shfval;
    }
    logState(state, "updateNestedSlotShfval");
  },

  updateNestedSlotDimensions(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId, containerWidth, containerHeight, imgWidth, imgHeight, padding } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

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
    logState(state, "updateNestedSlotDimensions");
  }
};
