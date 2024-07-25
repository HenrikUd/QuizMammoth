const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  answers: [{
    type: String
}]
  });


const Answer = mongoose.model('Answer', answerSchema);

module.exports =  Answer;
