const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require("dotenv").config();

const Appointment = require('./models/appointment');
const Therapist = require('./models/therapist');

const sendMail = require('./utils/email')

const app = express();

//MIDDLEWARE TO TRANSFER DATA
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));

//routes

app.use('/api/users',require('./routes/users.js'))


//v3
app.post('/api/therapists',(req,res) => {
  var newTherapist = new Therapist(req.body);
  newTherapist.save(function (err) {
    if (err) console.log(err);

  });
})

//v2 get therapists
app.get('/api/therapists',(req,res) => {
  Therapist.find()
  .then((data) => res.json(data))
})

//v2 get one therapist
app.get('/api/therapists/:email',(req,res) => {
  Therapist.findOne({email: req.params.email})
  .then((data) => res.json(data))
})

//v2 get available therapists DATE
app.get('/api/therapists/available-on/:date',(req,res) => {
  Therapist.find()
  .then(therapists => {
    availableTherapists = therapists.filter(therapist => {
      doesDateMatch = therapist.availableAt.find( slot => {
        dateIso = slot.date.toISOString().slice(0,10);
        return dateIso === req.params.date;
      })
      if(doesDateMatch){
        return true
      }
      return false
    })
    console.log(availableTherapists);
    res.json(availableTherapists)
  })
})

//v3
app.get('/api/therapists/available-on/:date',(req,res) => {
  Therapist.find()
  .then(therapists => {
    availableTherapists = therapists.filter(therapist => {
      doesDateMatch = therapist.availableAt.find( slot => {
        dateIso = slot.date.toISOString().slice(0,10);
        return dateIso === req.params.date;
      })
      if(doesDateMatch){
        return true
      }
      return false
    })
    console.log(availableTherapists);
    res.json(availableTherapists)
  })
})

//v2 update therapists
app.put('/api/therapists',(req,res) => {
  console.log(req.body.email);
  Therapist.findOneAndUpdate(
    {email: req.body.email},
    req.body,
   { upsert: true }
  )
  .then(result => {
    console.log(result)
   })
  .catch(error => console.error(error))
})

//v2 book an appointment
app.post('/api/appointment',async (req,res) => {
  const newAppointment = new Appointment(req.body);
  newAppointment.save(function (err) {
    if (err) console.log(err);
  });
  Therapist.findById(req.body.therapist_id)
  .then(doc => {
    const mailOptions = {
      from: 'Your Friend <joanjeremiah@gmail.com>',
      to: doc.email,
      subject: 'A therapy session has been booked with you.',
      text: `${req.body.user_name} has booked a 1 hour tharapy session with you on ${new Date(req.body.appointmentAt).toDateString()}`,
      html: `<p>${req.body.user_name} has booked a 1 hour tharapy session with you on ${new Date(req.body.appointmentAt).toDateString()}</p>`,
    };

    sendMail(mailOptions)
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));
  })
  const mailOptions = {
    from: 'Your Friend <joanjeremiah@gmail.com>',
    to: req.body.user_email,
    subject: 'Therapy session from your friend',
    text: `You have successfully booked a 1 hour therapy session from us on ${new Date(req.body.appointmentAt).toDateString()}`,
    html: `<p>You have successfully booked a 1 hour therapy session from us on <b>${new Date(req.body.appointmentAt).toDateString()}</b></p>`,
  };
  
  sendMail(mailOptions)
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));

  Appointment.aggregate([
    {
      $lookup:
      {
      from: "therapists",
      localField: "therapist_id",
      foreignField: "_id",
      as: "therapists"
      }
    },
    {
      $unwind: "$therapists",
    }
  ])
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
})


//CONSTANTS
const PORT = process.env.PORT || 5000;


//CONNECTION WITH MONGOOSE DB AND LISTENING TO PORT
mongoose
  .connect(process.env.CONNECTION_PORT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
