const config = require('config');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateAuthToken',()=>{
    it('should return a valid JWT',()=>{
        const playload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
             email:"example01@gmail.com",
              isAdmin: true}
    const user = new User(playload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(playload);

    });
    
});