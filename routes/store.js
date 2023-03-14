const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Store, validate} = require('../models/store');
const {Product} = require('../models/products');
const express = require('express');

const router = express.Router();

router.get('/',auth, async (req, res) => {
  const store = await Store.find().sort('designation');
  res.send(store);
});

router.post('/',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  const product = await Product.findById(req.body.productId);
  if(!product) return res.status(400).send('No product with that given Id');
  if (error) return res.status(400).send(error.details[0].message);
  let store = new Store({ 
      designation: req.body.designation,
      adresse:  req.body.adresse,
      email:  req.body.email,
      phone:  req.body.phone,
      product:{
        _id: product._id
    }
     
    });
  store = await store.save();
  
  res.send(store);
});

router.put('/:id',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const store = await Store.findByIdAndUpdate(req.params.id, { 
    designation: req.body.designation,
    adresse:req.body.adresse,
    email:req.body.email,
    phone:req.body.phone }, {
    new: true
  });

  if (!store) return res.status(404).send('The store with the given ID was not found.');
  
  res.send(store);
});

router.delete('/:id',[auth,admin], async (req, res) => {
  const store = await Store.findByIdAndRemove(req.params.id);

  if (!store) return res.status(404).send('The store with the given ID was not found.');

  res.send(store);
});

router.get('/:id',auth, async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) return res.status(404).send('The store with the given ID was not found.');

  res.send(store);
});

module.exports = router;