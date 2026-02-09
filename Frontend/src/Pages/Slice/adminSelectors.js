// Selectors for admin slice
export const selectAllPages = (state) => state.admin?.allPages || [];
export const selectAllDistricts = (state) => state.admin?.allDistricts || [];
export const selectPageById = (state, pageId) => 
  state.admin?.allPages?.find(page => page.id === pageId);
export const selectDistrictById = (state, districtId) => 
  state.admin?.allDistricts?.find(district => district.id === districtId);
export const selectPageByName = (state, name) => 
  state.admin?.allPages?.find(page => 
    page.name.tam === name || page.name.eng === name
  );
export const selectDistrictByName = (state, name) => 
  state.admin?.allDistricts?.find(district => 
    district.name.tam === name || district.name.eng === name
  );
export const selectPagesByTopNavPosition = (state, topnavpos) => 
  state.admin?.allPages?.filter(page => page.topnavpos === topnavpos) || [];
export const selectPagesBySideNavPosition = (state, sidenavpos) => 
  state.admin?.allPages?.filter(page => page.sidenavpos === sidenavpos) || [];
export const selectDistrictsWithDistricts = (state) => 
  state.admin?.allDistricts?.filter(district => district.districts && district.districts.length > 0) || [];
export const selectPageNames = (state) => 
  state.admin?.allPages?.map(page => page.name) || [];
export const selectDistrictNames = (state) => 
  state.admin?.allDistricts?.map(district => district.name) || [];
export const selectAllDistrictNames = (state) => {
  const allDistrictNames = [];
  state.admin?.allDistricts?.forEach(district => {
    if (district.districts && district.districts.length > 0) {
      allDistrictNames.push(...district.districts);
    }
  });
  return allDistrictNames;
};

// Navigation selectors
export const selectTopNavHeaders1 = (state) => state.admin?.topNavHeaders1 || [];
export const selectTopNavHeaders2 = (state) => state.admin?.topNavHeaders2 || [];
export const selectDropdownPosition1 = (state) => state.admin?.dropdownPosition1 || 0;
export const selectDropdownPosition2 = (state) => state.admin?.dropdownPosition2 || 0;
export const selectSelectedDistrict1 = (state) => state.admin?.selectedDistrict1 || "";
export const selectSelectedDistrict2 = (state) => state.admin?.selectedDistrict2 || "";

// Helper selectors for navigation data
export const selectTopNavPages1 = (state) => {
  const headers = selectTopNavHeaders1(state);
  const pages = selectAllPages(state);
  return headers.map(headerId => pages.find(page => page.id === headerId)).filter(Boolean);
};

export const selectTopNavPages2 = (state) => {
  const headers = selectTopNavHeaders2(state);
  const pages = selectAllPages(state);
  return headers.map(headerId => pages.find(page => page.id === headerId)).filter(Boolean);
};

export const selectDistrictPage = (state) => {
  const pages = selectAllPages(state);
  return pages[pages.length - 1];
};
