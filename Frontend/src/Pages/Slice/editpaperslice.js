import { createSlice, nanoid } from "@reduxjs/toolkit";

/* ---------- helper logger ---------- */
const logState = (state, actionName) => {
  console.log(`📦 PAGE LAYOUT UPDATED → ${actionName}`);
  console.log(JSON.parse(JSON.stringify(state)));
};

/* ---------- initial state ---------- */
const initialState = {
  activePage: "main",
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
    }
  ]
};

const pageLayoutSlice = createSlice({
  name: "pageLayout",
  initialState,
  reducers: {

    /* -------------------- PAGES -------------------- */

    addPage: {
      reducer(state, action) {
        state.pages.push(action.payload);
        logState(state, "addPage");
      },
      prepare(catName) {
        return {
          payload: {
            catName,
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
        };
      }
    },

    setActivePage(state, action) {
      state.activePage = action.payload;
      logState(state, "setActivePage");
    },

    updatePageSettings(state, action) {
      const { catName, settings } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.settings = { ...page.settings, ...settings };
      }
      logState(state, "updatePageSettings");
    },

    deletePage(state, action) {
      const catName = action.payload;
      state.pages = state.pages.filter(p => p.catName !== catName);

      if (state.activePage === catName) {
        state.activePage = state.pages[0]?.catName || null;
      }

      logState(state, "deletePage");
    },

    /* -------------------- CONTAINERS -------------------- */

    addContainer: {
      reducer(state, action) {
        const { catName, container } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.containers.push(container);
        logState(state, "addContainer");
      },
      prepare(catName) {
        return {
          payload: {
            catName,
            container: {
              id: nanoid(),
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
              nestedContainers: []
            }
          }
        };
      }
    },

    updateContainerGrid(state, action) {
      const { catName, containerId, columns, gap } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        cont.grid.columns = columns;
        cont.grid.gap = gap;
      }
      logState(state, "updateContainerGrid");
    },

    deleteContainer(state, action) {
      const { catName, containerId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.containers = page.containers.filter(c => c.id !== containerId);
      }
      logState(state, "deleteContainer");
    },

    updateContainerHeader(state, action) {
      const { catName, containerId, enabled, title } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        if (enabled !== undefined) cont.header.enabled = enabled;
        if (title !== undefined) cont.header.title = title;
      }
      logState(state, "updateContainerHeader");
    },

    updateContainerSpacing(state, action) {
      const { catName, containerId, padding, margin } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) {
        if (!cont.spacing) cont.spacing = { padding: 10, margin: 0 };
        if (padding !== undefined) cont.spacing.padding = padding;
        if (margin !== undefined) cont.spacing.margin = margin;
      }
      logState(state, "updateContainerSpacing");
    },

    addItemToContainer(state, action) {
      const { catName, containerId, item } = action.payload;
      const cont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === containerId);

      if (cont) cont.items.push(item);
    },

    /* -------------------- NEWS SLOTS -------------------- */

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
    },

    /* -------------------- SLIDERS (UNIFIED - Type 1 & Type 2) -------------------- */

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
              id: nanoid(),
              type: sliderType,
              size: { width: 0 },
              gap: 10,
              items: [],
              lockedType: null
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
      const { catName, containerId, sliderId, containerType, slotId, isNested, parentContainerId } = action.payload;
      
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

        slider.items.push({
          slotId: slotId || nanoid(),
          newsId: null,
          containerType,
          showSeparator: false
        });
      }
      logState(state, "addSlotToContainerSlider");
    },

    dropNewsIntoContainerSliderSlot(state, action) {
      const { catName, containerId, sliderId, slotId, newsId, isNested, parentContainerId } = action.payload;
      
      let slot = null;
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

      if (slot) slot.newsId = newsId;
      logState(state, "dropNewsIntoContainerSliderSlot");
    },

    removeNewsFromContainerSliderSlot(state, action) {
      const { catName, containerId, sliderId, slotId, isNested, parentContainerId } = action.payload;
      
      let slot = null;
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

      if (slot) slot.newsId = null;
      logState(state, "removeNewsFromContainerSliderSlot");
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

    addSlider: {
      reducer(state, action) {
        const { catName, slider } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.sliders.push(slider);
        logState(state, "addSlider");
      },
      prepare(catName, position, sliderType = "type1") {
        return {
          payload: {
            catName,
            slider: {
              id: nanoid(),
              type: sliderType,
              position,
              gap: 10,
              items: [],
              lockedType: null
            }
          }
        };
      }
    },

    updateSliderPosition(state, action) {
      const { catName, sliderId, position } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.position = position;
      logState(state, "updateSliderPosition");
    },

    updateSliderSize(state, action) {
      const { catName, sliderId, size } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.size = size;
      logState(state, "updateSliderSize");
    },

    updateSliderGap(state, action) {
      const { catName, sliderId, gap } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) slider.gap = gap;
      logState(state, "updateSliderGap");
    },

    deleteSlider(state, action) {
      const { catName, sliderId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.sliders = page.sliders.filter(s => s.id !== sliderId);
      }
      logState(state, "deleteSlider");
    },

    addSlotToSlider(state, action) {
      const { catName, sliderId, containerType, slotId } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) {
        if (slider.items.length === 0) {
          slider.lockedType = containerType;
        }

        slider.items.push({
          slotId: slotId || nanoid(),
          newsId: null,
          containerType,
          showSeparator: false
        });
      }
      logState(state, "addSlotToSlider");
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

    removeSlotFromSlider(state, action) {
      const { catName, sliderId, slotId } = action.payload;
      const slider = state.pages
        .find(p => p.catName === catName)
        ?.sliders.find(s => s.id === sliderId);

      if (slider) {
        slider.items = slider.items.filter(i => i.slotId !== slotId);

        if (slider.items.length === 0) {
          slider.lockedType = null;
        }
      }
      logState(state, "removeSlotFromSlider");
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

    /* -------------------- LINES -------------------- */

    addLine: {
      reducer(state, action) {
        const { catName, line } = action.payload;
        const page = state.pages.find(p => p.catName === catName);
        if (page) page.lines.push(line);
        logState(state, "addLine");
      },
      prepare(catName, lineType, orientation, position) {
        return {
          payload: {
            catName,
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
      const { catName, lineId, x, y } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) {
        if (x !== undefined) line.x = x;
        if (y !== undefined) line.y = y;
      }
      logState(state, "updateLinePosition");
    },

    updateLineLength(state, action) {
      const { catName, lineId, length } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) line.length = length;
      logState(state, "updateLineLength");
    },

    updateLineArguments(state, action) {
      const { catName, lineId, length, x, y } = action.payload;
      const line = state.pages
        .find(p => p.catName === catName)
        ?.lines.find(l => l.id === lineId);

      if (line) {
        if (length !== undefined) line.length = length;
        if (x !== undefined) line.x = x;
        if (y !== undefined) line.y = y;
      }
      logState(state, "updateLineArguments");
    },

    deleteLine(state, action) {
      const { catName, lineId } = action.payload;
      const page = state.pages.find(p => p.catName === catName);
      if (page) {
        page.lines = page.lines.filter(l => l.id !== lineId);
      }
      logState(state, "deleteLine");
    },

    setActiveLine(state, action) {
      const { lineId } = action.payload;
      state.activeLineId = lineId;
      logState(state, "setActiveLine");
    },

    /* -------------------- NESTED CONTAINERS -------------------- */

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
              id: nanoid(),
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
              nestedContainers: []
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
      const { catName, parentContainerId, nestedContainerId, containerType, slotId } = action.payload;
      const nestedCont = state.pages
        .find(p => p.catName === catName)
        ?.containers.find(c => c.id === parentContainerId)
        ?.nestedContainers?.find(nc => nc.id === nestedContainerId);

      if (nestedCont) {
        nestedCont.items.push({
          slotId: slotId || nanoid(),
          newsId: null,
          containerType,
          showSeparator: false
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
    }
  },
  updateContainerSliderHeader: (state, action) => {
  const { catName, containerId, sliderId, enabled, title, isNested, parentContainerId } = action.payload;
  
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
    slider.header = { enabled, title };
  }
},

updateContainerSliderPadding: (state, action) => {
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
  
  if (!container) return;
  
  const slider = container.sliders?.find(s => s.id === sliderId);
  if (slider) {
    slider.padding = padding;
  }
},

});

/* ---------- exports ---------- */
export const {
  addPage,
  setActivePage,
  updatePageSettings,
  deletePage,

  addContainer,
  updateContainerPosition,
  updateContainerGrid,
  deleteContainer,
  updateContainerSize,
  updateContainerHeader,
  updateContainerSpacing,

  addEmptySlot,
  dropNewsIntoSlot,
  removeNewsFromSlot,
  removeSlotFromContainer,
  toggleContainerSeparator,

  addSlider,
  updateSliderPosition,
  updateSliderSize,
  updateSliderGap,
  deleteSlider,
  addSlotToSlider,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  removeSlotFromSlider,
  toggleSliderSeparator,

  addSliderToContainer,
  updateSliderWidth,
  updateContainerSliderGap,
  deleteContainerSlider,
  addSlotToContainerSlider,
  dropNewsIntoContainerSliderSlot,
  removeNewsFromContainerSliderSlot,
  removeSlotFromContainerSlider,

  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerHeader,
  updateNestedContainerSpacing,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  removeSlotFromNestedContainer,
  toggleNestedSeparator,

  addLine,
  updateLinePosition,
  updateLineLength,
  updateLineArguments,
  deleteLine,
  setActiveLine,
    updateContainerSliderHeader,
  updateContainerSliderPadding,

} = pageLayoutSlice.actions;

export default pageLayoutSlice.reducer;      