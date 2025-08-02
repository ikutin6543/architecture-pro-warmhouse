const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
});

const insertTelemetryValue = (id, value) => {
    return pool.query(
        'INSERT INTO telemetry ("sensorId", value) VALUES ($1, $2)',
        [id, parseFloat(value)]
    );
}

// Создаем таблицу telemetry если она не существует
async function initializeDatabase() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id SERIAL PRIMARY KEY,
        "sensorId" VARCHAR(50) NOT NULL,
        value FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "idx_sensorId" ON telemetry("sensorId");
    `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

const getAllSensors = () => {
    return pool.query(
        'SELECT * FROM sensors'
    ).then(q=>q.rows);
}

module.exports = {
    pool,
    insertTelemetryValue,
    getAllSensors,
    initializeDatabase
};