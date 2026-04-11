require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Appointment = require("./appointment");
const app = express();

app.use(cors({
  origin: "https://caninepetnandveterinaryclinic.netlify.app"
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.get("/", (req, res) => {  //test route to check if server is running
  res.send("Server is running!");
});
app.post("/appointment", async (req,res)=>{

try{
console.log("Received appointment:", req.body);
const appointment =
new Appointment(req.body);
console.log("Received appointment22:", req.body);
await appointment.save();
console.log("saved appointment:");



const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
}); 
await transporter.sendMail({
  from: process.env.BREVO_EMAIL,
  to: "petcanine75@gmail.com",
  subject: "New Appointment Received",
  text: `
New Appointment Received

Name: ${req.body.name}
Phone: ${req.body.phone}
Pet Type: ${req.body.petType}
Date: ${req.body.date}
Message: ${req.body.message}
  `
});  
// console.log("STEP 1: before transporter");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_EMAIL,
//     pass: process.env.BREVO_SMTP_KEY
//   }
// });

// console.log("STEP 2: transporter created");

res.json({
message:"Appointment saved "
});
console.log("Appointment saved response sent");

}catch(err){

console.log(err);

res.status(500).json({
message:"Error saving appointment",
error: err.message 
});
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// app.listen(5000,
// ()=>console.log("Server running on port 5000"));