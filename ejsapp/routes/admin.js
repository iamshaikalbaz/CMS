var express = require('express');
var router = express.Router();
var database = require('../db/database')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const studentRouter = require('./stud');





/* GET users listing. */

router.get('/', function (req, res, next) {
  res.render('login-pages/admin-login', { "role": "Admin", "check": "/admin-dashboard/admin-dash", "signup": "/admin/signup" });
});

router.get('/admin', function (req, res, next) {
  res.render('login-pages/admin');
});

router.get('/login', function (req, res, next) {
  res.render('login-pages/admin-login', { "role": "Admin", "check": "/admin/check", "signup": "/admin/signup" });
});

router.get('/signup', function (req, res, next) {
  res.render('login-pages/admin-signup', { "role": "Admin",  "newEndpoint": "/admin/new" });
});

router.get('/applications/all', function (req, res, next) {

  let applicants = [];

  let query =
    `select * from emp_app;`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    res.render('dashboards/admin-dashboard/employee/approve-employee', { applicants: rows });
    console.log(rows);
  });


});

router.get('/employees/all', function (req, res, next) {

  let emps = [];

  let query =
    `select * from employees;`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    res.render('dashboards/admin-dashboard/employee/all-employee', { employees: rows });
    console.log(rows);
  });
});





router.post('/applications', urlencodedParser, function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let mobile = req.body.mobile;
  let email = req.body.email;

  let query =
    `INSERT into emp_app(first_name, last_name, username, password, mobile, email) values('${firstName}', '${lastName}', '${username}', '${password}','${mobile}', '${email}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  
  let fullName = `${firstName} ${lastName}`;

  res.render("partials/message", { 
    name: fullName, 
    message: `<h1>Your application was submitted successfully.</h1> 
              <h3>Our Team is checking your profile</h3>
              <h2>Please wait till our team gets in touch with you</h2>` 
  });
  
  res.status(201).send("Submitted Succesfully");
});


router.post('/stdapplications', urlencodedParser, function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let course = req.body.course;
  let gender = req.body.gender;

  console.log(req.body)

  let query =
    `INSERT into std_app(first_name, last_name, username, password,course, gender, mobile, email) values('${firstName}', '${lastName}', '${username}', '${password}','${course}','${gender}','${mobile}', '${email}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  
  let fullName = `${firstName} ${lastName}`;

res.render("partials/message", { 
  name: fullName, 
  message: `<h1>Your application was submitted successfully.</h1> 
            <h3>Our Team is checking your profile</h3>
            <h2>Please wait till our team gets in touch with you</h2>` 
});

  
  res.status(201).send("Submitted Succesfully");
});



router.post('/employees/hire', urlencodedParser, function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let mobile = req.body.mobile;
  let email = req.body.email;

  let query =
    `INSERT into employees(first_name, last_name, username, password, mobile, email) values('${firstName}', '${lastName}', '${username}', '${password}','${mobile}', '${email}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  res.render('dashboards/admin-dashboard/employee');
  res.status(201).send("Submitted Succesfully");
});


router.get('/employees/hire', function (req, res, next) {
  res.render('dashboards/admin-dashboard/employee/add-employee',{ "submit" : "/admin/employees/hire" });

});

router.post('/application/approve/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;

  // Get the user application
  database.query('SELECT * FROM emp_app WHERE id = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching application');
    }

    if (rows.length === 0) {
      return res.status(404).send('Application not found');
    }

    const user = rows[0];

    // Insert user into employees
    const insertQuery = `INSERT INTO employees(first_name, last_name, username, password, mobile, email) VALUES (?, ?, ?, ?, ?, ?)`;
    database.query(insertQuery, [user.first_name, user.last_name, user.username, user.password, user.mobile, user.email], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting employee');
      }

      // Delete the application from emp_app
      const deleteQuery = `DELETE FROM emp_app WHERE id = ${userId}`;
      database.query(deleteQuery, [userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error deleting application');
        }

        console.log(`Application with ID ${userId} approved.`);
        res.redirect('/admin/employees/all');
      });
    });
  });
});





router.post('/application/reject/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;
  console.log(`Rejecting application with ID: ${userId}`);

  // Delete the user application
  database.query('DELETE FROM emp_app WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error rejecting application');
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).send('Application not found');
    }

    console.log(`Application with ID ${userId} has been rejected.`);
    // Redirect or respond after rejection
    res.redirect('/admin/applications/all'); // Redirect to the applications list page
  });
});





router.get('/stdapplications/all', function (req, res, next) {

  let applicants = [];

  let query =
    `select * from std_app;`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    res.render('dashboards/admin-dashboard/student/approve-student', { applicants: rows });
    console.log(rows);
  });


});

router.get('/students/all', function (req, res, next) {

  let emps = [];

  let query =
    `select * from students;`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    res.render('dashboards/admin-dashboard/student/all-students', { students: rows });
    console.log(rows);
  });
});






router.post('/applications', urlencodedParser, function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let course = req.body.course;
  let gender = req.body.gender;
  let mobile = req.body.mobile;
  let email = req.body.email;

  let query =
    `INSERT into std_app(first_name, last_name, username, password, course, gender, mobile, email) values('${firstName}', '${lastName}', '${username}', '${password}','${course}','${gender}','${mobile}', '${email}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  res.render("partials/message", { "name": firstName, "message": "<h1>Your application was submitted successfully.</h1> <h1>Please till our team gets in touch with you</h1>" })
  res.status(201).send("Submitted Succesfully");
});




router.post('/students/save', urlencodedParser, function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let group = req.body.group;
  let gender = req.body.gender;
  let mobile = req.body.mobile;
  let email = req.body.email;
console.log (req.body)
  let query =
    `INSERT into students(first_name, last_name, username, course, gender,password, mobile, email) values('${firstName}', '${lastName}', '${username}', '${group}','${gender}', '${password}','${mobile}', '${email}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  res.redirect('/admin-dashboard/student');
  res.status(201).send("Submitted Succesfully");
});


router.get('/students/add', function (req, res, next) {
  res.render('dashboards/admin-dashboard/student/add-student',{ "submit" : "/admin/students/save" });

});


router.post('/stdapplication/approve/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;

  // Get the user application
  database.query('SELECT * FROM std_app WHERE id = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching application');
    }

    if (rows.length === 0) {
      return res.status(404).send('Application not found');
    }

    const user = rows[0];
    console.log(user)

    // Insert user into employees
    const insertQuery = `INSERT INTO students(first_name, last_name, username, password, course, gender, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    database.query(insertQuery, [user.first_name, user.last_name, user.username, user.password, user.course, user.gender, user.mobile, user.email], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting student');
      }

      // Delete the application from emp_app
      const deleteQuery = `DELETE FROM std_app WHERE id = ?`;
      database.query(deleteQuery, [userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error deleting application');
        }

        console.log(`Application with ID ${userId} approved.`);
        res.redirect('/admin/students/all');
      });
    });
  });
});





router.post('/stdapplication/reject/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;
  console.log(`Rejecting application with ID: ${userId}`);

  // Delete the user application
  database.query('DELETE FROM std_app WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error rejecting application');
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).send('Application not found');
    }

    console.log(`Application with ID ${userId} has been rejected.`);
    // Redirect or respond after rejection
    res.redirect('/admin/stdapplications/all'); // Redirect to the applications list page
  });
});

router.post('/application/delete/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;
  console.log(`Attempting to delete application with ID: ${userId}`);

  database.query('DELETE FROM employees WHERE id = ?', [userId], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error deleting application');
      }

      if (result.affectedRows === 0) {
          console.log(`No application found with ID: ${userId}`);
          return res.status(404).send('Application not found');
      }

      console.log(`Application with ID ${userId} has been deleted.`);
      res.redirect('/admin/employees/all');
  });
});



router.post('/stdapplication/delete/:id', urlencodedParser, function (req, res) {
  const userId = req.params.id;
  console.log(`Attempting to delete application with ID: ${userId}`);

  database.query('DELETE FROM students WHERE id = ?', [userId], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error deleting application');
      }

      if (result.affectedRows === 0) {
          console.log(`No application found with ID: ${userId}`);
          return res.status(404).send('Application not found');
      }

      console.log(`Application with ID ${userId} has been deleted.`);
      res.redirect('/admin/students/all');
  });
});


  
// Attendance route
router.get('/admin-dashboard/attendence/:className-class-attendence', (req, res) => {
  const className = req.params.className; // This will capture "bca", "bba", etc.

  // Fetch relevant attendance data if needed
  // const attendanceData = fetchAttendanceData(className); // Example function

  res.render('dashboards/admin-dashboard/class-attendence', { className: className });
});


router.post('/new', urlencodedParser, function (req, res, next) {
  // let name = req.body.name;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;


  let query =
    `INSERT into employee values('${firstName + " " + lastName}', '${username}', '${password}');`;

  database.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render('login-pages/admin-login', { "role": "Admin", "check": "/admin/check", "signup": "/admin/signup" })
  });
})


function getAllMessages() {
    // Replace this with your actual logic to fetch messages
    const messages = ['Message 1', 'Message 2']; // Example messages



    return messages;
}


router.post('/check', urlencodedParser, function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  database.query(`SELECT * FROM employee WHERE username = ?`, [username], function (err, result, fields) {
    if (err) throw err;

    if (result.length > 0) {
      let user = result[0];

      if (user.username === username && user.password === password) {
        req.session.user = { name: user.name }; // ✅ Store username in session
        console.log("User Stored in Session:", req.session.user); // Debugging log ✅
        
        return res.redirect('/admin-dashboard/admin-dash'); // ✅ Redirect after setting session
      } else {
        return res.status(404).send('Invalid credentials');
      }
    } else {
      return res.status(404).send('Invalid credentials');
    }
  });
});





// Initialize employee count
let employeeCount = 0; // Mock data for employee count

// POST route to add an employee
router.post('/add-employee', (req, res) => {
    // Logic to add the employee to your database goes here
    employeeCount++; // Increment the employee count
    res.redirect('/admin-dashboard/admin-dash'); // Redirect to the dashboard
});

// GET route to render the admin dashboard
router.get('/admin-dashboard/admin-dash', (req, res) => {
    res.render('dashboards/admin-dash', {
        name: 'Admin',           // Pass the admin's name
        employeeCount: employeeCount, // Pass the employee count
        messages: getAllMessages()
    });
});



// Route for the admin dashboard
router.get('/admin-dashboard/admin-dash', (req, res) => {
  res.render('dashboards/admin-dash', {
      name: 'Admin',
      employeeCount: 0,
      messages: getAllMessages() // Ensure messages is defined here
  });
});


// After form submission
let messages = [];
messages.push("Your application was submitted successfully.");
 


const session = require('express-session');

// Initialize session middleware
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Handle the notice submission
router.post('/notice', urlencodedParser, (req, res) => {
    const message = req.body.Message;
    if (!req.session.messages) {
        req.session.messages = [];
    }
    req.session.messages.push(message);
    res.redirect('/admin-dashboard/admin-dash'); // Redirect to the dashboard
});



// Assuming you have a route to fetch attendance for a specific class
router.get('/attendence/class-attendence/:group', (req, res) => {
  const group = req.params.className;
  
  // Query to get students based on the class name
  const query = 'SELECT name FROM students WHERE group = ?';
  
  database.query(query, [group], (err, results) => {
      if (err) {
          console.error('Error fetching students:', err);
          return res.status(500).send('Error fetching students');
      }
      
      // Render the EJS template with the list of students
      res.render('dashboards/admin-dashboard/attendence/class-attendence', { students: results, group });
  });
});



// Use the student router
router.use('/stud', studentRouter);




let students = []; // This should ideally come from your database

// Route to render the admin dashboard
router.get('/admin-dash', (req, res) => {
    // Calculate total and pending students
    const totalStudents = students.length; // This should come from your actual student data
    const pendingStudents = students.filter(s => s.status === 'pending').length;

    // Render the dashboard and pass the counts to the view
    res.render('dashboards/admin-dash', {
        name: req.user.name, // Assuming req.user.name contains the admin's name
        studentCount: totalStudents,
        pendingCount: pendingStudents
    });
});





router.get('/signup', function (req, res, next) {
  res.render('login-pages/admin');



});

module.exports = router;
