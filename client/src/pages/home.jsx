import React, { useState } from 'react';
import './Home.css'; // Import the CSS file
import InputForm from '../components/InputForm';
import SentimentResult from '../components/SentimentResult';
import TweetList from '../components/TweetList';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const [twitterId, setTwitterId] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [tweets, setTweets] = useState([]);

  return (
    <div className="container">
      <InputForm twitterId={twitterId} setSentiment={setSentiment} setTweets={setTweets} setTwitterId={setTwitterId} />
      
      {sentiment !== null && (
        <div className="sentiment-result">
          <SentimentResult sentiment={sentiment} />
        </div>
      )}
      
      {tweets.length > 0 && (
        <div className="tweet-list">
          <TweetList tweets={tweets} />
        </div>
      )}
      
      {sentiment !== null && (
        <div className="chatbot">
          <Chatbot tweets={tweets} twitterId={twitterId} />
        </div>
      )}
    </div>
  );
};

export default Home;