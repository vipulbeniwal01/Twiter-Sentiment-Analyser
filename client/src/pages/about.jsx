// /src/pages/About.jsx

import React from 'react';
import './About.css'; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <h4 className="about-title">
        About Twitter Sentiment Analyzer
      </h4>
      <p className="about-paragraph">
        The Twitter Sentiment Analyzer is a web application that allows users to analyze the sentiment of any Twitter user's tweets. By entering a Twitter user ID, the application fetches the user's recent tweets, performs sentiment analysis on them, and provides an overall sentiment score.
      </p>
      <p className="about-paragraph">
        Additionally, the application features a chatbot powered by the Gemini API. The chatbot responds to user interactions with sentiments aligned to the analyzed data, providing a personalized conversational experience based on the Twitter user's sentiments.
      </p>
      <p className="about-paragraph">
        This tool is beneficial for individuals and businesses looking to gauge the public perception or personal expression trends of Twitter users.
      </p>
      <p className="about-paragraph">
        Developed with React on the frontend and Node.js with Express on the backend, the application ensures a seamless and efficient user experience.
      </p>
    </div>
  );
};

export default About;