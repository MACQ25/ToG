/** @type {import('mongoose').Model} */
import User from "../models/Account.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const saltRounds = 10;

// Hashing a password
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

// Verifying a password
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function createUserAccount(username, email, password) { 

    const existingUser = await User.findOne({ email: email });

    const is_new = !existingUser;

    const hashedP = await hashPassword(password)


    return await User.insertOne( { username, email, password: hashedP } )
}

export async function loginUserAccount(email, password) {
    const existingUser = await User.findOne({ email: email });

    const login = await verifyPassword(password, existingUser.password)

    if(login) {
      const userPayload = {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email
      };

      const jToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { code: 200, message: "successful loggon", payload: { user: userPayload, token: jToken }}
    } 
    else {
      return { code: 401, message: "Invalid credentials", payload: {} }
    }

}