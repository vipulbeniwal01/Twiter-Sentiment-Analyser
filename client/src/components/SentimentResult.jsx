// /src/components/SentimentResult.jsx

import React from 'react';
import './SentimentResult.css'; // Import the CSS file

const SentimentResult = ({ sentiment }) => {
  const getSentimentLabel = (score) => {
    if (score > 0) return 'Positive';
    if (score < 0) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="sentiment-container">
      <div className="sentiment-box">
        <div className="sentiment-title">
          Overall Sentiment: {getSentimentLabel(sentiment)}
        </div>
        <div className="sentiment-score">
          Sentiment Score: {sentiment.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SentimentResult;