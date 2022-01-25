const mongoose = require('mongoose');

const TimeInterval = mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})

const Slot = mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    intervals: {
      type: [TimeInterval],
      required: true
    }
});


const TherapistScheme = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    availableAt: {
      type: [Slot]
    }
  });
  
  module.exports = mongoose.model("v2therapist", TherapistScheme);