const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    Email: String,
    password: String,
    Organization: String,
})

const User = new mongoose.model("User", userSchema)

module.exports = User