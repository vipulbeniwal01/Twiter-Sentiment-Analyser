// /src/pages/About.jsx

import React from 'react';
import './About.css'; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <p className="about-paragraph">
      Tweet Tone is a web application designed to analyze the sentiment of any Twitter user’s tweets. By entering a Twitter user ID, the app fetches recent tweets, performs sentiment analysis, and provides an overall sentiment score. The analysis helps users gauge the tone and emotion behind the content shared by any Twitter user.
      </p>
      <p className="about-paragraph">
      In addition to sentiment analysis, Tweet Tone features a chatbot powered by the Gemini API, which aligns its responses with the sentiment data analyzed from the tweets. This offers a personalized, interactive experience where users can converse with the chatbot, and the conversation reflects the emotions and sentiment of the analyzed tweets.
      </p>
      <p className="about-paragraph">
      To further enhance the experience, the app also allows users to create their own Solana blockchain token. This feature generates a unique token and associates it with a randomly selected avatar. The creation of the Solana token is seamlessly integrated into the app, and users receive their token address and avatar, offering a fun and interactive way to engage with blockchain technology.
      </p>
      <p className="about-paragraph">
      Whether you’re looking to gauge public perception, explore personal expression trends, or create your own Solana token, Tweet Tone provides a comprehensive tool for individuals and businesses alike.
      </p>
      <p className="about-paragraph">
      Built with:
      <br />
	•	Frontend: React.js
  <br />
	•	Backend: Node.js with Express
  <br />
	•	Solana Blockchain Integration: Token creation with random avatars
      </p>
    </div>
  );
};

export default About;