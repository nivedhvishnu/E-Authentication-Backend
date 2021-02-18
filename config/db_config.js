var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");

let db_connection = "mongodb://localhost:27017/eauth";

let db_string = "DATABASE";

mongoose = mongoose.createConnection(db_connection, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
}, function (err) {
  if (!err) {
    console.log("==================================== CONNECTED TO " + db_string + "=========================================");
  } else {
    console.log(err);
  }
})

autoIncrement.initialize(mongoose);

module.exports = mongoose;