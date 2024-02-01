const mongoose = require("mongoose");

const User = new mongoose.Schema({
    email: String,
    password: String,
    fName: String,
    lName: String
});

const Account = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    balance: Number
});

const UserModel = mongoose.model("User", User);
const AccountModel = mongoose.model("Account", Account);

module.exports = {
    User: UserModel,
    Account: AccountModel
};
