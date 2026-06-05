/** @type {import('mongoose').Model} */
const Account = require("../models/Account")
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Hashing a password
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

// Verifying a password
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.createUserAccount = async (username, email, password) => { 
    const existingUser = await Account.findOne({ email: email });

    const is_new = !existingUser;

    const hashedP = await hashPassword(password)

    return await Account.insertOne( { username, email, hashedP } )
}

exports.loginUserAccount = async (username, password) => {

}