import React, { useState, useEffect } from "react";
import { questions } from "../data/questions";
import { QuizHistory } from "../components/QuizHistory";
import { saveAttempt, getAttempts, deleteAttempts } from "../utils/db";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { Timer as TimerIcon } from "lucide-react";
import { useNavigate} from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  // Quiz State
  const [quizState, setQuizState] = useState(() => {
    const savedState = localStorage.getItem("quizState");
    return savedState
      ? JSON.parse(savedState)
      : { currentQuestionIndex: 0, answers: [], isComplete: false };
  });

  // Timer State
  const [timeLeft, setTimeLeft] = useState(() => {
    return Number(localStorage.getItem("timeLeft")) || 30;
  });

  //Attempt State
  const [attempts, setAttempts] = useState([]);

  //showFeedback State
  const [showFeedback, setShowFeedback] = useState(false);

  //Current Question(int) and isLastQuestion(boolean)
  const currentQuestion = questions[quizState.currentQuestionIndex];
  const isLastQuestion =quizState.currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    localStorage.setItem("quizState", JSON.stringify(quizState));
  }, [quizState]);

  //Get ALl Attempts
  useEffect(() => {
    getAttempts().then(setAttempts);
  }, []);

  //Timer
  useEffect(() => {
    if (showFeedback) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
         const newTimeLeft = prev - 1;
         localStorage.setItem("timeLeft", newTimeLeft); // Save timer to localStorage
         return newTimeLeft;
      });
    }, 1000);
    return () => clearInterval(timer);
  },[showFeedback,quizState.currentQuestionIndex,quizState.isComplete]);

  //Handle Timeout
  const handleTimeout = () => {
    if (quizState.isComplete) return;
    setQuizState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = -1; // Mark unanswered
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: [...prev.answers, -1],
        isComplete: prev.currentQuestionIndex + 1 === questions.length,
      };
    });
    setTimeLeft(30); // Reset the timer for the next question
    localStorage.setItem("timeLeft", 30);
    setShowFeedback(false);
  };
   
  //Handle Answer
  const handleAnswer = (answerIndex) => {
    if (quizState.isComplete || showFeedback) return;
    setQuizState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answerIndex; // Store the answer for the current question
      const updatedState ={
        ...prev,
        answers: newAnswers,
        isComplete: prev.currentQuestionIndex + 1 === questions.length,
      };
      return updatedState;
    });
    setShowFeedback(true);

    //Move to next question after 1 seconds
    setTimeout(()=>{
      setShowFeedback(false);
      if(quizState.currentQuestionIndex < questions.length - 1){
            setQuizState((prev) => {
              return{
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                timeLeft: 30, // Reset timer
              };
            });
        setTimeLeft(30); // Reset timer for next question
      }
    },1000);
  };

  //Calculate Score
  const calculateScore = () => {
    return quizState.answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  //Handle Retry
  const handleRetry = async () => {
    const score = calculateScore();
    const attempt = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      score,
      totalQuestions: questions.length,
    };
    await saveAttempt(attempt);
    const newAttempts = await getAttempts();
    setAttempts(newAttempts);
    setQuizState({ currentQuestionIndex: 0, answers: [], isComplete: false });
    setShowFeedback(false);
    localStorage.removeItem("quizState"); // Clear saved state
    setTimeLeft(30);
  };

  //Handle Next Question
  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: [
          ...prev.answers,
          showFeedback ? prev.answers[prev.currentQuestionIndex] : -1,
        ],
        isComplete: isLastQuestion,
      }));
      setShowFeedback(false);
      setTimeLeft(30); // Reset timer for next question
    }
  };
   
  // If Quiz is Complete, Show Results
  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Complete!
              </h2>
              <p className="text-xl mb-6">
                Your score: {calculateScore()} out of {questions.length}
              </p>
              <button
                onClick={handleRetry}
                className="bg-indigo-600 text-white px-6 py-2 mx-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <QuizHistory attempts={attempts} />
      </div>
    );
  }
  // Quiz UI
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {questions.length}
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <TimerIcon className="w-5 h-5" />
              <span className={timeLeft <= 5 ? "text-red-500" : ""}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected =
                quizState.answers[quizState.currentQuestionIndex] === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              let buttonClass =
                "w-full text-left px-4 py-3 rounded-md border transition-colors ";
              if (showFeedback) {
                if (isCorrect) {
                  buttonClass += "bg-green-100 border-green-500 text-green-700";
                } else if (isSelected) {
                  buttonClass += "bg-red-100 border-red-500 text-red-700";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-500";
                }
              } else {
                buttonClass += "hover:bg-gray-50 border-gray-300";
              }
              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">{option}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={handleNextQuestion}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {
            !quizState.isComplete ? "Next Question" : "Finish"
          }
        </button>
      </div>
    </div>
    );
}

export default Quiz;
