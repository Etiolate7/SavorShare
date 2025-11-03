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


          User.findOne({ username: req.body.username } || { email: req.body.email }).then(data => {
            if (data === null) {
              const hash = bcrypt.hashSync(req.body.password, 10);
              const newToken = uid2(32);
              const newUser = new User({
                token: newToken,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                profile_picture: DEFAULT_PROFILE_PICTURE,
                bookmarked_recipes: [],
                created_recipes: [],
                created: new Date(),
              });

              newUser.save().then(data => {
                res.json({ result: true, token: newToken, username: data.username });
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
          profile_picture: data.profile_picture
        });
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ result: false, error: 'Server error' });
    });
});



module.exports = router;
