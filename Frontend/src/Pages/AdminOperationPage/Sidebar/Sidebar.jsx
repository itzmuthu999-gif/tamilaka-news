// Sidebar.jsx - Enhanced Modern Sidebar
import "./Sidebar.css";
import "./logout-confirm.css";
import { FiHome, FiLayout, FiUsers, FiUser, FiSettings, FiFileText, FiEdit3, FiTrendingUp, FiDatabase, FiShield, FiLogOut } from "react-icons/fi";
import { useState } from "react";

export default function Sidebar({ activeItem, setActiveItem, onLogout }) {
  // Remove local state since we're using props
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      id: "handle-pages",
      icon: <FiFileText />,
      label: "Handle Pages",
      description: "Manage pages and districts"
    },
    {
      id: "website-layout",
      icon: <FiLayout />,
      label: "Website Layout",
      description: "Configure website structure"
    },
    {
      id: "manage-users",
      icon: <FiUsers />,
      label: "Manage Users",
      description: "User administration"
    },
    {
      id: "logout",
      icon: <FiLogOut />,
      label: "Log Out",
      description: "Sign out of account",
      isLogout: true
    }
  ];

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      setShowLogoutConfirm(true);
    } else {
      setActiveItem(item.id);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <FiEdit3 />
          </div>
          <div className="logo-text">
            <h1>தமிழகநியூஸ்</h1>
            <span>நடுநிலை நாளிதழ்</span>
          </div>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-details">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeItem === item.id ? "active" : ""} ${item.isLogout ? "logout-item" : ""}`}
            onClick={() => handleMenuClick(item)}
          >
            <div className="menu-icon">
              {item.icon}
            </div>
            <div className="menu-content">
              <span className="menu-label">{item.label}</span>
              <span className="menu-description">{item.description}</span>
            </div>
            <div className="menu-indicator"></div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-item">
          <FiSettings />
          <span>Quick Settings</span>
        </div>
        <div className="version-info">
          <span>v2.0.1</span>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-dialog">
            <div className="logout-confirm-header">
              <FiLogOut />
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-confirm-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="logout-confirm-actions">
              <button 
                className="logout-confirm-btn logout-confirm-no"
                onClick={handleLogoutCancel}
              >
                No
              </button>
              <button 
                className="logout-confirm-btn logout-confirm-yes"
                onClick={handleLogoutConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
