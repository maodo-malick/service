const request = require('supertest');
const {Product} = require('../../models/products');
const {User} = require('../../models/user');
const mongoose = require('mongoose');


describe('/api/products',()=>{
    beforeEach(()=>{server = require('../../index'); })
    afterEach(async()=>{
        server.close();
    await Product.remove({})
});
    describe('GET /',() => {
        it('should return all products',async () => {
           await Product.collection.insertMany([
                {name:'products 1'},
                {name:'products 2'}
            ])
          const res = await request(server).get('/api/products');
          expect(res.status).toEqual(200);
          expect(res.body.length).toBe(2)
          expect(res.body.some(g =>g.name ==='products 1')).toBeTruthy();
          expect(res.body.some(g =>g.name ==='products 2')).toBeTruthy();
        });
    });
    describe('GET /:id', ()=>{
        it('should return a product if the id is valid',async()=>{
            const product = new Product({name:'products 1'});
            await product.save();
            const res = await request(server).get('/api/products/' + product._id);
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('name', product.name);
        });
        it('should return a 404 error if a invalid  id is passed',async()=>{
            const res = await request(server).get('/api/products/' + 1);
            expect(res.status).toEqual(404);
            
        });
        it('should return a 404 error if no product with the given id exist',async()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/products/' + id);
            expect(res.status).toEqual(404);
            
        });
        });
    describe('POST /',()=>{
        let token;
        let name;
      const exec = async()=>{
        return await request(server)
        .post('/api/products')
        .set('x-auth-token',token)
        .send({name})
      }

      beforeEach(()=>{
         token = new User().generateAuthToken();
         name = 'products 1'
      })

    it('should return 401 if client is not logged',async ()=>{
        token = '';
        const res = await exec()
        expect(res.status).toBe(401);
    });
    it('should return 400 if product is less than 5 characteres',async ()=>{
        name = '1234'
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return  400 if product  is more than 50 characters',async ()=>{
 
        const name = new Array(52).join('a');

        const res = await exec()
       
        expect(res.status).toBe(400);
    });
     it('should save product if it is valid',async ()=>{
      
 
        await exec();
        const product = await Product.find({name:'product 1'});
        expect(product).not.toBeNull();
    });
    it('should save product if it is valid',async ()=>{
 
       const res =  await exec();
       
        // expect(res.body).toHaveProperty('_id');
        // expect(res.body).toHaveProperty('name', 'products 1');
    });

})
        
});
