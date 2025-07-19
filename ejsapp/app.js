var createError = require('http-errors');
var express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs'); // Import EJS for rendering files

require('dotenv').config();


var indexRouter = require('./routes/index');
var libraryRouter = require('./routes/library');
var usersRouter = require('./routes/employee');
var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/stud');
var roleRouter = require('./routes/roles');


const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');


app.use(session({
  secret: '1f56dccebd87e3c6b505c9f81ce2badf06c54feacb34a1a396b28190c969ecaa',
  resave: false,
  saveUninitialized: false,

  cookie: { secure: false } // ⚠️ Change to true if using HTTPS
}));



app.use((req, res, next) => {
  console.log("🔍 Session Middleware Debug:", req.session);
  next();
});

// View engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/login-pages/'), path.join(__dirname, 'views/dashboards/')]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/library', libraryRouter);
app.use('/employee', usersRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/roles", roleRouter);



// Define the routes
app.get('/admin-dashboard/admin-dash', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  res.render('admin-dash', {
    name: req.session.user.name, // ✅ Get username from session
    body: '<h1>Dashboard Content</h1>'
  });
});


// Employee route
app.get('/admin-dashboard/employee', (req, res) => {
  console.log("Session Data:", req.session.user); // Debugging log ✅
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  res.render('dashboards/admin-dashboard/employee', {
    title: "Admin Dashboard",
    name: req.session.user.name // ✅ Get username from session 
  });
});



// Student route
app.get('/admin-dashboard/student', (req, res) => {
  console.log("Session Data:", req.session.user); // Debugging log ✅
  if (!req.session.user) {
    return res.redirect('admin/login');
  }
  res.render('dashboards/admin-dashboard/student', {
    title: "Student Dashboard",
    name: req.session.user.name
  });
});



// attendence route
app.get('/admin-dashboard/attendence', (req, res) => {
  res.render('dashboards/admin-dashboard/attendence', { title: "Admin Dashboard", name: "Admin" });
});

// fee route
app.get('/admin-dashboard/fee', (req, res) => {
  res.render('dashboards/admin-dashboard/fee', { title: "Admin Dashboard", name: "Admin" });
});

// notice route
app.get('/admin-dashboard/notice', (req, res) => {
  res.render('dashboards/admin-dashboard/notice', { title: "Admin Dashboard", name: "Admin" });
});

// all-employee route
app.get('/admin-dashboard/employee/all-employee', (req, res) => {
  res.render('dashboards/admin-dashboard/employee/all-employee', { title: "Admin Dashboard", name: "Admin" });
});


// add-employee route
app.get('/admin-dashboard/employee/add-employee', (req, res) => {
  res.render('dashboards/admin-dashboard/employee/add-employee', { title: "Admin Dashboard", name: "Admin" });
});

// approve-employee route
app.get('/admin-dashboard/employee/approve-employee', (req, res) => {
  res.render('dashboards/admin-dashboard/employee/approve-employee', { title: "Admin Dashboard", name: "Admin" });
});

// salary-employee route
app.get('/admin-dashboard/employee/salary-employee', (req, res) => {
  res.render('dashboards/admin-dashboard/employee/salary-employee', { title: "Admin Dashboard", name: "Admin" });
});


app.get('/login-pages/employee/emp-job', (req, res) => {
  res.render('login-pages/employee/emp-job', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/admin-dashboard/student/all-students', (req, res) => {
  res.render('dashboards/admin-dashboard/student/all-students', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/admin-dashboard/student/add-student', (req, res) => {
  res.render('dashboards/admin-dashboard/student/add-student', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/admin-dashboard/student/approve-student', (req, res) => {
  res.render('dashboards/admin-dashboard/student/approve-student', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/admin-dashboard/attendence/class-attendence', (req, res) => {
  res.render('dashboards/admin-dashboard/attendence/class-attendence', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/admin-dashboard/attendence/view-attendence', (req, res) => {
  res.render('dashboards/admin-dashboard/attendence/view-attendence', { title: "Admin Dashboard", name: "Admin" });
});



app.get('/dashboards/employee-dash', (req, res) => {
  res.render('dashboards/employee-dash', { title: "Admin Dashboard", name: "hello" });
});

app.get('/employee-dashboard/attendence', (req, res) => {
  res.render('dashboards/employee-dashboard/attendence', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/employee-dashboard/take-attendence', (req, res) => {
  res.render('dashboards/employee-dashboard/take-attendence', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/employee-dashboard/view-attendence', (req, res) => {
  res.render('dashboards/employee-dashboard/view-attendence', { title: "Admin Dashboard", name: "Admin" });
});

app.get('/employee-dashboard/emp-notice', (req, res) => {
  res.render('dashboards/employee-dashboard/emp-notice', { title: "Admin Dashboard", name: "Admin" });
});







router.get('/dashboards/library-dash', (req, res) => {
  console.log("🚀 Library Dashboard Accessed - Session:", req.session);

  if (!req.session.user || req.session.user.role !== 'librarian') {
    return res.status(403).send('Access Denied: You are not a librarian');
  }

  res.render('library-dash', { user: req.session.user });
});


app.get('/dashboards/student-dash', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboards/student-dash', { title: "Student Dashboard", name: req.session.user.name });
});







app.post('/submit-admission', (req, res) => {
  const { firstName, lastName, username, password, course, gender, mobile, email } = req.body;

  // Here, you would typically save this data to a database
  console.log('New admission:', req.body);

  res.redirect('/success'); // Redirect after submission
});

// Attendance submission handling
app.post('/submit-attendance', (req, res) => {

  const attendanceData = req.body; // Assuming you get the attendance data from the form
  console.log('Attendance data:', attendanceData);

  // Process attendance data here

  res.redirect('/attendance-success'); // Redirect after submission
});

app.get('/admin-dashboard/attendence/class-attendence', (req, res) => {
  const query = 'SELECT id, name, course, mobile FROM students';

  database.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.render('dashboards/admin-dashboard/attendence/class-attendence', {
        title: "Class Attendance",
        name: "Admin",
        students: [],
        error: 'Error loading students data'
      });
    } else {
      console.log('Students fetched:', results);
      res.render('dashboards/admin-dashboard/attendence/class-attendence', {
        title: "Class Attendance",
        name: "Admin",
        students: results,
        error: null
      });
    }
  });
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});



// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, () => {
  console.log(`🚀 Server running on port ${5000}`);
});
module.exports = app;