import React from 'react';
import chatBubbles from './assets/chat-bubbles.png';
import sendIcon from './assets/send-icon.png';
import quoteIcon from './assets/quote-icon.png';
import chat from './assets/chat.png';
import './App.css'; // Ensure this imports the new styles
import Message from './Components/Message.jsx';

function App() {
  return (
    <div>
      {/* Background icons */}
      <img src={chatBubbles} alt="chat bubbles" className="chat-bubbles-bg" />
      <img src={sendIcon} alt="send icon" className="send-icon-bg" />
      <img src={quoteIcon} alt="quote icon" className="quote-icon-bg" />
      <img src={chat} alt="quote icon" className="quote-icon" />
      <Message/>
    </div>
  );
}

export default App;
