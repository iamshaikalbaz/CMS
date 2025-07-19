var db = require('../db/database');

async function registerEmployee({ firstName, lastName, username, password, mobile, email }) {
  const [result] = await db.query(
    `INSERT INTO employees (first_name, last_name, username, password, mobile, email) VALUES (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, username, password, mobile, email]
  );
  return result.insertId;
}

async function registerStudent({ firstName, lastName, username, password, course, gender, mobile, email }) {
  const [result] = await db.query(
    `INSERT INTO students (first_name, last_name, username, password, course, gender, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, username, password, course, gender, mobile, email]
  );
  return result.insertId;
}

module.exports = {
  registerEmployee,
  registerStudent,
};
