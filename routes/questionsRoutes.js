const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear una nueva pregunta
router.post('/questions', (req, res) => {
    const { text, skill_id, subskill_id, options } = req.body;

    if (!text || !skill_id || !subskill_id || !options || options.length !== 4) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben incluir 4 opciones.' });
    }

    db.run(
        `INSERT INTO questions (text, skill_id, subskill_id) VALUES (?, ?, ?)`,
        [text, skill_id, subskill_id],
        function (err) {
            if (err) return res.status(500).json({ error: 'Error al guardar la pregunta.' });

            const questionId = this.lastID;

            const optionQueries = options.map((option) => {
                return db.run(
                    `INSERT INTO answers (text, level, question_id) VALUES (?, ?, ?)`,
                    [option.text, option.level, questionId]
                );
            });

            Promise.all(optionQueries)
                .then(() => res.status(201).json({ message: 'Pregunta creada con éxito.' }))
                .catch(() => res.status(500).json({ error: 'Error al guardar las opciones.' }));
        }
    );
});

// Obtener habilidades y subhabilidades
router.get('/skills-with-subskills', (req, res) => {
    db.all(
        `SELECT skills.id AS skill_id, skills.name AS skill_name, 
                microskills.id AS subskill_id, microskills.name AS subskill_name 
         FROM skills 
         LEFT JOIN microskills ON skills.id = microskills.skill_id`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Error al consultar las habilidades.' });

            const skills = rows.reduce((acc, row) => {
                const skill = acc.find((s) => s.id === row.skill_id);
                if (skill) {
                    skill.subskills.push({ id: row.subskill_id, name: row.subskill_name });
                } else {
                    acc.push({
                        id: row.skill_id,
                        name: row.skill_name,
                        subskills: [{ id: row.subskill_id, name: row.subskill_name }]
                    });
                }
                return acc;
            }, []);

            res.json({ skills });
        }
    );
});

module.exports = router;
