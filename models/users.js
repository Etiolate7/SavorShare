const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  token: String,
  username: String,
  email: String,
  password: String,
  profile_picture: String,
  bookmarked_recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  created_recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  created: { type: Date, default: Date.now }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
