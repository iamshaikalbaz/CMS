var express = require('express');
var router = express.Router();
var database = require('../db/database');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false})







/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login-pages/admin-login', {"role": "Student", "check": "/student/check", "signup": "/student/signup"});
});

router.get('/login', function(req, res, next) {
  res.render('login-pages/admin-login', {"role": "Student", "check": "/student/check", "signup": "/student/signup"});
});



// router.get('/signup', function(req, res, next) {
//   res.render('login-pages/student/adm-form', {"submit": "/student/login"});
// });

router.get('/signup', function(req, res, next) {
  res.render('login-pages/student/adm-form',{"submit": "/admin/stdapplications"});
});

router.get('/afterlogin', function(req, res, next) {
  res.render('login-pages/employee/emp-afterlogin',{"submit": "/employee/afterlogin"});
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
          res.render('login-pages/admin-login', {"role": "Student", "check": "/student/check", "signup": "/student/signup"})
      }); 
    

    
})


router.post('/submit-admission', (req, res) => {
  const { firstName, lastName, username, password, course, gender, mobile } = req.body;
  const fullName = `${firstName} ${lastName}`;

  const insertQuery = `INSERT INTO employees(first_name, last_name, username, password, mobile, email) VALUES (?, ?, ?, ?, ?, ?)`;
  database.query(insertQuery, [user.first_name, user.last_name, user.username, user.password, user.mobile, user.email], (err) => {
    if (err) {
      console.error('Error inserting student:', err);
      res.status(500).send('Error submitting admission form');
    } else {
      console.log('Student added successfully:', result);
      res.redirect('/admin-dashboard/attendence/class-attendence');
    }
  });
});


router.get('/applications', async (req, res) => {
  try {
    const [students] = await database.promise().query(
      `SELECT username, mobile, email, course FROM std_app WHERE username = ?`, 
      [req.user.username]
    );

    if (students.length === 0) {
      return res.status(404).send("Student not found");
    }

    const studentData = students[0]; // Extract the first result

    console.log("Student Data:", studentData); // Debugging log

    res.render('dashboards/student-dash', { 
      username: studentData.username || 'N/A',
      mobile: studentData.mobile || 'N/A',
      email: studentData.email || 'N/A',
      course: studentData.course || 'N/A'
    });

  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).send('Server Error');
  }
});







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
        res.render('dashboards/student-dash', {name : user.name });
      } else {
        res.status(404).send('invalid');
      }
    } else {
      res.status(404).send('invalid');
    }
  });
});


// Example array to store students (replace with a database in production)
let students = [];

// Route to handle student submission
router.post('/submit', (req, res) => {
    const { firstName, lastName, username, password, course, gender, mobile, email } = req.body;

    // Store the student data with status 'pending'
    students.push({ 
        firstName, 
        lastName, 
        username, 
        password, 
        course, 
        gender, 
        mobile, 
        email,
        status: 'pending' // Set initial status to 'pending'
    });

    // Redirect to the admin dashboard
    res.redirect('/admin-dashboard/admin-dash');
});

// Route to get counts of students
router.get('/count', (req, res) => {
    const totalStudents = students.length;
    const pendingStudents = students.filter(student => student.status === 'pending').length;

    res.json({ total: totalStudents, pending: pendingStudents });
});

module.exports = router;
