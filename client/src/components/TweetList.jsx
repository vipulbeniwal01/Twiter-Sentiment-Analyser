import React from 'react';
import './TweetList.css'; // Import the CSS file

const TweetList = ({ tweets }) => {
  const latestTweets = tweets.slice(0, 5); // Get only the first 5 tweets

  return (
    <div className="tweet-container">
      <div className="tweet-title">Latest Tweets:</div>
      <ul className="tweet-list">
        {latestTweets.map((tweet) => (
          <li key={tweet.id} className="tweet-item">
            <div className="tweet-content">{tweet.content}</div>
            <div className="tweet-details">
              <a
                href={tweet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tweet-link"
              >
                View Tweet
              </a>
              {` - ${new Date(tweet.timestamp).toLocaleString()}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TweetList;