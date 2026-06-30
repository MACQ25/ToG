// src/config/db.js
import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI, {
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

export default connectDB;