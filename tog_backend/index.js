import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './src/config/db.js';
import { apiRouter } from './src/routes/routes.js';
import cookieParser from 'cookie-parser'
import { config } from './src/config/config.js';
import 'axios'

const app = express();

app.use(
  cors(
    {
      origin: 'http://localhost:4200',
      credentials: true
    }
  )
);
app.use(json());
app.use(cookieParser())
connectDB();              

app.get('/', (req, res) => {
  res.send('Hello from Express + Node!');
});

/*
const SetSchema = new mongoose.Schema({}, { strict: false }); 
const Set = mongoose.model('set', SetSchema, 'sets');

app.get('/api/bsets', async (req, res) => {
  try {
    const sets = await Set.find(
      {
        $and: [
          {"data.type": { $in: [ "expansion", "core", "masters" ] }}, 
          {"data.isForeignOnly": { $ne: true }},
          {"data.isOnlineOnly": { $ne: true }}
        ]
      }, 
      {data: {code: 1, name:1, block:1, type:1, releaseDate:1, tcgplayerGroupId:1 }}
    ).sort({"data.releaseDate": 1});
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

app.use('/', apiRouter)


app.listen(config.port, () => {
  console.log('Server running on port 3000');
});