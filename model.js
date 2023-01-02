const mongoose = require('mongoose');


const Registeruser = new mongoose.Schema({
    usename:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    }
},{
    timestamps:true,
})
module.exports = mongoose.model('registerusers', Registeruser)

