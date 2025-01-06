const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
const db = new sqlite3.Database('./skills.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conexión con SQLite establecida.');
    }
});

// Crear la tabla si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla skills creada o ya existe.');
        }
    });
});


db.serialize(() => {
    // Crear tabla de microskills
    db.run(`
        CREATE TABLE IF NOT EXISTS microskills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level INTEGER NOT NULL CHECK(level BETWEEN 1 AND 4),
            skill_id INTEGER NOT NULL,
            FOREIGN KEY (skill_id) REFERENCES skills(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear la tabla de microskills:', err.message);
        } else {
            console.log('Tabla microskills creada o ya existe.');
        }
    });
});

module.exports = db;