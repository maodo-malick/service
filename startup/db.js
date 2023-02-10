const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
module.exports = function(){
    mongoose.set('strictQuery', false)
    mongoose.set('strictQuery', true);
    const db = config.get('db');
    mongoose.connect(db)

  .then(() => winston.info(`Connected to ${db}...`))


}