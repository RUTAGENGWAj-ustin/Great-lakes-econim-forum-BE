import { Schema, model } from 'mongoose';

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Topic = model('Topic', topicSchema);

export default Topic;
