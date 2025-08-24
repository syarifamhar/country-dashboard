import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";
import FlagGame from "./pages/FlagGame";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/country/:name" element={<CountryPage />} />
              <Route path="/flag-game" element={<FlagGame />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
