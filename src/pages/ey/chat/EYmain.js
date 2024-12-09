import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './EYmain.module.css'; // 스타일링을 위한 CSS 파일 import
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
    if (e.key === 'Enter') {
      //~ 이벤트가 발생했을 때 브라우저에서 해당 이벤트의 기본 동작을 막는다.
      //* SPA에서는 페이지 새로고침을 막아야 한다. 왜?

      e.preventDefault(); // 기본 Enter 키 동작(예: 폼 제출)을 방지
      handleSend(); // 메시지 전송
    }
  };

  return (
    <Container>
      <div className={styles['welcome-container']}>
        <h1 className={styles['welcome-title']}>
          점심은 드셨나요?<br />오늘 드신 점심메뉴를 이야기해주세요!
        </h1>
        <p className={styles['welcome-description']}>
          말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.
        </p>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="오늘 날씨가 참 좋네."
            className={styles['text-input']}
            aria-label="대화 입력창"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Enter 키 핸들러 추가
          />
          <Link
            to="/chat"
            state={{ userMessage: inputText }} //* 현재 입력한 메시지(inputText)를 chatPage로 전달한다.
            className={`${styles['send-button']} ${styles['button']}`}
            aria-label="전송 버튼"
            onClick={() => {
              console.log('InputText:', inputText);
              setInputText('');
            }}
            style={{ pointerEvents: inputText.trim() ? 'auto' : 'none' }} // 입력값이 없으면 버튼 비활성화
          >
            <span className={styles['arrow-icon']}>➤</span>
          </Link>
          <button
            className={`${styles['mic-button']} ${styles['button']}`} // 공통 클래스 추가
            aria-label="음소거 버튼"
            onClick={() => {
              console.log('Mic button clicked');
            }}
          >
            <span className={styles['mic-icon']}>🔇</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default EYmain;
