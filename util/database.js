const Sequelize = require('sequelize');
const sequelize = new Sequelize('complete-node', 'root', 'VICTUS123_tasneem', {dialect:'mysql', host:'localhost'});

module.exports = sequelize;