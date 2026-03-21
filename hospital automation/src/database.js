const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDatabase() {
    const db = await open({
        filename: './hospital_advanced.db',
        driver: sqlite3.Database
    });

    // Create tables for the advanced system
    await db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT UNIQUE,
            age INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id_str TEXT UNIQUE,
            patient_phone TEXT,
            patient_name TEXT,
            doctor_name TEXT,
            department TEXT,
            appointment_date TEXT,
            appointment_time TEXT,
            status TEXT DEFAULT 'CONFIRMED',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS emergency_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emergency_id_str TEXT UNIQUE,
            patient_name TEXT,
            patient_phone TEXT,
            report_paths TEXT, -- JSON array of file paths
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
            phone TEXT PRIMARY KEY,
            state TEXT,
            data TEXT -- JSON string for session variables
        );
    `);

    return db;
}

module.exports = { setupDatabase };
