/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatPage.css';
import Container from './Container.js';

function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.userMessage || ''; // EYmain에서 전달된 초기 메시지
  const [messages, setMessages] = useState(
    initialMessage
      ? [
          { type: 'user', text: initialMessage },
          { type: 'ai', text: getAiResponse(initialMessage) },
        ]
      : []
  ); // 초기 메시지 설정
  const [inputText, setInputText] = useState(''); // 새 입력값 관리

  const chatEndRef = useRef(null); // 스크롤을 제어할 참조

  // AI 응답 생성 함수
  function getAiResponse(userMessage) {
    return `어깨 통증이 계속되면 몸이 더 힘들어지실 수 있으니, 
가능한 한 편하게 쉬시는 것도 중요해요. 
따뜻한 찜질을 하거나 어깨를 살짝 풀어주는 스트레칭도 도움이 될 수 있답니다. 
혹시라도 증상이 심해지면 병원에 가보시는 게 좋을 것 같아요. 
제가 더 필요한 정보나 방법이 있다면 언제든 알려드릴게요.`;
  }

  // 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!inputText.trim()) return; // 빈 입력값 방지

    // 새로운 메시지 추가
    const newMessage = { type: 'user', text: inputText };
    const aiMessage = { type: 'ai', text: getAiResponse(inputText) };

    setMessages([...messages, newMessage, aiMessage]); // 메시지와 AI 응답 추가
    setInputText(''); // 입력창 초기화
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
        e.preventDefault();
        handleSendMessage();
    }
  }
  // 메시지가 추가될 때 스크롤을 최신 메시지로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container>
      <div className="chat-container">
        <div className="chat-page">
          {messages.map((message, index) => {
            if (index % 2 === 0) {
              // 유저 메시지와 AI 응답이 하나의 세트로 묶이도록 설정
              const aiMessage = messages[index + 1];
              return (
                <div key={index} className="message-set">
                  <div className="chat-bubble user-message">
                    <p>{message.text}</p>
                  </div>
                  {aiMessage && (
                    <div className="chat-bubble ai-response">
                      <p>{aiMessage.text}</p>
                    </div>
                  )}
                </div>
              );
            }
            return null; // 홀수 인덱스 메시지는 렌더링하지 않음 (AI 메시지 이미 처리됨)
          })}
          {/* 스크롤 참조 요소 */}
          <div ref={chatEndRef}></div>
        </div>
        {/* 입력창 */}
        <div className="input-container">
          <input
            type="text"
            placeholder="메시지를 입력하세요."
            className="text-input"
            aria-label="대화 입력창"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Enter 키 핸들러 추가
          />
          <button
            className="send-button"
            aria-label="전송 버튼"
            onClick={handleSendMessage}
            disabled={!inputText.trim()} // 빈 입력값이면 비활성화
          >
            <span className="arrow-icon">➤</span>
          </button>

          <button
            className="mic-button button" // 공통 클래스 추가
            aria-label="음소거 버튼"
            onClick={() => {
              console.log('Mic button clicked');
            }}
          >
            <span className="mic-icon">🔇</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default ChatPage;
