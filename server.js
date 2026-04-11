const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Appointment = require("./appointment");
const app = express();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
console.log("Email transporter created");

app.use(cors({
  origin: "https://caninepetnandveterinaryclinic.netlify.app"
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.get("/", (req, res) => { 
  res.send("Server is running!");
});
app.post("/appointment", async (req,res)=>{
try{

const appointment = new Appointment(req.body);
await appointment.save();

res.json({ message:"Appointment saved "});

console.log("GMAIL_EMAIL value:", process.env.GMAIL_EMAIL);
console.log("saved appointment:");

transporter.sendMail({
  from: process.env.GMAIL_EMAIL,
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
}).then(() => {
  console.log("Email sent successfully");
}).catch((err) => {
  console.error("Email error code:", err.code);
  console.error("Email error message:", err.message);
  console.error("Email error response:", err.response);
});
console.log("transporter:");}

catch(err){
console.log(err);

res.status(500).json({ message:"Error saving appointment", error: err.message });}});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));