


// Controlador de ejemplo
const getQuestions = (req, res) => {
    res.json({ message: "Gestión de preguntas funcionando." });
};

const addQuestion = (req, res) => {
    res.status(201).json({ message: "Pregunta añadida correctamente." });
};

const editQuestion = (req, res) => {
    res.status(200).json({ message: `Pregunta con ID ${req.params.id} actualizada.` });
};

const deleteQuestion = (req, res) => {
    res.status(200).json({ message: `Pregunta con ID ${req.params.id} eliminada.` });
};

const getAnswers = (req, res) => {
    res.json({ message: `Respuestas para la pregunta con ID ${req.params.questionId}.` });
};

const addAnswer = (req, res) => {
    res.status(201).json({ message: "Respuesta añadida correctamente." });
};

const editAnswer = (req, res) => {
    res.status(200).json({ message: `Respuesta con ID ${req.params.answerId} actualizada.` });
};

const deleteAnswer = (req, res) => {
    res.status(200).json({ message: `Respuesta con ID ${req.params.answerId} eliminada.` });
};

// Exportar todos los controladores
module.exports = {
    getQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    getAnswers,
    addAnswer,
    editAnswer,
    deleteAnswer
};
