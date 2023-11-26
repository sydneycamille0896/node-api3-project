const Users = require('../users/users-model');
const Posts = require('../posts/posts-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.originalUrl}
    )}`
  );
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await Users.getById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: `user not found`
      })
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: `problem finding user`
    })
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  const { name } = req.body;
  if(!name || !name.trim()){
    res.status(400).json({
      message: `missing required name field`
    })
  } else {
    req.name = name.trim();
    next();
  }


  // try {
  //   // if(name == undefined || typeof name !== 'string' || !name.length || !name.trim().length){
  //   //   next({status: 400, message: `missing required name field`});
  //   // } else {
  //   //   const updatedUser 
  //   // }

  //   if (name !== undefined && typeof name === 'string' && name.length && name.trim().length) {
  //     req.name = name.trim();
  //     next();
  //   } else {
  //     next({ status: 400, message: `missing required name field` });
  //   }
  // } catch (err) {
  //   next(err);
  // }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if(!text || !text.trim()){
    res.status(400).json({
      message: `missing required text field`
    }) 
  } else {
    req.text = text.trim();
    next();
  }

}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}