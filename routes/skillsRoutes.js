const express = require('express');
const { getSkills, addSkill, editSkill, deleteSkill } = require('../controllers/skillsController');
const router = express.Router();


router.get('/skills', getSkills);// Ruta para obtener todas las habilidades
router.post('/skills', addSkill);// Ruta para agregar una nueva habilidad
router.put('/skills/:id', editSkill);// Ruta para editar una habilidad
router.delete('/skills/:id', deleteSkill);// Ruta para elimin ar una habilidad

module.exports = router;