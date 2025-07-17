var express = require('express');
var router = express.Router();
var database = require('../db/database');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login-pages/admin-login', {"role": "Employee", "check": "/employee/check", "signup": "/employee/signup"});
});

router.get('/login', function(req, res, next) {
  res.render('login-pages/admin-login', {"role": "Employee", "check": "/employee/check", "signup": "/employee/signup"});
});

router.get('/signup', function(req, res, next) {
  res.render('login-pages/employee/emp-job',{"submit": "/admin/applications"});
});

router.get('/afterlogin', function(req, res, next) {
  res.render('login-pages/employee/emp-afterlogin',{"submit": "/employee/afterlogin"});
});






// Simulated database (you may want to replace this with actual database logic)
let employees = [];

// Route to handle the form submission
router.post('/apply-job', (req, res) => {
    const { firstName, lastName, username, password, mobile, email } = req.body;
    
    // Save the employee data (you can replace this with a database call)
    employees.push({ firstName, lastName, username, password, mobile, email });
    
    // Redirect to the dashboard with the latest employee info
    res.render('dashboards/employee-dashboard/emp-dashboard', {
        name: `${firstName} ${lastName}`,
        mobile: mobile,
        email: email,
        salary: "Not Set" // Or fetch from a database if applicable
    });
});








// router.post('/applications', urlencodedParser, function(req, res, next) {
//   let firstName = req.body.firstName;
//   let lastName = req.body.lastName;
//   let username = req.body.username;
//   let password = req.body.password;
//   let mobile = req.body.mobile;
//   let salary = req.body.salary;
//   console.log(req.body)



// });



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
          res.render('login-pages/admin-login', {"role": "Admin", "check": "/admin/check", "signup": "/admin/signup"})
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
        res.render('dashboards/employee-dash', {name : user.name, id: user.id});
      } else {
        res.status(404).send('invalid');
      }
    } else {
      res.status(404).send('invalid');
    }
  });
});




router.get('/employee-dashboard/attendence/:id', function (req, res) {
  const userId = req.params.id;

  database.query(`SELECT * FROM employee WHERE id = ?`, [userId], function(err, result, fields) {
    if (err) throw err;

    if (result.length > 0) {
      // Access the first row of the result
      let user = result[0];
      console.log(result);
        res.render('dashboards/employee-dash', {name : user.name, id: user.id});
    } else {
      res.status(404).send('invalid');
    }
  });



    
});







module.exports = router;
