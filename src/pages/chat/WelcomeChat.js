import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomeChat.module.css';
import Container from './Container.js';
import { AuthContext } from '../../AuthProvider.js';
import SeniorSideBar from '../../components/common/SeniorSideBar.js';
import SeniorNavbar from '../../components/common/SeniorNavbar.js';

function WelcomeChat() {
  const [userFirstMsg, setUserFirstMsg] = useState(''); // 사용자 첫 입력 메시지
  const navigate = useNavigate();
  const { apiFlask, member, accessToken } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 사이드바 상태 관리

  // 사용자 입력 처리
  const handleInputChange = (e) => setUserFirstMsg(e.target.value);

  // 메시지 전송 및 워크스페이스 생성
  const handleSend = async () => {
    if (!userFirstMsg.trim()) return;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiFlask.post(
        '/chat',
        {
          message: userFirstMsg, // 사용자 입력 메시지
          createWorkspace: true, // 워크스페이스 생성 요청
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: `Bearer ${refreshToken}`,
          },
          withCredentials: true,
        },
      );

      const { workspaceId } = response.data; // 생성된 워크스페이스 ID
      if (!workspaceId) {
        alert('워크스페이스 생성에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      // 생성된 워크스페이스 ID를 ChatPage로 전달하며 이동
      navigate(`/w/${workspaceId}`, {
        state: { userFirstMsg }, // 사용자 첫 메시지를 상태로 전달
      });
    } catch (error) {
      console.error('Flask 서버 호출 중 오류:', error);
      alert('메시지 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 사이드바 토글
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  return (
    <div>
      <SeniorNavbar />
      <div className={styles.container}>
        {/* 사이드바 */}
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden}`}>
          <SeniorSideBar memUUID={member?.memUUID} />
        </div>
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
          {isSidebarVisible ? '닫기' : '워크스페이스 열기'}
        </button>
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
                value={userFirstMsg}
                onChange={handleInputChange}
              />
              <button
                className={`${styles['send-button']} ${styles['button']}`}
                onClick={handleSend}
              >
                <span className={styles['arrow-icon']}>➤</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default WelcomeChat;
