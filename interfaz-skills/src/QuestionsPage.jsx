import React from "react";
import QuestionsManager from "./components/questions/QuestionsManager";

const QuestionsPage = ({ onSave }) => {
    return (
        <div>
            <h1>Creador de Cuestionarios</h1>
            <QuestionsManager onSave={onSave} />
        </div>
    );
};

export default QuestionsPage;
