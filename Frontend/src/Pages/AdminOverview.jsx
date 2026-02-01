import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./AdminOverview.scss";

export default function AdminOverview() {
  return (
    <div className="admin-overview">
      <nav className="admin-overview-nav">
        <Link to="/" className="admin-overview-logo">
          <img src={logo} alt="Logo" />
        </Link>
        <Link to="/" className="admin-overview-back">
          ← Back to Home
        </Link>
      </nav>

      <div className="admin-overview-content">
        <header className="admin-overview-header">
          <h1>Admin Handling Overview</h1>
          <p className="admin-overview-subtitle">
            This page provides an overview of the admin panel features for managing the Tamilaka News platform.
          </p>
        </header>

        <section className="admin-overview-section">
          <div className="admin-overview-card">
            <div className="admin-overview-card-icon">🔐</div>
            <h2>Admin Role — Create Pass Key</h2>
            <p>
              Create and manage roles using pass keys. This feature allows you to define different admin roles 
              and assign secure pass keys for authentication. Each role can have specific permissions 
              and access levels within the admin panel.
            </p>
            <ul>
              <li>Create new roles with custom pass keys</li>
              <li>Assign permissions per role</li>
              <li>Secure authentication for admin access</li>
            </ul>
          </div>
        </section>

        <section className="admin-overview-section">
          <div className="admin-overview-card">
            <div className="admin-overview-card-icon">📄</div>
            <h2>Add or Remove Pages</h2>
            <p>
              Manage the page list of your application. You can add new pages to the site or remove 
              existing ones. The page list displays all available pages in the system, and you have 
              full control to customize which pages are visible and accessible.
            </p>
            <ul>
              <li>View complete list of pages</li>
              <li>Add new pages to the site</li>
              <li>Remove pages from the navigation</li>
            </ul>
          </div>
        </section>

        <section className="admin-overview-section">
          <div className="admin-overview-card">
            <div className="admin-overview-card-icon">📐</div>
            <h2>Layout</h2>
            <p>
              Control the layout of the newspaper and admin pages. Customize how content is displayed, 
              adjust container arrangements, and configure the overall structure of your pages. 
              Layout settings affect the visual presentation across the platform.
            </p>
            <ul>
              <li>Configure page layout structure</li>
              <li>Customize container arrangements</li>
              <li>Adjust visual presentation settings</li>
            </ul>
          </div>
        </section>

        <section className="admin-overview-section">
          <div className="admin-overview-card">
            <div className="admin-overview-card-icon">👥</div>
            <h2>Manage Users</h2>
            <p>
              Manage user credentials and access levels. Control what each user can do within the system— 
              allow them to edit content, restrict them to view-only access, or remove users entirely. 
              User management ensures proper access control across your team.
            </p>
            <ul>
              <li><strong>Edit</strong> — Grant full editing permissions</li>
              <li><strong>View Only</strong> — Restrict to read-only access</li>
              <li><strong>Delete</strong> — Remove user access from the system</li>
            </ul>
          </div>
        </section>

        <div className="admin-overview-footer">
          <Link to="/" className="admin-overview-cta">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
