const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
    }, 
    { strict: false }
); 

const User = mongoose.model('account', AccountSchema, 'accounts');