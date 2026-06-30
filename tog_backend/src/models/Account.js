import { Schema, model } from 'mongoose';

const AccountSchema = new Schema(
    {
        username: String,
        email: String,
        password: String,
    }, 
    { strict: false }
); 

const User = model('account', AccountSchema, 'accounts');

export default User