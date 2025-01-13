const express = require('express');
const {
    getSkills,
    getSkillsWithMicroskills,
    addSkill,
    editSkill,
    deleteSkill,
    getMicroskills,
    addMicroskill,
    editMicroskill,
    deleteMicroskill
} = require('../controllers/skillsController');
const router = express.Router();

// Rutas para habilidades
router.get('/skills', getSkills); // Obtener todas las habilidades
router.post('/skills', addSkill); // Agregar una nueva habilidad
router.put('/skills/:id', editSkill); // Editar una habilidad
router.delete('/skills/:id', deleteSkill); // Eliminar una habilidad

// Rutas para subhabilidades
router.get('/skills/:skillId/microskills', getMicroskills); // Obtener subhabilidades de una habilidad
router.post('/skills/:skillId/microskills', addMicroskill); // Agregar una subhabilidad a una habilidad
router.put('/skills/:skillId/microskills/:microskillId', editMicroskill); // Editar una subhabilidad específica
router.delete('/skills/:skillId/microskills/:microskillId', deleteMicroskill); // Eliminar una subhabilidad específica

// Ruta para obtener habilidades con sus subhabilidades
router.get('/skills-with-microskills', getSkillsWithMicroskills);

module.exports = router;
