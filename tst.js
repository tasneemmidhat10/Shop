const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');
console.log(p);
const op = {'name': 'tasneem'}
fs.write(p, JSON.stringify(op), (err)=>{
    console.log(err);
});