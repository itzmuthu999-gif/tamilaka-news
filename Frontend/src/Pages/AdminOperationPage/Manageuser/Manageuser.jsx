import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { setUsers } from '../../Slice/userSlice.js';
import { registerUser, updateUser as updateUserApi, deleteUser as deleteUserApi, getUsers } from '../../../Api/userApi.js';
import './manageuser.scss';

const Manageuser = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Editor'
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      const updatedUsers = await getUsers();
      dispatch(setUsers(updatedUsers));
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Make sure you're logged in as Admin.");
      return;
    }

    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Editor'
    });
    setShowCreateModal(false);
    
    alert('User created successfully!');
  };

  // Handle edit user click
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role
    });
    setShowEditModal(true);
  };

  // Update existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateUserApi(editingUser.id, payload);
      const updatedUsers = await getUsers();
      dispatch(setUsers(updatedUsers));
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Make sure you're logged in as Admin.");
      return;
    }

    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Editor'
    });
    setShowEditModal(false);
    setEditingUser(null);
    
    alert('User updated successfully!');
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserApi(userId);
        const updatedUsers = await getUsers();
        dispatch(setUsers(updatedUsers));
        alert('User deleted successfully!');
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Make sure you're logged in as Admin.");
      }
    }
  };

  // Close modals
  const closeCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Editor'
    });
    setShowCreateModal(false);
  };

  const closeEditModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Editor'
    });
    setShowEditModal(false);
    setEditingUser(null);
  };

  return (
    <div className="manage-user-container">
      <div className="manage-user-header">
        <h1>Manage Users</h1>
        <button 
          className="create-user-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaUserPlus /> Create User
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Name</th>
              <th style={{ width: '35%' }}>Email</th>
              <th style={{ width: '20%' }}>Role</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ verticalAlign: 'middle' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontSize: '14px' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px', opacity: '0.9' }}>{user.email}</span>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px'
                  }}>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                  
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
     
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="no-users">
            <p>No users found. Click "Create User" to add your first user.</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="close-btn" onClick={closeCreateModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Create User
                </button>
                <button type="button" className="cancel-btn" onClick={closeCreateModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={closeEditModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={editingUser?.name ? true : false}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={editingUser?.email ? true : false}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Update User
                </button>
                <button type="button" className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manageuser;
