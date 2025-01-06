const express = require('express');
const { getSkills, addSkill, editSkill, deleteSkill, getMicroskills, addMicroskill, editMicroskill, deleteMicroskill, getSkillsWithMicroskills } = require('../controllers/skillsController');
const router = express.Router();


router.get('/skills', getSkills);// Ruta para obtener todas las habilidades
router.post('/skills', addSkill);// Ruta para agregar una nueva habilidad
router.put('/skills/:id', editSkill);// Ruta para editar una habilidad
router.delete('/skills/:id', deleteSkill);// Ruta para elimin ar una habilidad

// Rutas para microskills
router.get('/skills/:skillId/microskills', getMicroskills);
router.post('/skills/:skillId/microskills', addMicroskill);
router.put('/microskills/:id', editMicroskill);
router.delete('/microskills/:id', deleteMicroskill);

//Skills y MicroSkills
router.get('/skills-with-microskills', getSkillsWithMicroskills);

module.exports = router;