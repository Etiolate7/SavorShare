import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, username: null, profile_picture: null, email: null, bio: '', likedRecipes: [], },
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
      state.value.likedRecipes = action.payload.likedRecipes || [];
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
    setLikedRecipes: (state, action) => {
      state.value.likedRecipes = action.payload;
    },
    addLikedRecipe: (state, action) => {
      if (!state.value.likedRecipes.includes(action.payload)) {
        state.value.likedRecipes.push(action.payload);
      }
    },
    removeLikedRecipe: (state, action) => {
      state.value.likedRecipes = state.value.likedRecipes.filter(
        recipeId => recipeId !== action.payload
      );
    },
    toggleLikedRecipe: (state, action) => {
      const recipeId = action.payload;
      const index = state.value.likedRecipes.indexOf(recipeId);
      if (index > -1) {
        state.value.likedRecipes.splice(index, 1);
      } else {
        state.value.likedRecipes.push(recipeId);
      }
    },
  },
});

export const { login, logout, setUsername, setEmail, setProfilePicture, setBio, setLikedRecipes, addLikedRecipe, removeLikedRecipe, toggleLikedRecipe } = userSlice.actions;
export default userSlice.reducer;
