require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  const connectionString = process.env.DATABASE_URL;
  const dbName = connectionString.split('/').pop();
  const client = new Client({
    connectionString: connectionString.replace(`/${dbName}`, '/postgres')
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;