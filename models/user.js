const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const {Schema}= require('mongoose');


const userSchema =  new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    required: true
  },
  avatar:{
    data:Buffer,
   contentType: String
  },
 isAdmin:{
   type:Boolean,
   default: true
 },
 product:{
     type:Schema.Types.ObjectId,
     ref: "Product"
 }
 

},
{timestamps:true}
);
// userSchema.virtual('userProduct',{
//   ref:'Product',
//   localField:'_id',
//   foreignField:'products',
// });
// userSchema.set('toObject',{virtuals:true});
// userSchema.set('toJSON',{virtuals:true});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id: this._id,email:this.email, isAdmin: this.isAdmin},config.get('jwtPrivateKey'));
  return token;
}
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50),
    email : Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),

  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;