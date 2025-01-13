import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SkillsManager from "./SkillsManagerApp";
import QuestionsPage from "./QuestionsPage";
import QuestionViewer from "./QuestionsViewer";

function App() {
    const [questions, setQuestions] = useState([]); // Estado global para preguntas

    const handleSaveQuestion = (newQuestion) => {
        setQuestions((prev) => [...prev, newQuestion]);
    };

    return (
        <Router>
            <div style={{ paddingBottom: "80px" }}>
                <Routes>
                    <Route path="/skills" element={<SkillsManager />} />
                    <Route
                        path="/questions"
                        element={<QuestionsPage onSave={handleSaveQuestion} />}
                    />
                    <Route
                        path="/viewer"
                        element={<QuestionViewer questions={questions} />}
                    />
                </Routes>
                <div className="bottom-bar">
                    <Link to="/skills">
                        <button>🧠</button>
                    </Link>
                    <Link to="/questions">
                        <button>✍️</button>
                    </Link>
                    <Link to="/viewer">
                        <button>👁️</button>
                    </Link>
                </div>
            </div>
        </Router>
    );
}

export default App;
