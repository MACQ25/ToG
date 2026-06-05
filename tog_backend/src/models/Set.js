const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({}, { strict: false }); 

const Set = mongoose.model('set', SetSchema, 'sets');