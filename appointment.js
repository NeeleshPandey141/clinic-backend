const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

name: String,
phone: String,
email: String,
petType: String,
date: String,
message: String,

createdAt: {
type: Date,
default: Date.now
}

});

module.exports =
mongoose.model("Appointment",
appointmentSchema);