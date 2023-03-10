const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user'); 
const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const Storage = multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb) =>{
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: Storage
}).single('userImage');

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});
router.post('/customer', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email:req.body.email})
    if (error) return res.status(400).send('User Already Registered.');

   user = new User(_.pick(req.body,['name','email','password']));
   const salt= await bcrypt.genSalt(10);
   user.password = await bcrypt.hash (user.password, salt);
   user.isAdmin = false;
  user = await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id','name','email']) ); 
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email:req.body.email})
    if (error) return res.status(400).send('User Already Registered.');

   user = new User(_.pick(req.body,['name','email','password']));
   const salt= await bcrypt.genSalt(10);
   user.password = await bcrypt.hash (user.password, salt);
  user = await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id','name','email']) ); 
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  upload (req,res,(err)=>{
    const user =  User.findByIdAndUpdate(req.params.id,
      { 
        avatar:{ 
          data: req.file.filename,
          contentType:'image/png'
        },
      }, { new: true });
        
      if (!user) return res.status(404).send('A user with the given ID was not found.');
      res.send(user);
      })
  })

 

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('A user with the given ID was not found.');

  res.send(_.pick(user,['_id','name','email']));
});

router.get('/me',auth, async (req, res) => {
  const user = await (await User.findById(req.users._id)).select('-password');
  res.send(user);
}); 

module.exports = router; 