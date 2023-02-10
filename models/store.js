const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const{productSchema} = require('./products')
  const Store = mongoose.model('Store', new mongoose.Schema(
    {
    designation: {
      type: String,
       required: true,
      minlength: 5,
      maxlength: 50
    },
    adresse:{
        type: String,
        required: true,
        trim: true
    },
    phone:{
      type: String,
      required: true
    },
    email:{
        type: String,
        required: true,
        trim:true
    },
     product:{
         type:productSchema,
         ref:'Product'
       }
  }));

function validateStore(store) {
  const schema = {
    designation: Joi.string().min(3),
    adresse: Joi.string(),
    productId: Joi.objectId(),
    email: Joi.string().email(),
    phone: Joi.string().regex(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm),
  };

  return Joi.validate(store, schema);
}

exports.Store = Store; 
module.exports.validate = validateStore;