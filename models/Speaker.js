import { Schema, model } from 'mongoose';

const speakerSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
  expertise: { type: String },
  image: { type: String }, // Image URL
});

const Speaker = model('Speaker', speakerSchema);

export default Speaker;
