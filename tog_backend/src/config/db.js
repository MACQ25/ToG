// src/config/db.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('✅ MongoDB connected'))
        .catch(err => console.error('❌ Connection error:', err));

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;