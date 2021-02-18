var Users = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "SECRET";
var request = require('request');
var node = require("../../config/emailConfig");


let userController = {};


userController.login = async (req, res, next) => {
  try {
    if (!req.query || !req.query.name || !req.query.password) {
      return res.status(400).send({ message: "Missing Fields" })
    }
    let user = await Users.findOne({
      $or: [{ email: req.query.name }, { username: req.query.name }],
    }).select({ id: 1, name: 1, hash: 1, token: 1, company: 1, email: 1, username: 1, role: 1 ,reset_token:1});
    if (!user)
      return res.status(204).send({ message: "User Not Found" });
    let password = req.query.password, hash = user.hash
    bcrypt.compare(password, hash).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          username: user.username,
          company: user.company,
          email: user.email,
          role: user.role,
        };
        jwt.sign(payload, secret, { expiresIn: 1000 * 360 }, (err, token) => {
          if (err)
            throw err
            var otp = Math.floor(1000 + Math.random() * 9000);
          user['token'] = token
          user['reset_token']=otp;
          payload['reset_token']=otp;
          let predicate = { $or: [{ email: req.query.name }, { username: req.query.name }], },
            update = { $set: user },
            options = { multi: false, strict: true };
          Users.update(predicate, update, options, (err, updated) => {
            if (err)
              throw err;
            if (updated.nModified > 0)
              console.log("TOKEN UPDATED")
          })
          return res.status(200).send({
            success: true,
            token: "bearer " + token,
            userData: payload,
          });
        })
      } else {
        return res.status(400).send({ message: "Incorrect password" });
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went Wrong" });
  }
}

userController.logout=(req,res,next)=>{
  console.log(req.query)
  if(req.query.id&&req.query.id.length){
    Users.findOne({reset_token:req.params.id}).then(user=>{
      if(user){
        Users.updateOne({ reset_token: req.query.id }, { $set: { login: false } }, { multi: false, strict: true }).then(resp=>{
          return res.status(200).send({success:true});
        })
      }else{
        return res.status(401).send({success:false});
      }
    })
  }
}

userController.addUser = (req, res) => {
  console.log(req.body)
  if (!(req.body.name && req.body.email && req.body.username && req.body.password && req.body.company)) {
    return res.status(400).send({ message: "Missing Requied Fields" });
  } else {
    Users.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    }).select({ id: 1 }).then(user => {
      if (user)
        return res.status(400).send({ message: "User already exists" });
      let newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        company: req.body.company,
        token: null
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err)
            throw err;
          newUser.hash = hash;
          newUser.salt = salt;
          newUser.save().then(user => {
            res.status(200).send(user)
          }).catch(error => {
            console.log(error);
            return res.status(500).send({ message: "Error While registering" })
          })
        })
      })
    }).catch(error => {
      console.log(error)
      return res.status(500).send({ message: "Error Occured While Registering User" })
    })
  }
}


userController.validateOtp=(req,res,next)=>{
  console.log(req.query)
  Users.findOne({
    $or: [{ email: req.query.email }, { username: req.query.username }],
  }).select({ reset_token: 1,login:1 }).then(user => {
    console.log(user)
    if ((user.reset_token==req.query.otp)||user.login)
      return res.status(200).send({ login:true });
    else
      return res.status(400).send({ message:"Invalid OTP" });
  }).catch(error => {
    console.log(error)
    return res.status(500).send({ message: "Error Occured While Validating OTP" })
  })
}

userController.sendOtp=(req,res,next)=>{
  Users.findOne({
    $or: [{ email: req.query.email }, { username: req.query.username }],
  }).select({ reset_token: 1 }).then(user => {
    node(user.reset_token,req.query.email);
    return res.status(200).send({message:"Email has been sent!!"})
  }).catch(error => {
    console.log(error)
    return res.status(500).send({ message: "Error Occured While Validating OTP" })
  })
}

userController.verifyId=(req,res,next)=>{
  console.log("VERIFY")
  if(req.params.id&&req.params.id.length){
    Users.findOne({reset_token:req.params.id}).then(user=>{
      if(user){
        Users.updateOne({ reset_token: req.params.id }, { $set: { login: true } }, { multi: false, strict: true }).then(resp=>{
          return res.status(200).send({success:true});
        })
      }else{
        return res.status(401).send({success:false});
      }
    })
  }
}

module.exports = userController;

