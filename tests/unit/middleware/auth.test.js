const {User} = require('../../../models/user');
const auth =require('../../../middleware/auth');
const mongoose = require('mongoose');
describe('auth middleware', () => {
    it('should populate req.user with the playload of a valid JWT',() => {
    //  const user = {
    //      _id: mongoose.Types.ObjectId().toHexString(),
    //      isAdmin:true,
    //      email:'example03@gmail.com'}
    //     const token  = new User(user).generateAuthToken();
    //  const req = {
    //       header: jest.fn().mockReturnValue(token)
    //  };
    //  const res = {};
    //  const next = jest.fn();
    //  auth(req, res, next); 
    //  expect(req.user).toMatchObject(user);
     });
});