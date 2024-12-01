const { where } = require('sequelize');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title : title,
    price : price,
    imageUrl : imageUrl,
    description : description
  }).then(()=>{
    res.redirect('/admin/products');
  })
  .catch(err =>{
    console.log(err);
  })
};
exports.getEditProduct = (req, res, next) => {
  const mode = req.query.edit;
  if(!mode){
    res.redirect('/');
  }
  else {
    const prodId = req.params.productId;
    req.user.getProducts({where:{id : prodId}}).then(products => {
      const product = products[0];
      if(!product){
        res.redirect('/');
      }
      else{
        res.render('admin/edit-product', {
          pageTitle: 'Edit-product',
          path:'/admin/edit-product',
          editing : mode,
          product : product
        });
      }}); 

  }
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save();
  }).then(reuslt =>{
    console.log('updated product!');
  }).catch(err => {
    console.log(err);
  });
  res.redirect('/admin/products');

}
exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products =>{
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product =>{
   return  product.destroy();
  }).catch(err => {
    console.log(err);
  });
  res.redirect('/admin/products');
}