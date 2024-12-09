import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';

function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.userMessage || '';
  const [messages, setMessages] = useState(
    initialMessage
      ? [
          { type: 'user', text: initialMessage },
          { type: 'ai', text: getAiResponse(initialMessage) },
        ]
      : []
  );
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  function getAiResponse(userMessage) {
    return `어깨 통증이 계속되면 몸이 더 힘들어지실 수 있으니, 
가능한 한 편하게 쉬시는 것도 중요해요. 
따뜻한 찜질을 하거나 어깨를 살짝 풀어주는 스트레칭도 도움이 될 수 있답니다. 
혹시라도 증상이 심해지면 병원에 가보시는 게 좋을 것 같아요. 
제가 더 필요한 정보나 방법이 있다면 언제든 알려드릴게요.`;
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { type: 'user', text: inputText };
    const aiMessage = { type: 'ai', text: getAiResponse(inputText) };

    setMessages([...messages, newMessage, aiMessage]);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container>
      <div className={styles['chat-container']}>
        <div className={styles['chat-page']}>
          {messages.map((message, index) => {
            if (index % 2 === 0) {
              const aiMessage = messages[index + 1];
              return (
                <div key={index} className={styles['message-set']}>
                  <div className={`${styles['chat-bubble']} ${styles['user-message']}`}>
                    <p>{message.text}</p>
                  </div>
                  {aiMessage && (
                    <div className={`${styles['chat-bubble']} ${styles['ai-response']}`}>
                      <p>{aiMessage.text}</p>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
          <div ref={chatEndRef}></div>
        </div>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="메시지를 입력하세요."
            className={styles['text-input']}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles['send-button']}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <span className={styles['arrow-icon']}>➤</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default ChatPage;
