import { nanoid } from "@reduxjs/toolkit";
import { logState } from "../utils/sliceHelpers";

export const lineReducers = {
  addLine: {
    reducer(state, action) {
      const { catName, line, containerId, parentContainerId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      
      if (!page) return;
      
      if (containerId && parentContainerId) {
        const parentCont = page.containers.find(c => c.id === parentContainerId);
        const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
        if (nestedCont) {
          if (!nestedCont.lines) nestedCont.lines = [];
          nestedCont.lines.push(line);
        }
      } else if (containerId) {
        const container = page.containers.find(c => c.id === containerId);
        if (container) {
          if (!container.lines) container.lines = [];
          container.lines.push(line);
        }
      } else {
        page.lines.push(line);
      }
      
      logState(state, "addLine");
    },
    prepare(catName, lineType, orientation, position, containerId, parentContainerId) {
      return {
        payload: {
          catName,
          containerId,
          parentContainerId,
          line: {
            id: nanoid(),
            lineType,
            orientation,
            length: orientation === "horizontal" ? 500 : 300,
            x: position?.x ?? 100,
            y: position?.y ?? 100
          }
        }
      };
    }
  },

  updateLinePosition(state, action) {
    const { catName, lineId, x, y, containerId, parentContainerId } = action.payload;
    
    let line;
    if (containerId && parentContainerId) {
      const parentCont = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
      line = nestedCont?.lines?.find(l => l.id === lineId);
    } else if (containerId) {
      const container = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);
      line = container?.lines?.find(l => l.id === lineId);
    } else {
      line = state.pages.find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);
    }

    if (line) {
      if (x !== undefined) line.x = x;
      if (y !== undefined) line.y = y;
    }
    logState(state, "updateLinePosition");
  },

  updateLineLength(state, action) {
    const { catName, lineId, length, containerId, parentContainerId } = action.payload;
    
    let line;
    if (containerId && parentContainerId) {
      const parentCont = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
      line = nestedCont?.lines?.find(l => l.id === lineId);
    } else if (containerId) {
      const container = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);
      line = container?.lines?.find(l => l.id === lineId);
    } else {
      line = state.pages.find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);
    }

    if (line) line.length = length;
    logState(state, "updateLineLength");
  },

  updateLineArguments(state, action) {
    const { catName, lineId, length, x, y, containerId, parentContainerId } = action.payload;
    
    let line;
    if (containerId && parentContainerId) {
      const parentCont = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
      line = nestedCont?.lines?.find(l => l.id === lineId);
    } else if (containerId) {
      const container = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);
      line = container?.lines?.find(l => l.id === lineId);
    } else {
      line = state.pages.find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);
    }

    if (line) {
      if (length !== undefined) line.length = length;
      if (x !== undefined) line.x = x;
      if (y !== undefined) line.y = y;
    }
    logState(state, "updateLineArguments");
  },

  deleteLine(state, action) {
    const { catName, lineId, containerId, parentContainerId } = action.payload;
    
    if (containerId && parentContainerId) {
      const parentCont = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find(nc => nc.id === containerId);
      if (nestedCont && nestedCont.lines) {
        nestedCont.lines = nestedCont.lines.filter(l => l.id !== lineId);
      }
    } else if (containerId) {
      const container = state.pages.find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);
      if (container && container.lines) {
        container.lines = container.lines.filter(l => l.id !== lineId);
      }
    } else {
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.lines = page.lines.filter(l => l.id !== lineId);
      }
    }
    
    logState(state, "deleteLine");
  },

  setActiveLine(state, action) {
    const { lineId } = action.payload;
    state.activeLineId = lineId;
    logState(state, "setActiveLine");
  }
};