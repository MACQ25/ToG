import { Schema, model } from 'mongoose';

const SetSchema = new Schema({}, { strict: false }); 

const SetModel = model('set', SetSchema, 'sets');

export default SetModel