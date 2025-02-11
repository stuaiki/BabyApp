import mysql from "mysql2/promise";

// Create a connection to your database
const pool = mysql.createPool({
  host: process.env.DB_HOST, // e.g., "your-rds-endpoint.amazonaws.com"
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Function to insert data into the database
const storeTemperatureData = async (seat_id, temperature, user_id) => {
  try {
    const query = `
            INSERT INTO temperature (seat_id, temperature, user_id)
            VALUES (?, ?, ?)
        `;
    const [result] = await pool.execute(query, [seat_id, temperature, user_id]);
    console.log("Data inserted successfully:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};
