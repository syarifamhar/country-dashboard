import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

function FlagGame() {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation

  const generateQuestion = useCallback((data) => {
    if (!data || data.length === 0 || questionCount >= 15) {
      setGameOver(true); // End the game if the question count reaches 15
      return;
    }

    // Select a random country
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    if (!randomCountry || !randomCountry.name || !randomCountry.name.common) {
      // Skip invalid countries
      generateQuestion(data);
      return;
    }
    
    setCurrentCountry(randomCountry);

    // Generate multiple-choice options
    const optionsSet = new Set();
    optionsSet.add(randomCountry.name.common);

    while (optionsSet.size < 4) {
      const randomOption = data[Math.floor(Math.random() * data.length)];
      if (randomOption && randomOption.name && randomOption.name.common) {
        optionsSet.add(randomOption.name.common);
      }
    }

    setOptions([...optionsSet].sort(() => Math.random() - 0.5)); // Shuffle options
    setFeedback("");
  }, [questionCount]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch all countries with required fields parameter
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountries(data);
          generateQuestion(data);
        } else {
          throw new Error('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setError(t('failedToLoadGame'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t, generateQuestion]);

  const handleAnswer = (selectedOption) => {
    if (!currentCountry || !currentCountry.name) return;
    
    if (selectedOption === currentCountry.name.common) {
      setScore(score + 1);
      setFeedback(t('correct'));
    } else {
      setFeedback(`${t('wrong')} ${t('correctAnswer')} ${currentCountry.name.common}.`);
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
          <h2 className="text-2xl font-bold">{t('perfect')}</h2>
          <img
            src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
            alt="Perfect animation"
            className="mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else if (percentage >= 85) {
      return (
        <div className="result excellent">
          <h2 className="text-2xl font-bold">{t('excellent')}</h2>
          <img
            src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
            alt="Standing applause animation"
            className="mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else if (percentage >= 65) {
      return (
        <div className="result good">
          <h2 className="text-2xl font-bold">{t('goodJob')}</h2>
          <img
            src="https://media.giphy.com/media/xUPGcxpCV81ebKh9fi/giphy.gif"
            alt="Good Job animation"
            className="mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="result try-again">
          <h2 className="text-2xl font-bold">{t('tryAgain')}</h2>
          <img
            src="https://media.giphy.com/media/xUOxfjsW9fWPqEWouI/giphy.gif"
            alt="Try Again animation"
            className="mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">{t('loadingGame')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('errorLoadingGame')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {t('tryAgain')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ml-2"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('gameOver')}</h1>
        {renderScoreMessage()}
        <p className="text-lg mt-4">{t('yourScore')}: {score} / 15</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          {t('playAgain')}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-700 ml-2"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  if (!currentCountry || !currentCountry.name || !currentCountry.name.common) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">{t('preparingQuestion')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">{t('flagGuessingGame')}</h1>
      <p className="text-lg mb-2">{t('score')}: {score} | {t('question')}: {questionCount + 1} / 15</p>

      {/* Display Flag */}
      {currentCountry.flags?.png && (
        <img
          src={currentCountry.flags.png}
          alt="Country flag"
          className="w-48 h-32 mx-auto mb-4 border border-gray-300 rounded"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Display Options */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
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
        {t('back')}
      </button>
    </div>
  );
}

export default FlagGame;
