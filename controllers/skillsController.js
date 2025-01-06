// Arreglo en memoria para almacenar habilidades
const skills = [];

// Obtener todas las habilidades
const getSkills = (req, res) => {
    res.json({ skills });
};

// Agregar una nueva habilidad
const addSkill = (req, res) => {
    const newSkill = req.body.skill;
    if (!newSkill) {
        return res.status(400).json({ message: 'La habilidad no puede estar vacía' });
    }
    skills.push(newSkill);
    res.json({ message: `Habilidad '${newSkill}' agregada con éxito`, skills });
};
// Editar una habilidad
const editSkill = (req, res) => {
    const skillId = parseInt(req.params.id, 10); // Convertir id a número
    const newSkill = req.body.skill;

    // Validar entrada
    if (isNaN(skillId) || skillId < 0 || skillId >= skills.length) {
        return res.status(400).json({ message: 'ID inválido' });
    }
    if (!newSkill) {
        return res.status(400).json({ message: 'La habilidad no puede estar vacía' });
    }

    // Editar la habilidad
    skills[skillId] = newSkill;
    res.json({ message: `Habilidad con ID ${skillId} actualizada a '${newSkill}'`, skills });
};
// Eliminar una habilidad
const deleteSkill = (req, res) => {
    const skillId = parseInt(req.params.id, 10); // Convertir id a número

    // Validar entrada
    if (isNaN(skillId) || skillId < 0 || skillId >= skills.length) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    // Eliminar la habilidad
    const deletedSkill = skills.splice(skillId, 1); // Elimina y guarda la habilidad eliminada
    res.json({ message: `Habilidad '${deletedSkill}' eliminada con éxito`, skills });
};

module.exports = {
    getSkills,
    addSkill,
    editSkill,
    deleteSkill, 
};