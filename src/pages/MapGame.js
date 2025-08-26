import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";

function MapGame() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const navigate = useNavigate();

  // Generate a new question without dependencies that cause re-renders
  const generateQuestion = useCallback((countriesData) => {
    if (!countriesData || countriesData.length === 0) return;
    
    // Filter countries that have proper coordinates
    const validCountries = countriesData.filter(
      country => country.latlng && Array.isArray(country.latlng) && country.latlng.length === 2
    );
    
    if (validCountries.length === 0) return;
    
    // Select a random country with valid coordinates
    const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    if (!randomCountry || !randomCountry.name || !randomCountry.name.common) {
      return;
    }
    
    // Force map re-render by clearing current country first
    setCurrentCountry(null);
    setTimeout(() => {
      setCurrentCountry(randomCountry);
    }, 100);

    // Generate multiple-choice options
    const optionsSet = new Set();
    optionsSet.add(randomCountry.name.common);

    while (optionsSet.size < 4) {
      const randomOption = countriesData[Math.floor(Math.random() * countriesData.length)];
      if (randomOption && randomOption.name && randomOption.name.common) {
        optionsSet.add(randomOption.name.common);
      }
    }

    setOptions([...optionsSet].sort(() => Math.random() - 0.5)); // Shuffle options
    setFeedback("");
  }, []); // No dependencies to prevent recreation

  // Fetch countries only once when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,latlng");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setCountries(data);
          // Generate first question after data is loaded
          generateQuestion(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError('Failed to load game. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [generateQuestion]); // Include generateQuestion as dependency

  // Handle answer selection
  const handleAnswer = useCallback((selectedOption) => {
    if (isAnswering || !currentCountry || !currentCountry.name) return;
    
    setIsAnswering(true);
    
    if (selectedOption === currentCountry.name.common) {
      setScore(prev => prev + 1);
      setFeedback(t('correct'));
    } else {
      setFeedback(`${t('wrong')} ${t('correctAnswer')} ${currentCountry.name.common}.`);
    }

    // Wait for feedback to be shown, then move to next question
    setTimeout(() => {
      const nextQuestionCount = questionCount + 1;
      
      if (nextQuestionCount >= 15) {
        setGameOver(true);
        setIsAnswering(false);
        return;
      }
      
      setQuestionCount(nextQuestionCount);
      generateQuestion(countries);
      setIsAnswering(false);
    }, 2000); // Show feedback for 2 seconds
  }, [currentCountry, questionCount, countries, generateQuestion, t, isAnswering]);

  const renderScoreMessage = () => {
    const percentage = Math.round((score / 15) * 100);

    if (percentage === 100) {
      return (
        <div className="result perfect">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">{t('perfect')}</h2>
          <img
            src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
            alt="Perfect animation"
            className="mx-auto w-32 h-32 rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else if (percentage >= 85) {
      return (
        <div className="result excellent">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t('excellent')}</h2>
          <img
            src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
            alt="Standing applause animation"
            className="mx-auto w-32 h-32 rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else if (percentage >= 65) {
      return (
        <div className="result good">
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{t('goodJob')}</h2>
          <img
            src="https://media.giphy.com/media/xUPGcxpCV81ebKh9fi/giphy.gif"
            alt="Good Job animation"
            className="mx-auto w-32 h-32 rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="result try-again">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">{t('tryAgain')}</h2>
          <img
            src="https://media.giphy.com/media/xUOxfjsW9fWPqEWouI/giphy.gif"
            alt="Try Again animation"
            className="mx-auto w-32 h-32 rounded-lg"
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
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">{t('loadingGame')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">{t('errorLoadingGame')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="space-x-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
            >
              {t('tryAgain')}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="p-6 text-center bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">{t('gameOver')}</h1>
        {renderScoreMessage()}
        <p className="text-xl mt-6 text-gray-800 dark:text-gray-200">{t('yourScore')}: {score} / 15</p>
        <div className="space-x-4 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300"
          >
            {t('playAgain')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentCountry || !currentCountry.name || !currentCountry.name.common || !currentCountry.latlng) {
    return (
      <div className="p-6 text-center bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-800 dark:text-gray-200">{t('preparingQuestion')}</p>
      </div>
    );
  }

  // Calculate map bounds to show the whole country
  const [lat, lng] = currentCountry.latlng;
  
  // Calculate zoom level based on country name to focus on single country
  // Higher zoom levels to show only the target country
  const getZoomLevel = (countryName) => {
    // Very small countries/territories - need very high zoom
    const verySmallCountries = [
      'Vatican City', 'Monaco', 'San Marino', 'Liechtenstein', 'Malta', 
      'Andorra', 'Singapore', 'Bahrain', 'Maldives', 'Barbados'
    ];
    
    // Small countries - need high zoom
    const smallCountries = [
      'Luxembourg', 'Cyprus', 'Qatar', 'Kuwait', 'Lebanon', 'Israel',
      'Brunei', 'Trinidad and Tobago', 'Cape Verde', 'Samoa', 'Comoros',
      'Mauritius', 'Seychelles', 'Palau', 'Nauru', 'Tuvalu', 'Gambia',
      'Djibouti', 'Bahrain', 'Malta', 'Grenada', 'Saint Lucia', 'Antigua and Barbuda'
    ];
    
    // Large countries - need moderate zoom to see country shape
    const largeCountries = [
      'Russia', 'Canada', 'United States', 'China', 'Brazil', 'Australia',
      'India', 'Argentina', 'Kazakhstan', 'Algeria', 'Democratic Republic of the Congo',
      'Saudi Arabia', 'Mexico', 'Indonesia', 'Sudan', 'Libya', 'Iran', 'Mongolia'
    ];
    
    if (verySmallCountries.includes(countryName)) {
      return 12; // Maximum zoom for tiny countries
    } else if (smallCountries.includes(countryName)) {
      return 9; // Very high zoom for small countries
    } else if (largeCountries.includes(countryName)) {
      return 5; // Moderate zoom for large countries to see their shape
    } else {
      return 7; // High zoom for average-sized countries
    }
  };
  
  const zoomLevel = getZoomLevel(currentCountry.name.common);

  return (
    <div className="p-6 text-center bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">{t('mapGuessingGame')}</h1>
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {t('score')}: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> | 
          {t('question')}: <span className="font-bold text-green-600 dark:text-green-400">{questionCount + 1} / 15</span>
        </p>
      </div>

      {/* Display Map */}
      <div className="mb-8 mx-auto max-w-2xl">
        <div className="border-4 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            key={`${currentCountry.name.common}-${questionCount}`}
            center={[lat, lng]}
            zoom={zoomLevel}
            style={{ height: "400px", width: "100%" }}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer
              url={isDark 
                ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              }
              attribution={isDark 
                ? '&copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.esri.com/">Esri</a>'
              }
            />
          </MapContainer>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('whichCountryIsThis')}
        </p>
      </div>

      {/* Display Options */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={isAnswering}
            className={`p-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              isAnswering 
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className={`text-xl font-semibold ${
            feedback.includes(t('correct')) 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {feedback}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <button
          onClick={() => navigate('/flag-game')}
          className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-sm hover:shadow-md"
        >
          {t('playFlagGame')}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 shadow-sm hover:shadow-md"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
}

export default MapGame;