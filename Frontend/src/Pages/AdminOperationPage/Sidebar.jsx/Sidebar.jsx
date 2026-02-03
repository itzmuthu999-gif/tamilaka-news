// Sidebar.jsx
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>தமிழகநியூஸ்</h1>
        <span>நடுநிலை நாளிதழ்</span>
      </div>

      <nav className="menu">
        <button className="menu-item active">Handle Pages</button>
        <button className="menu-item">Website layout</button>
        <button className="menu-item">Manage Users</button>
        <button className="menu-item">Profile</button>
      </nav>
    </aside>
  );
}
