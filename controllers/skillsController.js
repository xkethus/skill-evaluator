const db = require('../database');

// Obtener todas las habilidades
const getSkills = (req, res) => {
    db.all('SELECT * FROM skills', (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error al obtener las habilidades', error: err.message });
        } else {
            res.json({ skills: rows });
        }
    });
};

// Obtener todas las habilidades con sus microskills
const getSkillsWithMicroskills = (req, res) => {
    db.all(
        `SELECT skills.id as skill_id, skills.name as skill_name, microskills.id as microskill_id, microskills.name as microskill_name
         FROM skills LEFT JOIN microskills ON skills.id = microskills.skill_id`,
        (err, rows) => {
            if (err) {
                res.status(500).json({ message: 'Error al obtener las habilidades', error: err.message });
            } else {
                const skills = rows.reduce((acc, row) => {
                    let skill = acc.find((s) => s.id === row.skill_id);
                    if (!skill) {
                        skill = {
                            id: row.skill_id,
                            name: row.skill_name,
                            microskills: []
                        };
                        acc.push(skill);
                    }
                    if (row.microskill_id) {
                        skill.microskills.push({
                            id: row.microskill_id,
                            name: row.microskill_name
                        });
                    }
                    return acc;
                }, []);
                res.json({ skills });
            }
        }
    );
};

// Agregar una nueva habilidad
const addSkill = (req, res) => {
    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({ message: 'El nombre de la habilidad es obligatorio' });
    }

    db.run('INSERT INTO skills (name) VALUES (?)', [skill], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al agregar la habilidad', error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, message: 'Habilidad creada con éxito' });
        }
    });
};

// Editar una habilidad existente
const editSkill = (req, res) => {
    const skillId = req.params.id;
    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({ message: 'El nombre de la habilidad es obligatorio' });
    }

    db.run('UPDATE skills SET name = ? WHERE id = ?', [skill, skillId], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al editar la habilidad', error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Habilidad no encontrada' });
        } else {
            res.json({ message: 'Habilidad actualizada con éxito' });
        }
    });
};

// Eliminar una habilidad
const deleteSkill = (req, res) => {
    const skillId = req.params.id;

    db.run('DELETE FROM skills WHERE id = ?', [skillId], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error al eliminar la habilidad', error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Habilidad no encontrada' });
        } else {
            res.json({ message: 'Habilidad eliminada con éxito' });
        }
    });
};

// Obtener subhabilidades de una habilidad específica
const getMicroskills = (req, res) => {
    const skillId = req.params.skillId;

    db.all('SELECT * FROM microskills WHERE skill_id = ?', [skillId], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error al obtener las subhabilidades', error: err.message });
        } else {
            res.json({ microskills: rows });
        }
    });
};

// Agregar una subhabilidad a una habilidad específica
const addMicroskill = (req, res) => {
    const skillId = req.params.skillId;
    const { name } = req.body;

    console.log("Datos recibidos en el backend:", { skillId, name });

    if (!name) {
        return res.status(400).json({ message: "El nombre de la subhabilidad es obligatorio" });
    }

    db.run('INSERT INTO microskills (name, skill_id) VALUES (?, ?)', [name, skillId], function (err) {
        if (err) {
            console.error("Error al agregar la subhabilidad:", err.message);
            return res.status(500).json({ message: "Error al agregar la subhabilidad", error: err.message });
        }

        const microskillId = this.lastID;
        console.log("Subhabilidad creada con ID:", microskillId);

        const niveles = [1, 2, 3, 4];
        const nivelQueries = niveles.map((nivel) => {
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO microskill_levels (microskill_id, level) VALUES (?, ?)',
                    [microskillId, nivel],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        Promise.all(nivelQueries)
            .then(() => {
                console.log("Niveles creados para la subhabilidad:", microskillId);
                res.status(201).json({ id: microskillId, message: "Subhabilidad y niveles creados con éxito" });
            })
            .catch((error) => {
                console.error("Error al crear los niveles:", error.message);
                res.status(500).json({ message: "Error al crear los niveles de la subhabilidad", error: error.message });
            });
    });
};


// Editar una subhabilidad específica
const editMicroskill = (req, res) => {
    const skillId = parseInt(req.params.skillId, 10);
    const microskillId = parseInt(req.params.microskillId, 10);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'El nombre de la subhabilidad es obligatorio' });
    }

    db.run(
        'UPDATE microskills SET name = ? WHERE id = ? AND skill_id = ?',
        [name, microskillId, skillId],
        function (err) {
            if (err) {
                res.status(500).json({ message: 'Error al editar la subhabilidad', error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ message: 'Subhabilidad no encontrada' });
            } else {
                res.json({ message: `Subhabilidad con ID ${microskillId} actualizada con éxito` });
            }
        }
    );
};

// Eliminar una subhabilidad específica
const deleteMicroskill = (req, res) => {
    const skillId = parseInt(req.params.skillId, 10);
    const microskillId = parseInt(req.params.microskillId, 10);

    db.run(
        'DELETE FROM microskills WHERE id = ? AND skill_id = ?',
        [microskillId, skillId],
        function (err) {
            if (err) {
                res.status(500).json({ message: 'Error al eliminar la subhabilidad', error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ message: 'Subhabilidad no encontrada' });
            } else {
                res.json({ message: `Subhabilidad con ID ${microskillId} eliminada con éxito` });
            }
        }
    );
};

// Exportar todas las funciones
module.exports = {
    getSkills,
    getSkillsWithMicroskills,
    addSkill,
    editSkill,
    deleteSkill,
    getMicroskills,
    addMicroskill,
    editMicroskill,
    deleteMicroskill
};
