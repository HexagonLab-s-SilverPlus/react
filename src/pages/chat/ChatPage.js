import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';
import { AuthContext } from '../../AuthProvider.js';
import SeniorSideBar from '../../components/common/SeniorSideBar.js';
import { marked } from 'marked';
import SeniorNavbar from '../../components/common/SeniorNavbar.js';
import { Player } from '@lottiefiles/react-lottie-player';

function ChatPage() {
  const location = useLocation();
  const { workspaceId: paramWorkspaceId } = useParams();
  const { workspaceId: stateWorkspaceId, userFirstMsg } = location.state || {}; // WelcomeChat에서 전달받은 메시지
  const workspaceId = stateWorkspaceId || paramWorkspaceId;

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId);
  const [messages, setMessages] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { apiSpringBoot, accessToken, apiFlask, member } = useContext(AuthContext);
  const chatEndRef = useRef(null);
  const [inputText, setInputText] = useState(''); // 입력창 텍스트 관리

  // AI 응답 요청 및 메시지 추가
  useEffect(() => {
    const fetchAIReply = async () => {
      try {
        setMessages((prev) => [
          ...prev,
          { sender: 'USER', text: userFirstMsg }, // 사용자 메시지 추가
          { sender: 'AI', loading: true }, // 로딩 상태 추가
        ]);

        const response = await apiFlask.post(
          '/chat',
          {
            message: userFirstMsg,
            createWorkspace: false,
            workspaceId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              RefreshToken: `Bearer ${localStorage.getItem('refreshToken')}`,
            },
          }
        );

        const { reply } = response.data;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { sender: 'AI', text: reply, loading: false };
          return updatedMessages;
        });
      } catch (error) {
        console.error('AI 응답 요청 실패:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: 'AI 응답 생성 실패. 다시 시도해주세요.', loading: false },
        ]);
      }
    };

    if (userFirstMsg) fetchAIReply();
  }, [workspaceId, userFirstMsg]);

  // 사이드바 토글
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);


  // 스프링부트의 세션 종료하는(상태를 COMPLETED로 변경하는) API 호출
  const handleEndSession = async () => {
    try {
      const response = await apiSpringBoot.patch('/api/session/update-status', null, {
        params: {
          workspaceId: selectedWorkspaceId,
          status: 'COMPLETED', // 상태를 변경
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          RefreshToken: `Bearer ${localStorage.getItem('refreshToken')}`
        },
      });
      console.log('세션 종료 성공:', response.data);
    } catch (error) {
      console.error('세션 종료 중 오류:', error);
    }
  };

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };






  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'USER', text: inputText };
    setMessages((prev) => [...prev, userMessage]);

    // 로딩 메시지 추가
    setMessages((prev) => [...prev, { sender: 'AI', loading: true }]);
    setInputText(''); // 입력창 초기화


    try {
      const response = await apiFlask.post(
        '/chat',
        {
          message: inputText,
          createWorkspace: false,
          workspaceId: selectedWorkspaceId,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: `Bearer ${localStorage.getItem('refreshToken')}`
          },
        }
      );

      const { reply } = response.data;

      // 로딩 상태 해제 및 AI 응답 추가
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          sender: 'AI',
          text: reply,
          loading: false,
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: 'AI 응답 생성 실패. 다시 시도해주세요.', loading: false },
      ]);
    } finally {
      setInputText('');
    }
  };





  return (
    <div>
      <SeniorNavbar />
      <div className={styles.container}>
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden}`}>
          <SeniorSideBar
            memUUID={member?.memUUID}
            selectedWorkspaceId={selectedWorkspaceId}
            setSelectedWorkspaceId={setSelectedWorkspaceId}
          />
        </div>
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
          {isSidebarVisible ? '닫기' : '워크스페이스 열기'}
        </button>

        
        <Container>
          <div className={`${styles['chat-container']} ${isSidebarVisible ? 'sidebar-open' : ''}`}>
            <div className={styles['chat-page']}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles['chat-bubble']} ${message.sender === 'USER' ? styles['user-message'] : styles['ai-response']}`}
                >



                  {message.loading ? (
                    <Player autoplay loop src="/lottie/doc-loading-anime.json" style={{ height: '150px', width: '150px' }} />
                  ) : (
                    <div
                      className={styles['markdown']}
                      dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                    ></div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef}></div>


              {/* 세션 종료 버튼임 */}
              <button onClick={handleEndSession} className={styles.endSessionButton}>
                세션 종료
              </button>
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
      </div >
    </div >
  );
}

export default ChatPage;
