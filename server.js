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


const transporter =
nodemailer.createTransport({

service:"gmail",

auth:{
user:process.env.EMAIL,
pass:process.env.EMAIL_PASS
}

});


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

res.json({
message:"Appointment saved"
});

}catch(err){

console.log(err);

res.status(500).json({
message:"Error saving appointment"
});

}

});

app.listen(5000,
()=>console.log("Server running on port 5000"));