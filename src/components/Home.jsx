import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain} from "lucide-react";
const Home = () => {

    const navigate = useNavigate();
    const handleStartQuiz = () => { // Clear previous quiz data
      navigate("/quiz");
      localStorage.removeItem("quizState");  // Redirect to the quiz page
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl text-center">
        <Brain className="w-20 h-20  mx-auto mb-4 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to the Brain Booster
        </h1>
        <p className="text-lg text-indigo-700 mb-8 ">
          Test your knowledge and improve your skills with our engaging quiz
          questions.
        </p>
        <button
          onClick={handleStartQuiz}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;
