// load environment variables from .env
require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cms',
  port: process.env.DB_PORT || 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    return;
  }
  console.log('✅ Connected to database successfully');
  
  // optional: test query
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) throw err;
    console.log('📝 Database test query result:', results[0].solution);
  });
});

module.exports = connection;
