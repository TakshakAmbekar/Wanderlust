const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  //username, hash and salt is already provided by the passport-local-mongoose package
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = Model("User", userSchema);
