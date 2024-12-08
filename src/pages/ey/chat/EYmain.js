// src/pages/ey/EYmain.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EYmain.css'; // 스타일링을 위한 CSS 파일 import
import Container from './Container.js';

function EYmain() {
  // 입력 상태 관리
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 초기화

  // 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // 메시지 전송 함수
  const handleSend = () => {
    if (!inputText.trim()) return; // 빈 입력값 방지
    console.log('InputText:', inputText);
    navigate('/chat', { state: { userMessage: inputText } }); // 페이지이동
    setInputText(''); // 입력창 초기화
  };

  // Enter 키 감지 핸들러
  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault(); // 기본 Enter 키 동작 방지 (예: 폼 제출)
      handleSend(); // 메시지 전송
    }
  }
  return (
    <Container>
      <div className="welcome-container">
        <h1 className="welcome-title">
          점심은 드셨나요?<br />오늘 드신 점심메뉴를 이야기해주세요!
        </h1>
        <p className="welcome-description">
          말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.
        </p>
        <div className="input-container">
          <input
            type="text"
            placeholder="오늘 날씨가 참 좋네."
            className="text-input"
            aria-label="대화 입력창"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Enter 키 핸들러 추가
          />
          <Link
            to="/chat"
            state={{ userMessage: inputText }}
            className="send-button button" // 공통 클래스 추가
            aria-label="전송 버튼"
            onClick={() => {
              console.log('InputText:', inputText);
              setInputText('');
            }}
            style={{ pointerEvents: inputText.trim() ? 'auto' : 'none' }} // 입력값이 없으면 버튼 비활성화
          >
            <span className="arrow-icon">➤</span>
          </Link>
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

export default EYmain;
