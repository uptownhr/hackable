"use strict"

const router = require('express').Router()
const
  _ = require('lodash'),
  Promise = require('bluebird'),
  multer = require('multer'),
  path = require('path'),
  qs = require('qs'),
  validator = require('validator'),
  models = require('../models')

const upload = multer({ dest: path.join(__dirname, '../public/uploads') })
const User =  models.User
const Post = models.Post
const File = models.File
const Project = models.Project
const Product = models.Product

router.get('/', function (req, res) {
  res.render('admin/overview')
})

router.get('/user', function (req, res) {
  const user = {}
  res.render('admin/user', { user })
})

router.get('/user/:id', function (req, res) {
  User.findOne({ _id: req.params.id }).then(user => {
    res.render('admin/user', { user })
  })
})

router.post('/user', function (req, res) {
  req.assert('email', 'Email is not valid').isEmail();

  if (req.body.confirmPassword || req.body.password) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  }

  const errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    req.flash('errors', errors);
    return res.redirect('/admin/user?' + qs.stringify(req.body));
  }

  const body = req.body;

  const userFields = new Promise( (resolve, reject) => {
    if (body._id.length) {
      User.findOne({ _id: body._id }, function (err, user) {
        user = _.merge(user, req.body);
        resolve(user);
      });
    } else {
      delete body._id; //remove empty id from user
      let user = new User(body);
      resolve(user);
    }
  });
  
  userFields.then(function(user){
    user.save().then(result => {
      req.flash('success', [{ msg: result.profile.name + ' Saved' }])
      res.redirect('/admin/users')
    }).catch(err => {
      handleErr(err);
    });
  }).catch(err => {
    handleErr(err);
  })
  
  const handleErr = err => {
    req.flash('errors', [{ msg: 'Could not save user' }])
    
    //create redirect url for new or existing user
    let url = '/admin/user';

    if (typeof body._id !== "undefined")
      url = url + '/' + body._id;
    
    return res.redirect(url + '?' + qs.stringify(body))
  }
})

router.get('/user/delete/:id', function (req, res) {
  User.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/users')
  })
})

router.get('/users', function (req, res) {

  var query = User.find();
  var param = '';

  if (req.query.search) {
    param = decodeURI(req.query.search);
    var search = { $regex: new RegExp(param, 'i') };

    query.or([
      { email: search },
      { 'profile.name': search }
    ]);
  }

  query.exec(function (err, users) {
    res.render('admin/users', { users, search: param })
  });

})

/**
 * Blog Post Editing
 */

router.get('/posts', function (req, res) {

  var query = Post.find();
  var param = '';

  if (req.query.search) {
    param = decodeURI(req.query.search);

    query.or([{ title:
      { $regex: new RegExp(param, 'i') } }
    ]);
  }

  query.exec(function (err, posts) {
    res.render('admin/posts', { posts, search: param })
  });

})

router.get('/post', function (req, res) {
  const post = {}
  res.render('admin/post', { post })
})

router.get('/post/:id', function (req, res) {
  const id = req.params.id

  Post.findOne({ _id: id }, function (err, post) {
    if (post) return res.render('admin/post', { post })
  })

})

router.post('/post', function (req, res) {
  const body = req.body;
  const userId = req.user._id;
  
  const postFields = new Promise( (resolve, reject) => {
    
    if (body._id.length) {
      Post.findOne({ _id: body._id }, function (err, post) {
        post = _.merge(post, body);
        resolve(post);
      });
    } else {
      delete body._id; //remove empty id from post

      let post = new Post(body);
      post._author = userId;
      resolve(post);
    }
  });
  
  postFields.then(function(post){
    post.save().then(result => {
      req.flash('success', [{ msg: result.title + ' Saved' }])
      res.redirect('/admin/posts')
    }).catch(err => {
      handleErr(err);
    });
  }).catch(err => {
    handleErr(err);
  })
  
  const handleErr = err => {
    req.flash('errors', [{ msg: 'Could not save post' }])
    
    //create redirect url for new or existing user
    let url = '/admin/post';

    if (typeof body._id !== "undefined")
      url = url + '/' + body._id;
    
    return res.redirect(url + '?' + qs.stringify(body))
  }
})

router.get('/post/delete/:id', function (req, res) {
  Post.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/posts')
  })
})

//PROJECT SECTION
// list projects

router.get('/projects', function (req, res) {

  var query = Project.find();
  var param = '';

  if (req.query.search) {
    param = decodeURI(req.query.search);
    var search = { $regex: new RegExp(param, 'i') };

    query.or([
      { name: search },
      { project_url: search }
    ]);
  }

  query.exec(function (err, projects) {
    res.render('admin/projects', { projects, search: param })
  });
})

// new projects
router.get('/project', function (req, res) {
  const project = {}
  res.render('admin/project', { project })
})

// view/edit projects
router.get('/project/:id', function (req, res) {
  const id = req.params.id;
  Project.findOne({ _id: id }, function (err, project) {
    res.render('admin/project', {
      project
    })
  })
})

// add new/edit
router.post('/project', function (req, res) {
  const body = req.body;

  const projectFields = new Promise( (resolve, reject) => {
    
    if (body._id.length) {
      Project.findOne({ _id: body._id }, function (err, project) {
        project = _.merge(project, body);
        resolve(project);
      });
    } else {
      delete body._id; //remove empty id from user

      let project = new Project(body);
      resolve(project);
    }
  });
  
  projectFields.then(function(project){
    project.save().then(result => {
      req.flash('success', [{ msg: result.name + ' Saved' }])
      res.redirect('/admin/projects')
    }).catch(err => {
      handleErr(err);
    });
  }).catch(err => {
    handleErr(err);
  })
  
  const handleErr = err => {
    req.flash('errors', [{ msg: 'Could not save project' }])
    
    //create redirect url for new or existing user
    let url = '/admin/project';

    if (typeof body._id !== "undefined")
      url = url + '/' + body._id;
    
    return res.redirect(url + '?' + qs.stringify(body))
  }
})

router.get('/project/delete/:id', function (req, res) {
  Project.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/projects')
  })
})

// IMAGE DROP FUNCTION

router.post('/images/upload', upload.array('file', 20), function (req, res) {
  
  Promise.map(req.files, file => {
    file = new File(file)
    return file.save().then(file => {
      return file;
    })
  }).then(results => {
    const fileNames = results.map(file => file.originalname).join('<br/>')
    res.send(results)
  }).catch(err => console.log(err))
})

//PRODUCT START
// list products
router.get('/products', function (req, res) {
  var query = Product.find();
  var param = '';
  if (req.query.search) {
    var param = decodeURI(req.query.search);
    var search = { $regex: new RegExp(param, 'i') };
    query.or([
      { name: search }
    ]);
  }

  query.exec(function (err, products) {
    res.render('admin/products', { products, search: param })
  });
})

// new products

router.get('/product', function (req, res) {
  const product = {}
  res.render('admin/product', { product })
})

// view/edit projects
router.get('/product/:id', function (req, res) {
  const id = req.params.id;
  Product.findOne({ _id: id }, function (err, product) {
    res.render('admin/product', {
      product
    })
  })
})

// add new/edit
router.post('/product', function (req, res) {
  const id = req.body._id
  const body = req.body;

  var errors = [];
  if (!validator.isCurrency(body.price))
    errors.push('Price is not valid');

  if (errors.length) {
    req.flash('errors', { msg: errors.join('<br>') });
    return res.redirect('/admin/product/' + id);
  }

  const productFields = new Promise( (resolve, reject) => {
    
    if (body._id.length) {
      Product.findOne({ _id: body._id }, function (err, product) {
        product = _.merge(product, body);
        resolve(product);
      });
    } else {
      delete body._id; //remove empty id from user

      let product = new Product(body);
      resolve(product);
    }
  });
  
  productFields.then(function(product){
    product.save().then(result => {
      req.flash('success', [{ msg: result.name + ' Saved' }])
      res.redirect('/admin/products')
    }).catch(err => {
      handleErr(err);
    });
  }).catch(err => {
    handleErr(err);
  })
  
  const handleErr = err => {
    req.flash('errors', [{ msg: 'Could not save product' }])
    
    //create redirect url for new or existing user
    let url = '/admin/product';

    if (typeof body._id !== "undefined")
      url = url + '/' + body._id;
    
    return res.redirect(url + '?' + qs.stringify(body))
  }
})

router.get('/product/delete/:id', function (req, res) {
  Product.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/products')
  })
});

//PRODUCT END

// file model

//display listings of files
router.get('/files', function (req, res) {
  var query = File.find();
  var param = '';

  if (req.query.search) {
    param = decodeURI(req.query.search);
    var search = { $regex: new RegExp(param, 'i') };

    query.or([
      { originalname: search },
      { filename: search }
    ]);
  }

  query.exec(function (err, files) {
    res.render('admin/files', { files, search: param })
  });
})

//ADD new file model
router.get('/file', function (req, res) {
  res.render('admin/file')
})

//view/edit file model
router.get('/file/:id', function (req, res) {
  const id = req.params.id;

  File.findOne({ _id: id }, function (err, file) {
    res.render('admin/file', {
      file
    })
  })
})

// add new/edit file model
router.post('/file', function (req, res) {
  const body = req.body;
  
  var fileFields = new Promise( (resolve, reject) => {
    
    if (body._id.length) {
      File.findOne({ _id: body._id }, function (err, file) {
        file = _.merge(file, req.body);
        resolve(file);
      });
    } else {
      delete body._id; //remove empty id from user

      let file = new File(body);
      resolve(file);
    }
  });
  
  fileFields.then(function(file){
    file.save().then(result => {
      req.flash('success', [{ msg: file.filename + ' saved' }])
      res.redirect('/admin/files')
    }).catch(err => {
      handleErr(err);
    });
  }).catch(err => {
    handleErr(err);
  })
  
  var handleErr = err => {
    req.flash('errors', [{ msg: 'Could not save file' }])
    
    //create redirect url for new or existing user
    let url = '/admin/file';

    if (typeof body._id !== "undefined")
      url = url + '/' + body._id;
    
    return res.redirect(url + '?' + qs.stringify(body))
  }
})

// update file model
router.post('/file/:id', function (req, res) {
  const id = req.params.id;
  const body = req.body;
  File.findOne({ _id: id }, function (err, file) {
    file.original_name = body.original_name;
    file.encoding = body.encoding;
    file.mimetype = body.mimetype;
    file.destination = body.destination;
    file.filename = body.filename;
    file.path = body.path;
    file.size = body.size;
    file.save(function (err, saved) {
      res.redirect('/admin/files')
    })
  })
})

// remove file model
router.get('/file/delete/:id', function (req, res) {
  File.remove({ _id: req.params.id }, function (err) {
    if (err) {
      req.flash('error', { msg: err.message })
    }else {
      req.flash('success', { msg: 'deleted' })
    }

    return res.redirect('/admin/files')
  })
})

module.exports = router
