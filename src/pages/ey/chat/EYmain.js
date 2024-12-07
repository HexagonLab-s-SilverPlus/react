// src/pages/ey/EYmain.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EYmain.css'; // 스타일링을 위한 CSS 파일 import
import Container from './Container.js';


function EYmain() {
  // 입력 상태 관리
  const [inputText, setInputText] = useState('');

  // 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <Container>
 <div className="welcome-container">
      <h1 className="welcome-title">점심은 드셨나요?<br />오늘 드신 점심메뉴를 이야기해주세요!</h1>
      <p className="welcome-description">말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="오늘 날씨가 참 좋네."
          className="text-input"
          aria-label="대화 입력창"
          value={inputText} // 입력값 상태 연결
          onChange={handleInputChange} // 입력값 변경 이벤트 처리
        />
        <Link
          to="/chat"
          state={{ userMessage: inputText }} // state 전달
          className="send-button"
          aria-label="전송 버튼"
          onClick={() => {
            console.log('InputText:', inputText);
            setInputText('');
          }}
          style={{ pointerEvents: inputText.trim() ? 'auto' : 'none' }} // 입력값이 없으면 버튼 비활성화
        >
          <span className="arrow-icon">➤</span>
        </Link>
        <button className="mic-button" aria-label="음소거 버튼">
          <span className="mic-icon">🔇</span>
        </button>
      </div>
    </div>
    </Container>
   
  );
}

export default EYmain;
