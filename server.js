const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Appointment = require("./appointment");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.post("/appointment", async (req,res)=>{

try{
console.log("Received appointment:", req.body);
const appointment =
new Appointment(req.body);
console.log("Received appointment22:", req.body);
await appointment.save();
console.log("saved appointment:");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

console.log("transporter created");

await transporter.sendMail({
from:process.env.EMAIL,
to:process.env.EMAIL,
subject:"New Appointment Received",
text:`
New Appointment Received

Name: ${req.body.name}
Phone: ${req.body.phone}
Pet Type: ${req.body.petType}
Date: ${req.body.date}
Message: ${req.body.message}
`
});
// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);
// await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: "petcanine75@gmail.com",
//   subject: "New Appointment",
//   text: "Appointment received"
// });
// console.log("mail sent:");

res.json({
message:"Appointment saved "
});
console.log("Appointment saved response sent");

}catch(err){

console.log(err);

res.status(500).json({
message:"Error saving appointment"
});
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// app.listen(5000,
// ()=>console.log("Server running on port 5000"));