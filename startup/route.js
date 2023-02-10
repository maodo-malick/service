const auth = require('../routes/auth');
const products = require('../routes/products');
const users = require('../routes/user');
const store = require('../routes/store');
const express = require('express');
const error = require('../middleware/error');
module.exports =  function (app){
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/store', store);
    app.use('/api/user', users);
    app.use('/api/products', products);
    app.use(error);
}