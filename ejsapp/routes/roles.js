
var express = require('express');
var router = express.Router();

const users = [
    { id: 1, role: 'Admin', img: 'admin.png', login: '/admin/login', signup: '/admin/signup', signupText: "Signup"},
    { id: 2, role: 'Employee', img: 'employee.png', login: '/employee/login', signup: '/employee/signup', signupText: "Apply for job" },
    { id: 3,role: 'Student', img: 'stud.png',  login: '/student/login', signup: '/student/signup' ,  signupText: "Admission"},
    { id: 4,role: 'Librarian', img: 'libraryl-removebg-preview.png',  login: '/library/login', signup: '/library/signup',  signupText: "Signup"},
];



/* GET users listing. */




router.get('/', function(req, res, next) {
  res.render('roles', {users});
});

router.get('/:id', function(req, res, next) {

  var userId = req.params.id;
  userId = userId -1;
  
  const user = users[userId];

    
    if (user) {
        res.render('login-pages/role-template', { user });
    } else {
        res.status(404).send('User not found');
  }
})



module.exports = router;
