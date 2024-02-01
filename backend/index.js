const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bodyparser = require('body-parser')


const User = require("./db");
const router1 = require("./routes/index");
const userRouter = require("./routes/user");
const authMiddleware= require("./middleware")

require("dotenv").config();

const URL = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use("/api/v1", router1);

app.get("/check",authMiddleware, (req,res)=>{
  const userIdFromMiddleware = req.userId

  res.send({msg:"Check Success", userIdFromMiddleware})
})

app.listen(3000, () => {
  mongoose.connect(URL).then(() => {
    console.log("DB Connected Successfully!");
  });
});
