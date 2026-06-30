import { Schema, model } from 'mongoose';

const SetSchema = new Schema({}, { strict: false }); 

const Set = model('set', SetSchema, 'sets');