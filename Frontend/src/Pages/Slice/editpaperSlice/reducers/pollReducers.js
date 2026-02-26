import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const pollReducers = {
  addPollSlot: {
    reducer(state, action) {
      const { catName, containerId, slotId, isNested, parentContainerId } = action.payload;
      
      if (isNested && parentContainerId) {
        const nestedCont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === parentContainerId)
          ?.nestedContainers?.find(nc => nc.id === containerId);

        if (nestedCont) {
          nestedCont.items.push({
            slotId: slotId || nanoid(),
            containerType: "Poll",
            pollData: null
          });
        }
      } else {
        const cont = state.pages
          .find(p => p.catName === catName)
          ?.containers.find(c => c.id === containerId);

        if (cont) {
          cont.items.push({
            slotId: slotId || nanoid(),
            containerType: "Poll",
            pollData: null
          });
        }
      }
      logState(state, "addPollSlot");
    },
    prepare(catName, containerId, isNested = false, parentContainerId = null) {
      return {
        payload: {
          catName,
          containerId,
          slotId: nanoid(),
          isNested,
          parentContainerId
        }
      };
    }
  },

  updatePollData(state, action) {
    const { catName, containerId, slotId, pollData, isNested, parentContainerId } = action.payload;
    
    if (isNested && parentContainerId) {
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId)
        ?.nestedContainers?.find(nc => nc.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) {
        slot.pollData = pollData;
      }
    } else {
      const slot = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId)
        ?.items.find(i => i.slotId === slotId);

      if (slot) {
        slot.pollData = pollData;
      }
    }
    logState(state, "updatePollData");
  },

  removePollFromSlot(state, action) {
    const { catName, containerId, slotId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === containerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.pollData = null;
    }
    logState(state, "removePollFromSlot");
  },

  removePollFromNestedSlot(state, action) {
    const { catName, parentContainerId, nestedContainerId, slotId } = action.payload;
    const slot = state.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === parentContainerId)
      ?.nestedContainers?.find(nc => nc.id === nestedContainerId)
      ?.items.find(i => i.slotId === slotId);

    if (slot) {
      slot.pollData = null;
    }
    logState(state, "removePollFromNestedSlot");
  }
};