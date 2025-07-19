const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'cms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// optional: test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('✅ Connected to database successfully');

    // test query
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
      connection.release(); // release back to pool
      if (err) throw err;
      console.log('📝 Database test query result:', results[0].solution);
    });
  }
});

module.exports = pool.promise(); // export promise-based pool for async/await
