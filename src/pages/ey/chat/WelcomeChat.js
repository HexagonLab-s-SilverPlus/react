import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './WelcomeChat.module.css'; // 스타일링을 위한 CSS 파일 import
import Container from './Container.js';
import { AuthContext } from '../../../AuthProvider.js';

function WelcomeChat() {
  // 입력 상태 관리
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const [workspaceId, setWorkspaceId] = useState(null);
  const { apiSpringBoot, apiFlask, member, accessToken } = useContext(AuthContext);


  /*
      <AuthContext.Provider
        value={{ ...authInfo, login, logout, refreshAccessToken, apiSpringBoot }}
      >
        {children}
      </AuthContext.Provider>
    );

          setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          memName: parsedToken.name,
          memId: parsedToken.sub,
          accessToken: accessToken,
          refreshToken: refreshToken,
          member: parsedToken.member,
        });
  */

  // 워크스페이스 확인 함수
  const fetchWorkspace = async () => {
    if (!member?.memUUID) { // member.memUUID가 비어 있는 경우 경고고
      console.warn("member.memUUID가 비어 있습니다.");
      return;

    }
    try {
      console.log("memUUID: ", member.memUUID);


      // 워크스페이스 조회하는 스프링부트 엔드포인트 get 요청
      const response = await apiSpringBoot.get(`/api/workspace/${member.memUUID}`);
      const { data } = response.data; // 워크스페이스 DTO 반환환
      if (data) {
        console.log("워크스페이스 있다:", data);
        setWorkspaceId(data.workspaceId); // 워크스페이스 DTO로부터터 고유ID 추출해서 setter
        // 워크스페이스가 존재할 경우 해당 워크스페이스로 이동동
        navigate(`/w/${data.workspaceId}`, { state: { workspaceId: data.workspaceId } });
      } 
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("워크스페이스가 존재하지 않습니다.");
      } else {
        // axios 호출 중 에러가 발생하면 출력되는 콘솔로그
        console.error('워크스페이스 확인 중 오류:', error);
      }
    }
  };

  // 컴포넌트 마운트 시 워크스페이스 확인
  useEffect(() => {
    console.log('member:', member);

    if (member?.memUUID) {
      fetchWorkspace();
    }
  }, [member.memUUID]); // 로그인한 멤버가 바뀔 때마다 워크스페이스 조회를 해 옴



  // 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => setInputText(e.target.value);


  // 메시지 전송 함수
  // handleSend를 쓴다는 것 자체가 기존의 워크스페이스가 전무하다는 뜻
  // 따라서, 메시지 전송 = 워크스페이스 새로 생성 및 이동
  const handleSend = async () => {
    if (!inputText.trim()) return; // 빈 입력값 방지

    console.log('InputText:', inputText);

    try {
      console.log("AccessToken: ", accessToken);

      // 전송한 메시지와 함께 Flask 서버의 채팅 저장 엔드포인트 post 호출하면서 ai 응답을 기다림
      const response = await apiFlask.post('/chat', { message: inputText }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { reply, workspaceId: newWorkspaceId } = response.data;

      // 워크스페이스 ID와 AI 응답 처리리
      if (newWorkspaceId) {
        setWorkspaceId(newWorkspaceId); // 워크스페이스 ID 저장장
        navigate(`w/${newWorkspaceId}`, { 
          state: { workspaceId: newWorkspaceId, aiReply: reply },
         });
      }

      console.log('AI Reply:', reply);
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
    }
  };

  // Enter 키 감지 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      //~ 이벤트가 발생했을 때 브라우저에서 해당 이벤트의 기본 동작을 막는다.
      //* SPA에서는 페이지 새로고침을 막아야 한다. 왜? SPA는 한 번에 모든 페이지 리소스를 가져오기 때문에 네트워크 ........ 
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
          {/* <Link
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
          </Link> */}
          <button
            className={styles['send-button']}
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            전송
          </button>
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

export default WelcomeChat;
