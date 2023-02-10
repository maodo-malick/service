const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Product, validate} = require('../models/products');
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();


router.get('/', asyncMiddleware(async (req, res) => {
  
    const products = await Product.find().sort('name');
    res.send(products);
}));

const Storage = multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb) =>{
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: Storage
}).single('testImage');
//  [auth, admin]
router.post('/',[auth,admin], asyncMiddleware(async (req, res) => {
   const { error } = validate(req.body); 
   if (error) return res.status(400).send(error.details[0].message);
  upload (req,res,(err)=>{
    if (err)  return res.status(400).send(err.details[0].message);
       let product = new Product({
        name: req.body.name,
        category: req.body.category,
        tag: req.body.tag,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        image:{
          data: req.file.filename,
          contentType:'image/png'
        }
      })
      product.save()
    
      res.send(product);
  })
}));
//[auth,admin]
router.put('/:id',[auth,admin], asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(req.params.id, {
     name: req.body.name,
     category: req.body.category,
     tag: req.body.tag,
     price: req.body.price,
     numberInStock: req.body.numberInStock,
     }, {
    new: true
  });

  if (!product) return res.status(404).send('The product with the given ID was not found.');
  
  res.send(product);
}));

router.delete('/:id',[auth,admin], asyncMiddleware(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
}));

router.get('/:id',validateObjectId, asyncMiddleware(async (req, res) => {
if (!mongoose.Types.ObjectId.isValid(req.params.id))
return res.status(404).send('Invalid ID ');
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
}));

module.exports = router;