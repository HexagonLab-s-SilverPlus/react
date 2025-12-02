import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomeChat.module.css';
import Container from './Container.js';
import { AuthContext } from '../../AuthProvider.js';
import SeniorSideBar from '../../components/common/SeniorSideBar.js';
import SeniorNavbar from '../../components/common/SeniorNavbar.js';
import { streamingFetch } from '../../utils/axios.js';

function WelcomeChat() {
  const [userFirstMsg, setUserFirstMsg] = useState(''); // 사용자 첫 입력 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const navigate = useNavigate();
  const { apiFlask, member, accessToken } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 사이드바 상태 관리

  // 사용자 입력 처리
  const handleInputChange = (e) => setUserFirstMsg(e.target.value);

  // 메시지 전송 및 워크스페이스 생성 (with streaming support)
  const handleSend = async () => {
    if (!userFirstMsg.trim() || isLoading) return;

    setIsLoading(true);
    const messageToSend = userFirstMsg;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // 스트리밍으로 실시간 수신 시도
      let workspaceId = null;
      let fullAiReply = '';
      
      await streamingFetch(
        '/chat-stream',
        {
          message: messageToSend,
          createWorkspace: true,
        },
        {
          accessToken,
          refreshToken,
          onChunk: (chunk, fullText) => {
            // 첫 번째 청크에서 workspaceId를 추출 (JSON 형태로 먼저 올 수 있음)
            if (!workspaceId) {
              try {
                // workspaceId가 JSON으로 먼저 오는지 확인
                const match = fullText.match(/"workspaceId"\s*:\s*"?([^",}\s]+)"?/);
                if (match) {
                  workspaceId = match[1];
                }
              } catch {
                // JSON 파싱 실패는 무시
              }
            }
          },
          onComplete: async (fullText) => {
            fullAiReply = fullText;
            
            // workspaceId가 없으면 기존 방식으로 폴백
            if (!workspaceId) {
              throw new Error('WorkspaceId not found in streaming response');
            }

            // TTS 지연 로딩
            try {
              const ttsResponse = await apiFlask.post('/tts', { text: fullText }, {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  RefreshToken: `Bearer ${refreshToken}`
                },
              });
              if (ttsResponse.data.audioBase64) {
                const audio = new Audio(`data:audio/mpeg;base64,${ttsResponse.data.audioBase64}`);
                audio.play();
              }
            } catch (ttsError) {
              console.error('TTS 오류:', ttsError);
            }

            // 생성된 워크스페이스 ID를 ChatPage로 전달하며 이동
            navigate(`/eyRouter/w/${workspaceId}`, {
              state: { workspaceId, aiReply: fullAiReply, userMessage: messageToSend },
            });
          },
          onError: () => {
            throw new Error('Streaming failed');
          }
        }
      );
    } catch (error) {
      console.error('스트리밍 실패, 기존 방식으로 폴백:', error);
      
      // 폴백: 기존 non-streaming 방식
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await apiFlask.post(
          '/chat',
          {
            message: messageToSend,
            createWorkspace: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              RefreshToken: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          },
        );

        const { workspaceId, audioBase64, reply } = response.data;

        if (!workspaceId) {
          alert('워크스페이스 생성에 실패했습니다. 다시 시도해주세요.');
          return;
        }

        // Base64 오디오 재생
        if (audioBase64) {
          const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
          audio.play();
        }

        // 생성된 워크스페이스 ID를 ChatPage로 전달하며 이동
        navigate(`/eyRouter/w/${workspaceId}`, {
          state: { workspaceId, aiReply: reply, userMessage: messageToSend },
        });
      } catch (fallbackError) {
        console.error('Flask 서버 호출 중 오류:', fallbackError);
        alert('메시지 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };




  // 사용자 입력 처리 및 엔터키 감지
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend(); // 엔터키를 누르면 메시지 전송
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
          {isSidebarVisible ? '닫기' : '열기'}
        </button>
        <Container>
          <div className={styles['welcome-container']}>
            <div id="read">
              <h1 className={styles['welcome-title']}>
                점심은 드셨나요?<br />오늘 드신 점심메뉴를 이야기해주세요!
              </h1>
              <p className={styles['welcome-description']}>
                AI가 어르신의 마음을 돌봅니다.
              </p>

            </div>
            <div className={styles['input-container']}>
              <input
                type="text"
                placeholder="오늘 날씨가 참 좋네."
                className={styles['text-input']}
                value={userFirstMsg}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown} // 엔터키 감지 이벤트 추가
                disabled={isLoading}
              />
              <button
                className={`${styles['send-button']} ${styles['button']}`}
                onClick={handleSend}
                disabled={isLoading}
              >
                <span className={styles['arrow-icon']}>{isLoading ? '...' : '➤'}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default WelcomeChat;
