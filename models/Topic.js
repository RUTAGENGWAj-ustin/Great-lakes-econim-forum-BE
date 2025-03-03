const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
