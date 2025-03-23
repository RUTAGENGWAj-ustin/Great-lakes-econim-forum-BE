import { Schema, model } from 'mongoose';

const sponsorSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String }, // Logo image URL
  website: { type: String },
  description: { type: String },
});

const Sponsor = model('Sponsor', sponsorSchema);

export default Sponsor;
