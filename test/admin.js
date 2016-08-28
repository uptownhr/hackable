"use strict"
var request = require('supertest'),
  mongoose = require('mongoose'),
  Models = require('../models'),
  User = Models.User,
  Post = Models.Post,
  Project = Models.Project,
  Product = Models.Product,
  File = Models.File,
  chai = require('chai'),
  expect = chai.expect;


var app = require('../index.js').server;

const admin_user = {
  email: 'admin@admin.com',
  password: 'asdfasdf'
}

const sample_user_info = {
  email: 'test@test.com',
  password: 'asdfasdf',
  askEmail: false
}

// for storing session
const admin = request.agent(app);
const adminLoggedIn = function(){
  return new Promise( function(resolve, reject){
    /*create admin login */
    admin
      .post('/auth/login')
      .send(admin_user)
      .expect(302, function(e, res){
        if(e) return reject(e)
        return resolve()
      })
  })
}

describe('Admin', function(){
  /* Test GET requests */
  const sample_user = User(sample_user_info)
  const sample_post = Post({ title: ''})
  const sample_project = Project({name: "gordo", description: "projectFAT" })
  const sample_product = Product({name: "gordo", description: "productFAT" })
  const sample_file = File({mimetype: 'image/png', filename: 'gorod', originalname: "gordo", destination: "fileFAT" })
  
  /* Test POST requests */
  const test_user = { _id : "", email: "post@post.com", password: "postpost", confirmPassword: "postpost"};
  const test_post = { _id : "", title: "Test Post", status: "pending"};
  const test_project = { _id : "", name: "Test Project", description: "project" };
  const test_product = { _id : "", name: "Test Product", price: "1.00" };
  const test_file = { _id : "", originalname: "test", destination: "test_file" };

  before(function(done){
    Promise.all([
      adminLoggedIn(),
      sample_user.save(),
      sample_post.save(),
      sample_project.save(),
      sample_product.save(),
      sample_file.save()
    ]).then(done.bind(null,null)).catch( console.log )
  })

  describe('Admin not logged in', function(){
    it('should return 302 when not admin', function(done){
      request(app)
        .get('/admin/')
        .expect(302, done)
    })

    it('should return 200 with error message Only admins may access the admin page', function(done){
      const user = request.agent(app);

      user.post('/auth/login')
        .send(sample_user_info)
        .expect(302, function(err, res) {
          console.log('wtf', err)
          if(err) return done(err)

          user.get('/admin/users')
            .expect(200, done)
        })

    })
  })

  describe('GET /admin/', function() {
    it('should return 200 OK', function(done) {
      admin
        .get('/admin/')
        .expect(200, done)
    });
  });

  describe('GET /admin/users', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/users')
        .expect(200)
        .then( function(){
          done()
        })
    })
  })

  describe('GET /admin/user', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user')
        .expect(200)
        .then( function(){
          done()
        })
    })
  })

  describe('GET /admin/posts', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/posts')
        .expect(200, done)
    })
  })

  describe('GET /admin/products', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/products')
        .expect(200, done)
    })
  })

  describe('GET /admin/files', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/files')
        .expect(200, done)
    })
  })

  describe('GET /admin/user', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user')
        .expect(200, done)
    })
  })

  describe('GET /admin/user/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/user/' + sample_user._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/post', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/post')
        .expect(200, done)
    })
  })

  describe('GET /admin/post/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/post/' + sample_post._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/project', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/project')
        .expect(200, done)
    })
  })

  describe('GET /admin/project/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/project/' + sample_project._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/product', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/product')
        .expect(200, done)
    })
  })

  describe('GET /admin/product/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/product/' + sample_product._id)
        .expect(200, done)
    })
  })

  describe('GET /admin/file', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/file')
        .expect(200, done)
    })
  })

  describe('GET /admin/file/:id', function(){
    it('should return 200 OK', function(done){
      admin
        .get('/admin/file/' + sample_file._id)
        .expect(200, done)
    })
  })
  
  describe('POST /admin/user', function(){
    
    it('should return 302', function(done){
      admin
        .post('/admin/user')
        .send(test_user)
        .expect(302, done);
    });
    
    it('should create a new user', function(done){
      User.findOne({ email : test_user.email}, function(err, user){
        if (err) return done(err);
        expect(user).to.not.be.null;
        done();
      })
    })
  })
  
  describe('GET /admin/user/delete/:id', function(){
    
    it('should return 302', function(done){
      User.findOne({ email : test_user.email }, function(err, user) {
        var url = '/admin/user/delete/' + user._id;
        admin
          .get(url)
          .expect(302, done)
      });
    });
    
    it('should delete a user', function(done){
      User.findOne({ email : test_user.eail }, function(err,user){
        expect(user).to.be.null;
        done();
      })
    })
  })
  
  describe('POST /admin/post', function(){
    
    it('should return 302', function(done){
      admin
        .post('/admin/post')
        .send(test_post)
        .expect(302, done);
    });
    
    it('should create a new post', function(done){
      Post.findOne({ title : test_post.title}, function(err, post){
        if (err) return done(err);
        expect(post).to.not.be.null;
        done();
      })
    })
  })
  
  describe('GET /admin/post/delete/:id', function(){
    
    it('should return 302', function(done){
      Post.findOne({ title : test_post.title }, function(err, post) {
        var url = '/admin/post/delete/' + post._id;
        admin
          .get(url)
          .expect(302, done)
      });
    });
    
    it('should delete a post', function(done){
      Post.findOne({ title : test_post.title }, function(err,post){
        expect(post).to.be.null;
        done();
      })
    })
  })
  
  describe('POST /admin/project', function(){
    
    it('should return 302', function(done){
      admin
        .post('/admin/project')
        .send(test_project)
        .expect(302, done);
    });
    
    it('should create a new project', function(done){
      Project.findOne({ name : test_project.name}, function(err, project){
        if (err) return done(err);
        expect(project).to.not.be.null;
        done();
      })
    })
  })
  
  describe('GET /admin/project/delete/:id', function(){
    
    it('should return 302', function(done){
      Project.findOne({ name : test_project.name }, function(err, project) {
        var url = '/admin/project/delete/' + project._id;
        admin
          .get(url)
          .expect(302, done)
      });
    });
    
    it('should delete a project', function(done){
      Project.findOne({ title : test_project.name }, function(err,project){
        expect(project).to.be.null;
        done();
      })
    })
  })
  
  describe('POST /admin/product', function(){
    
    it('should return 302', function(done){
      admin
        .post('/admin/product')
        .send(test_product)
        .expect(302, done);
    });
    
    it('should create a new product', function(done){
      Product.findOne({ name : test_product.name}, function(err, product){
        if (err) return done(err);
        expect(product).to.not.be.null;
        done();
      })
    })
  })
  
  describe('GET /admin/product/delete/:id', function(){
    
    it('should return 302', function(done){
      Product.findOne({ name : test_product.name }, function(err, product) {
        var url = '/admin/product/delete/' + product._id;
        admin
          .get(url)
          .expect(302, done)
      });
    });
    
    it('should delete a product', function(done){
      Product.findOne({ name : test_product.name }, function(err,product){
        expect(product).to.be.null;
        done();
      })
    })
  })
  
  describe('GET /admin/file/delete/:id', function(){
    
    it('should return 302', function(done){
      File.findOne({ _id : sample_file._id }, function(err, file) {
        var url = '/admin/file/delete/' + file._id;
        admin
          .get(url)
          .expect(302, done)
      });
    });
    
    it('should delete a file', function(done){
      File.findOne({ _id : sample_file._id }, function(err,file){
        expect(file).to.be.null;
        done();
      })
    })
  })


  after( function(){
    sample_user.remove()
    sample_post.remove()
    sample_project.remove()
    sample_product.remove()
    sample_file.remove()
  })
})
