import { logState } from "../utils/sliceHelpers";

export const syncReducers = {
  syncPagesFromAdmin(state, action) {
    const { allPages, districtPage } = action.payload;
    
    console.log("syncPagesFromAdmin called with:", { allPages, districtPage });
    
    // Keep main page (index 0) as is
    const existingMainPage = state.pages.find(p => p.catName === "main");
    const syncedPages = existingMainPage ? [existingMainPage] : [];
    
    console.log("Main page found:", existingMainPage);
    
    // Define page order based on actual pages in adminSlice
    const pageOrder = [
      { eng: "Politics", priority: 1 },
      { eng: "Cinema", priority: 2 },
      { eng: "Business", priority: 3 },
      { eng: "World", priority: 4 },
      { eng: "India", priority: 5 },
      { eng: "Tamil Nadu", priority: 6 },
      { eng: "News", priority: 7 },
      { eng: "Sports", priority: 8 },
      { eng: "Trending", priority: 9 }
    ];
    
    // Sort and add pages in the specified order
    pageOrder.forEach((pageOrder) => {
      const adminPage = allPages.find(p => p.name.eng === pageOrder.eng);
      
      if (adminPage) {
        const existingPage = state.pages.find(p => p.catName === adminPage.name.eng.toLowerCase());
        
        if (existingPage) {
          // Update existing page, but preserve its content
          syncedPages.push(existingPage);
        } else {
          // Create new page with correct position
          syncedPages.push({
            catName: adminPage.name.eng.toLowerCase(),
            settings: {
              height: 600,
              gridColumns: 12,
              gap: 10,
              padding: 20
            },
            containers: [],
            sliders: [],
            lines: []
          });
        }
      }
    });
    
    // Add district pages from district page (NOT "District" page itself)
    if (districtPage?.districts) {
      districtPage.districts.forEach((district) => {
        const existingDistrictPage = state.pages.find(p => p.catName === district.eng.toLowerCase());
        
        if (existingDistrictPage) {
          // Update existing district page, but preserve its content
          syncedPages.push(existingDistrictPage);
        } else {
          // Create new district page for each district name
          syncedPages.push({
            catName: district.eng.toLowerCase(),
            settings: {
              height: 600,
              gridColumns: 12,
              gap: 10,
              padding: 20
            },
            containers: [],
            sliders: [],
            lines: []
          });
        }
      });
    }
    
    // This preserves manually created pages that might have content
    const existingPageNames = new Set(syncedPages.map(p => p.catName));
    const additionalPages = state.pages.filter(p => !existingPageNames.has(p.catName));
    syncedPages.push(...additionalPages);
    
    state.pages = syncedPages;
    console.log("Final synced pages:", syncedPages);
    logState(state, "syncPagesFromAdmin");
  }
};