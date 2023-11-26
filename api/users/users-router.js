const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware.js');
const Posts = require('../posts/posts-model');
const Users = require('../users/users-model');
const router = express.Router();



// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required



router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const newUser = await Users.insert(req.body);
  try {
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', [validateUserId, validateUser], async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedUser = await Users.update(id, { name });
    res.status(200).json(updatedUser);
    
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  try {
    const userToDelete = await Users.getById(id);
    await Users.remove(id);
    res.status(200).json(userToDelete);
  } catch(err){
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const userPosts = await Users.getUserPosts(req.params.id);
  try{
    res.status(200).json(userPosts);
  } catch(err){
    next(err);
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.user);
  console.log(req.text);

  try {
    const newPost = await Posts.insert({
      user_id: req.params.id,
      text: req.text
    });
    console.log(newPost);
    res.status(201).json(newPost);
  } catch(err){
    next(err);
  }
});

// error handling
router.use((error,req,res,next) => {
  res.status(error.status || 500).json({
    message: error.message
  });
});

// do not forget to export the router

module.exports = router;