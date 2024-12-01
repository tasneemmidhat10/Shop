const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const Cartitem = require('./models/cart-item');
const Order = require('./models/order');
const Orderitem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { FORCE } = require('sequelize/lib/index-hints');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{
    User.findByPk(1).then(user =>{
        req.user = user;
        next();
    }
    ).catch(err =>{
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through : Cartitem});
Product.belongsToMany(Cart, {through: Cartitem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: Orderitem});


sequelize.sync().then((result) => {
    return User.findByPk(1)
}).then(user => {
    if(!user){
        return User.create({name: 'Tasneem', email:'tas@test.com'});
    }
    else{
        return Promise.resolve(user);
    }
}).then((user) =>{
    user.createCart();
}).then(cart =>{
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});

