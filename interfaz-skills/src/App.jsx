import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import SkillsManager from "./SkillsManagerApp";
import QuestionsPage from "./QuestionsPage";
import QuestionViewer from "./QuestionsViewer";
import QuestionTester from "./components/questions/QuestionsTester";
import Viz from "./components/visualizations/Viz";
import logo from "./assets/logo_qz.svg";

function App() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const location = useLocation();

    const handleSaveQuestion = (newQuestions) => {
        const questionsArray = Array.isArray(newQuestions) ? newQuestions : [newQuestions];
        console.log("Nueva(s) pregunta(s) añadida(s):", questionsArray);
        setQuestions((prev) => [...prev, ...questionsArray]);
    };

    const handleDelete = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    return (
        <div style={{ paddingBottom: "80px", position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            {location.pathname === "/" && (
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "300px",
                        opacity: 0.5,
                        zIndex: 0,
                    }}
                />
            )}
            <Routes>
                <Route path="/" element={<h1>Bienvenido a la App</h1>} />
                <Route path="/skills" element={<SkillsManager />} />
                <Route path="/questions" element={<QuestionsPage onSave={handleSaveQuestion} />} />
                <Route path="/viewer" element={<QuestionViewer questions={questions} onDelete={handleDelete} />} />
                <Route path="/test" element={<QuestionTester questions={questions} onFinish={setAnswers} />} />
                <Route path="/results" element={<Viz data={answers} />} />
            </Routes>
            <div className="bottom-bar">
                <Link to="/">
                    <button>🏠</button>
                </Link>
                <Link to="/skills">
                    <button>🧠</button>
                </Link>
                <Link to="/questions">
                    <button>✍️</button>
                </Link>
                <Link to="/viewer">
                    <button>👁️</button>
                </Link>
                <Link to="/test">
                    <button>💡</button>
                </Link>
                <Link to="/results">
                    <button>🔭</button>
                </Link>
            </div>
        </div>
    );
}

export default App;
