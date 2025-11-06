var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const DEFAULT_PROFILE_PICTURE = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const PSEUDO_REGEX = /^[A-Za-z0-9]+$/;

  console.log(req.body.username.length)
  if (req.body.username.length <= 15) {
    if (EMAIL_REGEX.test(req.body.email)) {
      if (PSEUDO_REGEX.test(req.body.username)) {
        if (req.body.password === req.body.passwordverif) {


          User.findOne({
            $or: [
              { username: req.body.username },
              { email: req.body.email }
            ]
          }).then(data => {
            if (data === null) {
              const hash = bcrypt.hashSync(req.body.password, 10);
              const newToken = uid2(32);
              const newUser = new User({
                token: newToken,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                profile_picture: DEFAULT_PROFILE_PICTURE,
                bio: "Write a bio!",
                bookmarked_recipes: [],
                created_recipes: [],
                created: new Date(),
              });

              newUser.save().then(data => {
                res.json({ result: true, token: newToken, username: data.username, email: req.body.email, profile_picture: DEFAULT_PROFILE_PICTURE });
              });

            } else {
              res.json({ result: false, error: 'User already registered' });
            }
          });
        } else {
          res.json({ result: false, error: 'Password not valid' });

        }
      } else {
        res.json({ result: false, error: 'Username not valid' });

      }

    } else {
      res.json({ result: false, error: 'Email not valid' });

    }
  } else {
    res.json({ result: false, error: 'Username too long' });

  }

});


router.post('/connection', (req, res) => {
  const newToken = uid2(32);

  if (!checkBody(req.body, ['username', 'password'])) {
    return res.json({ result: false, error: 'Missing or empty fields' });
  }

  User.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.username }
    ]
  })
    .then(data => {
      if (!data) {
        return res.json({ result: false, error: 'User not found' });
      }

      if (!bcrypt.compareSync(req.body.password, data.password)) {
        return res.json({ result: false, error: 'Password incorrect' });
      }


      return User.updateOne(
        { _id: data._id },
        { token: newToken }
      ).then(() => {
        return res.json({
          result: true,
          token: newToken,
          username: data.username,
          email: data.email,
          profile_picture: data.profile_picture,
          bio: data.bio || "Write a bio!",
        });
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ result: false, error: 'Server error' });
    });
});


router.put('/changeusername/:token', (req, res) => {
  if (!checkBody(req.body, ['username'])) {
    res.json({ result: false, error: 'Missing or empty username field' });
    return;
  }

  const PSEUDO_REGEX = /^[A-Za-z0-9]+$/;

  if (!PSEUDO_REGEX.test(req.body.username)) {
    res.json({ result: false, error: 'Username not valid' });
    return;
  }

  if (req.body.username.length > 15) {
    res.json({ result: false, error: 'Username too long' });
    return;
  }

  User.findOne({ username: req.body.username }).then(existingUser => {
    if (existingUser) {
      res.json({ result: false, error: 'Username already taken' });
      return;
    }

    User.updateOne(
      { token: req.params.token },
      { $set: { username: req.body.username } }
    ).then(data => {
      if (data.modifiedCount > 0) {
        res.json({ result: true, message: 'Username updated successfully' });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    }).catch(error => {
      console.error('Update error:', error);
      res.json({ result: false, error: 'Database error' });
    });
  }).catch(error => {
    console.error('Find user error:', error);
    res.json({ result: false, error: 'Database error' });
  });
});


router.put('/changeemail/:token', (req, res) => {
  if (!checkBody(req.body, ['email'])) {
    res.json({ result: false, error: 'Missing or empty email field' });
    return;
  }

  User.findOne({ email: req.body.email }).then(existingEmail => {
    if (existingEmail) {
      res.json({ result: false, error: 'Email already taken' });
      return;
    }

    User.updateOne(
      { token: req.params.token },
      { $set: { email: req.body.email } }
    ).then(data => {
      if (data.modifiedCount > 0) {
        res.json({ result: true, message: 'Email updated successfully' });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    }).catch(error => {
      res.json({ result: false, error: error });
    });
  }).catch(error => {
    res.json({ result: false, error: error });
  });
});


router.put('/changepassword/:token', (req, res) => {
  if (!checkBody(req.body, ['password'])) {
    res.json({ result: false, error: 'Missing or empty password field' });
    return;
  }

  const bcrypt = require('bcrypt');
  const hash = bcrypt.hashSync(req.body.newpassword, 10);

  User.findOne({ token: req.params.token })
    .then(data => {

      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        User.updateOne(
          { token: req.params.token },
          { $set: { password: hash } }
        ).then(data => {
          if (data.modifiedCount > 0) {
            res.json({ result: true, message: 'Password updated successfully' });
          } else {
            res.json({ result: false, error: 'User not found' });
          }
        }).catch(error => {
          res.json({ result: false, error: error });
        });
      } else {
        res.json({ result: false, error: 'Password not good' });
      }
    });
});

router.put('/changebio/:token', (req, res) => {
  if (!checkBody(req.body, ['bio'])) {
    res.json({ result: false, error: 'Missing or empty bio field' });
    return;
  }

  if (req.body.bio.length > 500) {
    res.json({ result: false, error: 'Bio too long' });
    return;
  }

  User.updateOne(
    { token: req.params.token },
    { $set: { bio: req.body.bio } }
  )
    .then(data => {
      if (data.modifiedCount > 0) {
        res.json({ result: true, message: 'Bio updated successfully' });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Bio update error:', error);
      res.json({ result: false, error: 'Database error' });
    });
});

router.put('/changepicture/:token', (req, res) => {
  if (!checkBody(req.body, ['profile_picture'])) {
    res.json({ result: false, error: 'Missing or empty profile picture field' });
    return;
  }

  if (req.body.profile_picture.length > 1000) {
    res.json({ result: false, error: 'Profile picture URL too long' });
    return;
  }

  User.updateOne(
    { token: req.params.token },
    { $set: { profile_picture: req.body.profile_picture } }
  )
    .then(data => {
      if (data.modifiedCount > 0) {
        res.json({ result: true, message: 'Profile picture updated successfully' });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Profile picture update error:', error);
      res.json({ result: false, error: 'Database error' });
    });
});


module.exports = router;
