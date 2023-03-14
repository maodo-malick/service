const { Product } = require('../../models/products');
const {User} = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
describe('/api/returns',() => {
    let server;
    let product;
    let token;
    beforeEach(async()=>{
    server = require('../../index');
    token = new User().generateAuthToken();
    const storeId = mongoose.Types.ObjectId().toHexString();
     product = new Product({
        name:'12345',
        category:'12345',
        tag:'12345',
        numberInStock:5,
        price:'5000',
        image:'12345',
        store:{
           _id: storeId,
           designation: '12345',
           adresse:'12345',
           phone:'12345',
           email:'example01@gmail.com'
        }
    });
    await product.save();
 
 })
    afterEach(async()=>{
       await server.close();
       await Product.remove({})
});
// it('should work!',async() =>{
//    const result =  await Product.findById(product._id);
//    expect(result).not.toBeNull();
// });
it('should return 401 if client is not logged in', async() => {
   const res = await  request(server)
   .post('api/returns')
    .send({product});
    expect(res.status).toBe(401);
});
it('should return 400 if no store id is provided', async() => {
   const user = new User().generateAuthToken();
   const res = await  request(server)
   .post('api/returns')
   .set('x-auth-token',token)
    .send({product});
    expect(res.status).toBe(400);
});
});