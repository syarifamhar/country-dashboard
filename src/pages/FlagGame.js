import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FlagGame() {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch all countries
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
        generateQuestion(data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const generateQuestion = (data) => {
    if (data.length === 0 || questionCount >= 15) {
      setGameOver(true); // End the game if the question count reaches 15
      return;
    }

    // Select a random country
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    setCurrentCountry(randomCountry);

    // Generate multiple-choice options
    const optionsSet = new Set();
    optionsSet.add(randomCountry.name.common);

    while (optionsSet.size < 4) {
      const randomOption = data[Math.floor(Math.random() * data.length)];
      optionsSet.add(randomOption.name.common);
    }

    setOptions([...optionsSet].sort(() => Math.random() - 0.5)); // Shuffle options
    setFeedback("");
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentCountry.name.common) {
      setScore(score + 1);
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(`Wrong! The correct answer is ${currentCountry.name.common}.`);
    }

    // Load the next question
    setTimeout(() => {
      setQuestionCount((prev) => prev + 1);
      generateQuestion(countries);
    }, 1500);
  };

  const renderScoreMessage = () => {
    const percentage = Math.round((score / 15) * 100);

    if (percentage === 100) {
      return (
        <div className="result perfect">
          <h2 className="text-2xl font-bold">Perfect! 🎉</h2>
          <img
            src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
            alt="Perfect animation"
            className="mx-auto"
          />
        </div>
      );
    } else if (percentage >= 85) {
      return (
        <div className="result excellent">
          <h2 className="text-2xl font-bold">Excellent! 👏</h2>
          <img
            src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
            alt="Standing applause animation"
            className="mx-auto"
          />
        </div>
      );
    } else if (percentage >= 65) {
      return (
        <div className="result good">
          <h2 className="text-2xl font-bold">Good Job! 👍</h2>
          <img
            src="https://media.giphy.com/media/xUPGcxpCV81ebKh9fi/giphy.gif"
            alt="Good Job animation"
            className="mx-auto"
          />
        </div>
      );
    } else {
      return (
        <div className="result try-again">
          <h2 className="text-2xl font-bold">Try Again! 😢</h2>
          <img
            src="https://media.giphy.com/media/xUOxfjsW9fWPqEWouI/giphy.gif"
            alt="Try Again animation"
            className="mx-auto"
          />
        </div>
      );
    }
  };

  if (gameOver) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Game Over</h1>
        {renderScoreMessage()}
        <p className="text-lg mt-4">Your Score: {score} / 15</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Play Again
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-700 ml-2"
        >
          Back
        </button>
      </div>
    );
  }

  if (!currentCountry) return <p>Loading game...</p>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Flag Guessing Game</h1>
      <p className="text-lg mb-2">Score: {score} | Question: {questionCount + 1} / 15</p>

      {/* Display Flag */}
      <img
        src={currentCountry.flags.png}
        alt="Country flag"
        className="w-48 h-32 mx-auto mb-4 border border-gray-300"
      />

      {/* Display Options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
}

export default FlagGame;
