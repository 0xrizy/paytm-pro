const express = require("express");
const authMiddleware = require("../middleware");
const { User, Account } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  if (!userId) {
    return res.status(400).send({ msg: "Please login/signup first" });
  }
  const balanceInfo = await Account.findOne({ userId: userId });
  console.log(balanceInfo);
  if (!balanceInfo) {
    return res.status(400).send({ msg: "User doesnt exist" });
  }
  const balance = balanceInfo.balance;
  console.log(balance);
  res.status(200).send({ msg: "success at fetching msgs", balance });
});

router.post("/transact", authMiddleware, async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  if (!userId) {
    return res.status(404).send({ msg: "UserId doesnt exist" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;
  console.log(amount);
  console.log(to);

  const account = await Account.findOne({ userId: userId }).session(session);

  if (!account) {
    await session.abortTransaction();
    return res.status(404).send({ msg: "Your Account doesnt exist" });
  }
  if (account.balance < amount) {
    await session.abortTransaction();
    return res.status(404).send({ msg: "Insuffiecient funds" });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });


});

module.exports = router;
