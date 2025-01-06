// Arreglo en memoria para almacenar habilidades
const skills = [];
const db = require('../database');

// Obtener todas las habilidades
const getSkills = (req, res) => {
    db.all('SELECT * FROM skills', [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error al obtener las habilidades', error: err.message });
        } else {
            res.json({ skills: rows });
        }
    });
};
// Agregar una nueva habilidad
const addSkill = (req, res) => {
    const newSkill = req.body.skill;
    if (!newSkill) {
        return res.status(400).json({ message: 'La habilidad no puede estar vacía' });
    }

    // Verificar si la habilidad ya existe
    db.get('SELECT * FROM skills WHERE name = ?', [newSkill], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Error al verificar la habilidad', error: err.message });
        } else if (row) {
            res.status(400).json({ message: 'La habilidad ya existe' });
        } else {
            // Agregar la nueva habilidad
            db.run('INSERT INTO skills (name) VALUES (?)', [newSkill], function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error al agregar la habilidad', error: err.message });
                } else {
                    res.json({ message: `Habilidad '${newSkill}' agregada con éxito`, id: this.lastID });
                }
            });
        }
    });
};

// Editar una habilidad
const editSkill = (req, res) => {
    const skillId = parseInt(req.params.id, 10);
    const newSkill = req.body.skill;

    if (!newSkill) {
        return res.status(400).json({ message: 'La habilidad no puede estar vacía' });
    }

    // Verificar si el ID existe
    db.get('SELECT * FROM skills WHERE id = ?', [skillId], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Error al verificar la habilidad', error: err.message });
        } else if (!row) {
            res.status(404).json({ message: 'Habilidad no encontrada' });
        } else {
            // Actualizar la habilidad
            db.run('UPDATE skills SET name = ? WHERE id = ?', [newSkill, skillId], function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error al editar la habilidad', error: err.message });
                } else {
                    res.json({ message: `Habilidad con ID ${skillId} actualizada a '${newSkill}'` });
                }
            });
        }
    });
};
// Eliminar una habilidad
const deleteSkill = (req, res) => {
    const skillId = parseInt(req.params.id, 10);

    // Verificar si el ID existe
    db.get('SELECT * FROM skills WHERE id = ?', [skillId], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Error al verificar la habilidad', error: err.message });
        } else if (!row) {
            res.status(404).json({ message: 'Habilidad no encontrada' });
        } else {
            // Eliminar la habilidad
            db.run('DELETE FROM skills WHERE id = ?', [skillId], function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error al eliminar la habilidad', error: err.message });
                } else {
                    res.json({ message: `Habilidad con ID ${skillId} eliminada con éxito` });
                }
            });
        }
    });
};

//Exports
module.exports = {
    getSkills,
    addSkill,
    editSkill,
    deleteSkill, 
};