const mongoose = require('mongoose');

const AppointmentScheme = mongoose.Schema({
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    therapist_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now()
    },
    appointmentAt: {
        type: Date,
        required: true
    }
  });
  
  module.exports = mongoose.model("appointment", AppointmentScheme);