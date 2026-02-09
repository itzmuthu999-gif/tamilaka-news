// Adminop.jsx - Main Admin Page with Sidebar
import "./adminop.scss";
import "./Adminop.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import HandlePages from "./HandlePages/HandlePages";
import Sidebar from "./Sidebar/Sidebar";
import Websitelyt from "./WebsiteLayout/Websitelyt";
import Manageuser from "./Manageuser/Manageuser.jsx";
import { selectAllPages, selectDistrictPage } from "../Slice/adminSelectors.js";
import { syncPagesFromAdmin } from "../Slice/editpaperSlice/editpaperslice.js";

export default function Adminop() {
  const dispatch = useDispatch();
  
  // State for active menu item
  const [activeMenuItem, setActiveMenuItem] = useState("handle-pages");
  
  // Handle logout
  const handleLogout = () => {
    // Clear any user data from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Redirect to login page or home page
    window.location.href = '/login'; // Adjust this path as needed
  };
  
  // Get data from Redux store
  const allPages = useSelector(selectAllPages);
  const districtPage = useSelector(selectDistrictPage);
  
  // Sync pages from adminSlice to editpaperSlice when data changes
  useEffect(() => {
    dispatch(syncPagesFromAdmin({ allPages, districtPage }));
  }, [allPages, districtPage, dispatch]);
  
  // Extract Tamil names for HandlePages component compatibility
  const pages = allPages.filter((page, index) => index !== allPages.length - 1).map(page => page.name.tam);
  const districts = districtPage?.districts?.map(d => d.tam) || [];

  return (
    <main className="main">
      <div className="admin-layout">
        <Sidebar activeItem={activeMenuItem} setActiveItem={setActiveMenuItem} onLogout={handleLogout} />
        <div className="content-area">
          {activeMenuItem === "handle-pages" && <HandlePages />}
          {activeMenuItem === "website-layout" && <Websitelyt />}
          {activeMenuItem === "manage-users" && <Manageuser />}
        </div>
      </div>
    </main>
  );
}
