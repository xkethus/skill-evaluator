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
};// Listar microskills por skill
const getMicroskills = (req, res) => {
    const skillId = parseInt(req.params.skillId, 10);

    db.all('SELECT * FROM microskills WHERE skill_id = ?', [skillId], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error al obtener los microskills', error: err.message });
        } else {
            res.json({ microskills: rows });
        }
    });
};

// Agregar microskill
const addMicroskill = (req, res) => {
    const skillId = parseInt(req.params.skillId, 10);
    const { name, level } = req.body;

    if (!name || !level || level < 1 || level > 4) {
        return res.status(400).json({ message: 'Nombre o nivel inválido. El nivel debe estar entre 1 y 4.' });
    }

    db.run('INSERT INTO microskills (name, level, skill_id) VALUES (?, ?, ?)', [name, level, skillId], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al agregar el microskill', error: err.message });
        } else {
            res.json({ message: `Microskill '${name}' agregado con éxito`, id: this.lastID });
        }
    });
};

// Editar microskill
const editMicroskill = (req, res) => {
    const microskillId = parseInt(req.params.id, 10);
    const { name, level } = req.body;

    if (!name || !level || level < 1 || level > 4) {
        return res.status(400).json({ message: 'Nombre o nivel inválido. El nivel debe estar entre 1 y 4.' });
    }

    db.run('UPDATE microskills SET name = ?, level = ? WHERE id = ?', [name, level, microskillId], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al editar el microskill', error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Microskill no encontrado' });
        } else {
            res.json({ message: `Microskill con ID ${microskillId} actualizado con éxito` });
        }
    });
};

// Eliminar microskill
const deleteMicroskill = (req, res) => {
    const microskillId = parseInt(req.params.id, 10);

    db.run('DELETE FROM microskills WHERE id = ?', [microskillId], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al eliminar el microskill', error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Microskill no encontrado' });
        } else {
            res.json({ message: `Microskill con ID ${microskillId} eliminado con éxito` });
        }
    });
};

// Listar todas las skills con sus microskills
const getSkillsWithMicroskills = (req, res) => {
    const query = `
        SELECT 
            skills.id AS skill_id,
            skills.name AS skill_name,
            microskills.id AS microskill_id,
            microskills.name AS microskill_name,
            microskills.level AS microskill_level
        FROM skills
        LEFT JOIN microskills ON skills.id = microskills.skill_id
        ORDER BY skills.id, microskills.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error al obtener las habilidades', error: err.message });
        } else {
            // Formatear la respuesta para agrupar microskills bajo cada skill
            const result = rows.reduce((acc, row) => {
                const skill = acc.find((s) => s.id === row.skill_id);
                if (!skill) {
                    acc.push({
                        id: row.skill_id,
                        name: row.skill_name,
                        microskills: row.microskill_id
                            ? [{ id: row.microskill_id, name: row.microskill_name, level: row.microskill_level }]
                            : []
                    });
                } else if (row.microskill_id) {
                    skill.microskills.push({ id: row.microskill_id, name: row.microskill_name, level: row.microskill_level });
                }
                return acc;
            }, []);
            res.json({ skills: result });
        }
    });
};


module.exports = {
    getSkills,
    addSkill,
    editSkill,
    deleteSkill,
    getMicroskills,
    addMicroskill,
    editMicroskill,
    deleteMicroskill,
    getSkillsWithMicroskills // Nueva función
};

