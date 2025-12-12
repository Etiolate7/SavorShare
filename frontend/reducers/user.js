import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, username: null, profile_picture: null, email: null, bio: '', bookmarkedRecipes: [] },
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
      state.value.bookmarkedRecipes = action.payload.bookmarkedRecipes || [];
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
    setBookmarkedRecipes: (state, action) => {
      state.value.bookmarkedRecipes = action.payload;
    },
    addBookmarkedRecipe: (state, action) => {
      if (!state.value.bookmarkedRecipes.includes(action.payload)) {
        state.value.bookmarkedRecipes.push(action.payload);
      }
    },
    removeBookmarkedRecipe: (state, action) => {
      state.value.bookmarkedRecipes = state.value.bookmarkedRecipes.filter(
        recipeId => recipeId !== action.payload
      );
    },
    toggleBookmarkedRecipe: (state, action) => {
      const recipeId = action.payload;
      const index = state.value.bookmarkedRecipes.indexOf(recipeId);
      if (index > -1) {
        state.value.bookmarkedRecipes.splice(index, 1);
      } else {
        state.value.bookmarkedRecipes.push(recipeId);
      }
    },
  },
});

export const { login, logout, setUsername, setEmail, setProfilePicture, setBio, setBookmarkedRecipes, addBookmarkedRecipe, removeBookmarkedRecipe, toggleBookmarkedRecipe } = userSlice.actions;
export default userSlice.reducer;
