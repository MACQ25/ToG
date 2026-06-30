import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
import connectDB from './src/config/db.js';
import { config } from 'dotenv';
import { apiRouter } from './src/routes/routes.js';

config({path: ".env"});

app.use(cors());
app.use(json());
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


app.listen(3000, () => {
  console.log('Server running on port 3000');
});