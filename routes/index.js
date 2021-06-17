var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const checkValidation = require('../services/checkValidation')
var con = checkValidation.connectDB()


// Login API
router.post('/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password;


  var getQuery = "select * from `user` where `username`=?";
  var query = mysql.format(getQuery, username);
  con.query(query, function (err, result) {
    try {
      if (err) throw err;
      else
        if (result.length > 0) {
          let datapass = result[0].password;
          let data_id = result[0].id;
          let roll = result[0].rolltypeid;

          if (bcrypt.compareSync(password, datapass)) {

            var token = jwt.sign({ uid: data_id, rolltype: roll }, 'loginToken');
            console.log("token==>", token);
            // localStorage.setItem('userToken', token);
            // localStorage.setItem('loginUser', username);

            res.send({ title: 'Login', result: token, message: "Login Successfully", code: 200 });
          }
          else {
            res.send({ title: 'Login', result: false, message: "Your Username OR Password are Wrong.", code: 404 });
          }
        }
        else {
          res.send({ title: 'Login', result: false, message: "Your Username OR Password are Wrong.", code: 404 });
        }
    } catch (error) {
      res.send({ title: 'Login', result: false, message: "Your Username OR Password are Wrong.", code: 500 });

    }
  });
});


function checkUsername(req, res, next) {
  var username = req.body.uname;

  var query = "select * from `user` where `username`=?";
  var getQuery = mysql.format(query, [username]);
  con.query(getQuery, function (err, result) {

    if (err) throw err;
    if (result.length > 0)
      res.send({ title: 'singup', result: false, success: "Username already exist. Try with diff UserName." });
    else
      next();
  });
}

function checkEmail(req, res, next) {
  var email = req.body.email;
  var query = "select * from `user` where `email`=?";
  var getQuery = mysql.format(query, [email]);
  con.query(getQuery, function (err, result) {

    if (err) throw err;
    if (result.length > 0)
      res.send({ title: 'singup', result: false, success: "Email already exist. Try with diff UserName." });
    else
      next();
  });
}

// Singup API
router.post('/singup', checkUsername, checkEmail, function (req, res, next) {

  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var conpassword = req.body.conpassword;
  var rolltype = req.body.rolltypeid;

  if (password != conpassword) {
    res.send({ title: 'Register', success: "Password Must be same", code: 404 })
  }
  else {

    password = bcrypt.hashSync(req.body.password, 10)

    var insertQuery = 'insert into `user` (`username`,`email`,`password`, rolltypeid) VALUES (?,?,?,?)';

    var query = mysql.format(insertQuery, [username, email, password, rolltype]);
    con.query(query, function (err, response) {
      if (err) throw err;
      else
        res.send({ title: 'Register', result: true, message: 'User Register Successfully', code: 201 });
    });
  }

});


module.exports = router;
