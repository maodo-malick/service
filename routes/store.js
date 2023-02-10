const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Store, validate} = require('../models/store');
const express = require('express');
const { Product } = require('../models/Products');
const router = express.Router();

router.get('/',auth, async (req, res) => {
  const stores = await Store.find().sort('name');
  res.send(stores);
});

router.post('/',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.body.productId);
    if(!product) return res.status(400).send('No product with that given Id');
  
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