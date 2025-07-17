var express = require('express');
var router = express.Router();
var database = require('../db/database');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login-pages/admin-login', {"role": "Library", "check": "/library/check"});
});

router.get('/login', function(req, res, next) {
    res.render('login-pages/admin-login', {"role": "Library", "check": "/library/check", "signup": "/library/signup"});
  });

router.get('/signup', function(req, res, next) {
  res.render('login-pages/admin-signup', {"role": "Librarian", "newEndpoint": "/library/new"});
});



router.post('/new', urlencodedParser, function(req, res, next) {
  // let name = req.body.name;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;


  let query =  
  `INSERT into employee values('${firstName + " " + lastName}', '${username}', '${password}');`; 
    
      database.query(query, (err, rows) => { 
          if(err) throw err; 
          console.log(rows); 
          res.render('login-pages/admin-login', {"role": "Library", "check": "/library/check", "signup": "/library/signup"})
      }); 
    

    
})
  
router.post('/check', urlencodedParser, function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  database.query(`SELECT * FROM employee WHERE username = ?`, [username], function(err, result, fields) {
    if (err) throw err;

    if (result.length > 0) {
      // Access the first row of the result
      let user = result[0];
      console.log(result);
      
      // Check if the username and password match
      if (user.username === username && user.password === password) {
        res.render('dashboards/library-dash', {name : user.name});
      } else {
        res.status(404).send('invalid');
      }
    } else {
      res.status(404).send('invalid');
    }
  });
});

module.exports = router;
