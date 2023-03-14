const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const productSchema =  new mongoose.Schema(
  {
  name: {
    type: String,
   trim: true,
    minlength: 5,
    maxlength: 255
  },
  category:{
       type: String,
       max: 255
  },
  tag:{
      type: String,
      maxlength:255
  },
  numberInStock:{
      type: Number,
   
      max: 255
  },
  price:{
      type: Number,
  }, 
  image:[{
    data:Buffer,
   contentType: String
  }
  ],
 store:{
    type:Schema.Types.ObjectId,
    ref:'Store'
 },
 owner:{
   type:Schema.Types.ObjectId,
   ref:'User'
 }
},
{timestamps:true}
);
productSchema.virtual('storeProduct',{
  ref:'Store',
  localField:'_id',
  foreignField:'store',
});
productSchema.virtual('userProduct',{
  ref:'User',
  localField:'_id',
  foreignField:'user'
})
productSchema.set('toObject',{virtuals:true});
productSchema.set('toJSON',{virtuals:true});



function validateProduct(product) {
  const schema = {
    name: Joi.string().min(5).max(50),
     category: Joi.string(),
    tag: Joi.string(),
    price: Joi.number(),
    numberInStock: Joi.number(),
      storeId: Joi.objectId(),
       owner: Joi.objectId()
  };

  return Joi.validate(product, schema);
}

exports.Product= mongoose.models.Product || mongoose.model('Product', productSchema);
exports.validate = validateProduct; 
module.exports.productSchema =productSchema
