import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include', 
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkSession = createAsyncThunk('auth/checkSession', async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/check_session', { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        return { isAuthenticated: true, user: data.user };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });
  
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      return { isAuthenticated: false };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
});

export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Server error!');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in fetchUsers thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  'auth/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Server error!');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in addUser thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_id: 1 }), // Replace with dynamic admin_id
      });
      if (!response.ok) throw new Error('Server error!');
      return userId;
    } catch (error) {
      console.error('Error in deleteUser thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  userStatus: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(addUser.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(addUser.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
