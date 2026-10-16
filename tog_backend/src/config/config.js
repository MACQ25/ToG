import dotenv from 'dotenv';

dotenv.config({ quiet: true });


export const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOSTNAME || 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGO_URI,
  },
  secrets: {
    jwt: process.env.JWT_SECRET,
  },
};

const requiredVars = ['JWT_SECRET', 'MONGO_URI'];
for (const key of requiredVars) {
  if (!process.env[key]) {
    throw Error(`Missing required environment variable: ${key}`);
  }
}
