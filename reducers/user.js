import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, username: null, profile_picture: null, email: null, bio: '', },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
      state.value.profile_picture = action.payload.profile_picture;
      state.value.bio = action.payload.bio;
    },
    setUsername: (state, action) => {
      state.value.username = action.payload;
    },
    setEmail: (state, action) => {
      state.value.email = action.payload;
    },
    setBio: (state, action) => {
      state.value.bio = action.payload;
    },
    logout: (state) => {
      state.value.token = null;
    },
    setProfilePicture: (state, action) => {
      state.value.profile_picture = action.payload;
    },
  },
});

export const { login, logout, setUsername, setEmail, setProfilePicture, setBio } = userSlice.actions;
export default userSlice.reducer;
