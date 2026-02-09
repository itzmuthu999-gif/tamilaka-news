import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const slotReducers = {
  addEmptySlot(state, action) {
    const { catName, containerId, containerType, slotId } = action.payload;
    const cont = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId);

    if (cont) {
      cont.items.push({
        slotId: slotId || nanoid(),
        newsId: null,
        containerType,
        showSeparator: false
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
  }
};