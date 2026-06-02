const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());              

app.get('/', (req, res) => {
  res.send('Hello from Express + Node!');
});


mongoose.connect('mongodb://localhost:27017/mtgdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Connection error:', err));


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


app.listen(3000, () => {
  console.log('Server running on port 3000');
});