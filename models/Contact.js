//models/Contact.js

let mongoose = require('mongoose');

// DB Schema
let contactSchema = mongoose.Schema({
    name : {type:String, required: true, unique:true},
    email : {type:String},
    phone : {type:String}
});

//DB에 있는 'contact'라는 컬렉션을 Contact 변수에 연결 시켜주는 역할
let Contact = mongoose.model('contact',contactSchema);

module.exports = Contact;