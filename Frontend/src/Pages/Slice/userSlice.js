import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  users: []
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Add a new user
    addUser: {
      reducer(state, action) {
        state.users.push(action.payload);
      },
      prepare(name, email, password, role) {
        return {
          payload: {
            id: nanoid(),
            name,
            email,
            password, // In production, this should be hashed
            role,
            createdAt: new Date().toISOString()
          }
        };
      }
    },

    // Update an existing user
    updateUser(state, action) {
      const { id, name, email, role } = action.payload;
      const existingUser = state.users.find(user => user.id === id);
      if (existingUser) {
        existingUser.name = name;
        existingUser.email = email;
        existingUser.role = role;
        existingUser.updatedAt = new Date().toISOString();
      }
    },

    // Delete a user
    deleteUser(state, action) {
      const userId = action.payload;
      state.users = state.users.filter(user => user.id !== userId);
    },

    // Set users (for initial load)
    setUsers(state, action) {
      state.users = action.payload;
    },

    // Clear all users
    clearUsers(state) {
      state.users = [];
    }
  }
});

export const { addUser, updateUser, deleteUser, setUsers, clearUsers } = userSlice.actions;
export default userSlice.reducer;
