import { Schema, model } from 'mongoose';

const newsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Image URL
  author: { type: String },
  date: { type: Date, default: Date.now },
});

const News = model('News', newsSchema);

export default News;
