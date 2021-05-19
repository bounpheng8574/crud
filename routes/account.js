var express = require('express');
var router = express.Router();
var async = require('async');


/* GET home page. */
router.get('/', function(req, res, next) {
  var con = req.con;
  async.parallel(
    [
      function(callback) {
       con.query('select * from account', function(errors, accounts){
        callback(errors, accounts);
       }); 
      }
  ],
  function(err, results) {
    var data = {accounts: results[0]};
    res.render('account/index', data);
  }
  ); 
});

// add
router.get('/add', function(req, res, next) {
    res.render('account/add');
});
router.post('/add', function(req, res, next) {
    var con = req.con;
     async.parallel(
    [
      function(callback) {
       con.query('insert into account(username, password, fullName) values(?,?,?)', 
       [req.body.username, req.body.password, req.body.fullName], function(errors, accounts)
       {
        callback(errors);
       }); 
      }
  ],
  function(err, results) {
    res.redirect('/account');
  }
  ); 
});

// Delete
router.get('/delete/:id', function(req, res, next) {
  var con = req.con;
  async.parallel(
    [
      function(callback) {
       con.query('delete from account where id = ?',
       [req.params.id], function(errors, accounts){
        callback(errors, accounts[0]);
       }); 
      }
  ],
  function(err, results) {
    res.redirect('/account');
  }
  ); 
});

// edit
router.get('/edit/:id', function(req, res, next) {
  var con = req.con;
  async.parallel(
    [
      function(callback) {
       con.query('select * from account where id =?', [req.params.id], function(errors, accounts){
        callback(errors, accounts[0]);
       }); 
      }
  ],
  function(err, results) {
    var data = {account: results[0]};
    res.render('account/edit', data);
  }
  ); 
});

// update
router.post('/edit', function(req, res, next) {
    var con = req.con;
     async.parallel(
    [
      function(callback) {
       con.query('select * from account where id = ?', 
       [req.body.id], function(errors, accounts)
       {
        var password = accounts[0].password;
        if(req.body.password != ''){
          password = req.body.password;
        }
         con.query('update account set username = ?, password = ?, fullname = ? where id = ?', 
       [req.body.username, password, req.body.fullName, req.body.id], function(errors, accounts)
       {
        callback(errors);
       });
        
       }); 
      }
  ],
  function(err, results) {
   res.redirect('/account');
  }
  ); 
});

module.exports = router;
