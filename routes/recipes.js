const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/users');


router.get('/all', (req, res) => {
  Recipe.find()
    .populate('creator', 'username profile_picture')
    .then(recipes => {
      res.json({ result: true, recipes });
    })
    .catch(err => {
      console.error(err);
      res.json({ result: false, message: 'Error fetching recipes' });
    });
});

router.post('/add/:token', (req, res) => {
  User.findOne({ token: req.params.token })
    .then(user => {
      if (!user) {
        return res.json({ result: false, message: 'User not found' });
      }

      const newRecipe = new Recipe({
        name: req.body.name,
        serving_size: req.body.serving_size,
        time: req.body.time,
        picture: req.body.picture,
        type_of_dish: req.body.type_of_dish,
        nationality: req.body.nationality,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        creator: user._id,
      });

      newRecipe.save()
        .then(recipe => {
          res.json({ result: true, recipe });
        })
        .catch(err => {
          console.error(err);
          res.json({ result: false, message: 'Error saving recipe' });
        });
    })
    .catch(err => {
      console.error(err);
      res.json({ result: false, message: 'Database error' });
    });
});


router.put('/modify/:token/:id', (req, res) => {
  User.findOne({ token: req.params.token })
    .then(user => {
      if (!user) {
        return res.json({ result: false, message: 'User not found' });
      }

      Recipe.findById(req.params.id)
        .then(recipe => {
          if (!recipe) {
            return res.json({ result: false, message: 'Recipe not found' });
          }

          if (recipe.creator.toString() !== user._id.toString()) {
            return res.json({ result: false, message: 'Unauthorized to edit this recipe' });
          }

          const updates = req.body;
          Object.assign(recipe, updates);

          recipe.save()
            .then(updated => {
              res.json({ result: true, recipe: updated });
            })
            .catch(err => {
              console.error(err);
              res.json({ result: false, message: 'Error updating recipe' });
            });
        })
        .catch(err => {
          console.error(err);
          res.json({ result: false, message: 'Error finding recipe' });
        });
    })
    .catch(err => {
      console.error(err);
      res.json({ result: false, message: 'Database error' });
    });
});


router.delete('/delete/:token/:id', (req, res) => {
  User.findOne({ token: req.params.token })
    .then(user => {
      if (!user) {
        return res.json({ result: false, message: 'User not found' });
      }

      Recipe.findById(req.params.id)
        .then(recipe => {
          if (!recipe) {
            return res.json({ result: false, message: 'Recipe not found' });
          }

          if (recipe.creator.toString() !== user._id.toString()) {
            return res.json({ result: false, message: 'Unauthorized to delete this recipe' });
          }

          Recipe.deleteOne({ _id: req.params.id })
            .then(() => res.json({ result: true, message: 'Recipe deleted successfully' }))
            .catch(err => {
              console.error(err);
              res.json({ result: false, message: 'Error deleting recipe' });
            });
        })
        .catch(err => {
          console.error(err);
          res.json({ result: false, message: 'Error finding recipe' });
        });
    })
    .catch(err => {
      console.error(err);
      res.json({ result: false, message: 'Database error' });
    });
});



module.exports = router;

