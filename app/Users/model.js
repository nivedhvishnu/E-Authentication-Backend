var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var passportLocalMongoose = require("passport-local-mongoose");
var db = require("../../config/db_config");
var Schema = mongoose.Schema;

var Users = new Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  company: { type: String, required: true },
  role: { type: String },
  hash: { type: String },
  salt: { type: String },
  token: { type: String, default: null },
  reset_token: { type: String, default: null },
  login:{type:Boolean,default:false},
  created_on: { type: Date, default: new Date() }
})

Users.plugin(passportLocalMongoose);
Users.plugin(autoIncrement.plugin, { model: 'Users', field: "id", startAt: 1 });

module.exports = db.model("Users", Users);
