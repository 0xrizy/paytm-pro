// backend/routes/user.js
const express = require("express");
const { User, Account } = require("../db");
const router = express.Router();
const z = require("zod");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");

require("dotenv").config();
const JWTsecret = process.env.JWT_SECRET;
const userSchema = z.object({
  fName: z.string().min(2, { message: "Minimum 2 characters needed" }),
  lName: z.string(),
  email: z
    .string()
    .min(5, { message: "Minimum 5 characters needed" })
    .email("Please enter a valid email abc@xyz.com"),
  password: z.string().min(4, { message: "Minimum 5 characters needed" }),
});

router.post("/signup", async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send({ msg: result.error });
  }

  const newUser = await User.findOne({ email: req.body.email });
  if (!newUser) {
    try {
      const newUserData = await User.create({
        email: req.body.email,
        password: req.body.password,
        fName: req.body.fName,
        lName: req.body.lName,
      });
      const userId = newUserData._id;
      const token = jwt.sign({ userId }, JWTsecret, { expiresIn: "24h" });
      const bal = Math.random() * 10000;
      const accountBalance = await Account.create({
        userId: userId,
        balance: bal,
      });
      console.log(accountBalance);
      res.status(200).send({
        msg: "User " + req.body.fName + " Signup Success!",
        userId: newUserData._id,
        token: token,
        accountBalance: accountBalance,
      });
    } catch (error) {
      console.log(error);
      res.status(411).send({ msg: "Error in saving data", error });
    }
  } else {
    res.status(411).send({
      msg: "User " + req.body.fName + " Already Exists, Please SignIn",
    });
  }
});

const userLoginSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Minimum 5 characters needed" })
    .email("Please enter a valid email abc@xyz.com"),
  password: z.string().min(4, { message: "Minimum 5 characters needed" }),
});

router.post("/signin", async (req, res) => {
  const result = userLoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(404).send({ msg: "Parsing Failed:" + result.error });
  }

  const existingUser = await User.findOne({ email: req.body.email });
  console.log(existingUser);

  if (!existingUser._id) {
    return res.status(411).send({ msg: "Please Signup First!" });
  }

  if (
    existingUser.email !== req.body.email ||
    existingUser.password !== req.body.password
  ) {
    return res.status(411).send({ msg: "Wrong Credentials" });
  }
  const userId = existingUser._id;
  const token = jwt.sign({ userId }, JWTsecret, { expiresIn: "1d" });
  res.status(200).send({
    msg: "Login Success for " + existingUser.fName + "!",
    token: token,
  });
});

router.put("/", authMiddleware, async (req, res) => {
  userIdFM = req.userId;
  console.log(userIdFM);
  if (!userIdFM) res.status(411).send({ msg: "Invalid Token" });
  console.log(userIdFM);
  console.log(req.body);
  const { password, fName, lName } = req.body;

  const userFromDB = await User.findOne({ _id: userIdFM });
  const newUserPassword = password || userFromDB.password;
  const newUserfirstName = fName || userFromDB.fName;
  const newUserlastName = lName || userFromDB.lName;

  const newUser = await User.updateOne(
    { _id: userIdFM },
    {
      password: newUserPassword,
      fName: newUserfirstName,
      lName: newUserlastName,
    }
  );
  console.log(newUser);

  res.status(200).send({ msg: "Successfully Updated ", newUser });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.fName;
  console.log(filter);

  await User.find({ fName: filter }, { fName: 1, lName: 1, _id: 1 }).then(function (
    users
  ) {
    const userArray = users.map((user) => ({
      fName: user.fName,
      lName: user.lName,
      _id: user._id,
    }));

    res.status(200).send({ userArray });
  });
});

router.get('/profile',authMiddleware, async(req,res)=>{
  const userId = req.userId
  const user = await User.findOne({_id:userId})
  res.status(200).send({user})
  
})

module.exports = router;
