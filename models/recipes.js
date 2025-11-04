const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  name: String,
  serving_size: Number,
  time: String,
  picture: String,
  type_of_dish: {
    type: String,
    enum: ['Main', 'Appetizer', 'Dessert', 'Side', 'Breakfast', 'Beverage'],
    default: 'Main'
  },
  nationality: {
    type: String,
    enum: ['European', 'Asian', 'North American', 'South American', 'African', 'Oceanian', 'Middle Eastern', 'Other'],
    default: 'Other'
  },
  ingredients: [{ name: String, quantity: String }],
  instructions: [String],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  created: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('recipes', recipeSchema);

module.exports = Recipe;
