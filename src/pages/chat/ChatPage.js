import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';
import { AuthContext } from '../../AuthProvider.js';
import SeniorSideBar from '../../components/common/SeniorSideBar.js';
import { marked } from 'marked';
import SeniorNavbar from '../../components/common/SeniorNavbar.js';
import { Player } from '@lottiefiles/react-lottie-player';
import EMG from '../../components/emg/EMG.js';

function ChatPage() {
  const location = useLocation();
  const { workspaceId: paramWorkspaceId } = useParams();
  const { workspaceId: stateWorkspaceId, aiReply } = location.state || {};
  const workspaceId = stateWorkspaceId || paramWorkspaceId;

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId);
  const [messages, setMessages] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { apiSpringBoot, accessToken, apiFlask, member } = useContext(AuthContext);
  const chatEndRef = useRef(null);
  const [inputText, setInputText] = useState(''); // 입력창 텍스트 관리

  const [session, setSession] = useState(''); // 세션 상태

  // EMG 상태 관리
  const [onCamera, setOnCamera] = useState(false);


  const aiReplyAdded = useRef(false); // AI 메시지 추가 여부 추적




  // 위험 키워드
  const dangerKeywords = ['아프다', '쓰러졌다', '도와줘', '긴급'];



  const fetchChatHistory = async () => {
    if (!workspaceId) return;

    try {
      const response = await apiSpringBoot.get(`/api/chat/history/${workspaceId}`);
      const { data } = response?.data || {};

      if (Array.isArray(data)) {
        console.log('메시지 이력:', data);
        setMessages(data.map(msg => ({
          sender: msg.msgSenderRole,
          text: msg.msgContent,
        })));
      } else {
        console.warn('채팅 기록 데이터가 비정상적입니다.:', response?.data);
        setMessages([]);
      }
    } catch (error) {
      console.error("채팅 기록 불러오기 오류:", error);
      setMessages([]);
    }
  };


  useEffect(() => {
    const initializeMessages = async () => {
        if (!workspaceId) return;
        
        setSelectedWorkspaceId(workspaceId);
        await fetchChatHistory();

        if (aiReply && !aiReplyAdded.current) {
            aiReplyAdded.current = true; // 중복 방지
            setMessages(prev => [
                ...prev.filter(msg => msg.text !== aiReply), // 기존 AI 메시지 제거
                { sender: "USER", text: location.state.userMessage },
                { sender: "AI", text: aiReply },
            ]);
        }
    };

    initializeMessages();
}, [workspaceId, aiReply]);






  // 사이드바 토글
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);




  // 메시지 전송 핸들러
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

      const { reply, audioBase64 } = response.data;

      // 로딩 상태 해제 및 AI 응답 추가
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          sender: 'AI',
          text: reply,
          loading: false,
        };

        // Base64 오디오 재생
        if (audioBase64) {
          const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
          audio.play();
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: 'AI 응답 생성 실패. 다시 시도해주세요.', loading: false },
      ]);
    }
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


  // 세션 종료 핸들러
  const handleEndSession = async () => {
    try {
      const response = await apiSpringBoot.patch('/api/session/update-status', null, {
        params: {
          workspaceId: selectedWorkspaceId,
          status: 'COMPLETED',
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

  // 워크스페이스로 세션 조회하는 핸들러
  // 세션 종료 핸들러
  const getSession = async () => {
    try {
      const response = await apiSpringBoot.patch('/api/session/update-status', null, {
        params: {
          workspaceId: selectedWorkspaceId,
          status: 'COMPLETED',
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


  // 위험 키워드 감지
  useEffect(() => {
    const checkDangerKeywords = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'USER') {
        const isDangerous = dangerKeywords.some((keyword) => lastMessage.text.includes(keyword));
        if (isDangerous) {
          handleStartEMG();
        }
      }
    };

    checkDangerKeywords();
  }, [messages]);


  // 워크스페이스ID를 파라미터로 활성화 상태인 세션 조회
  useEffect(() => {
    const getSessionByWorkspaceId = async () => {
      try {
        const response = await apiSpringBoot.get(`/api/session/${workspaceId}`);
        console.log('세션:', response.data.data);
        setSession(response.data.data.sessId); // ChatSession의 sessId를 세션 상태에 setter

      } catch (error) {
        console.error('세션 조회 중 에러: ', error)
      }
    }
    getSessionByWorkspaceId();

  }, [workspaceId]
  );



  // EMG 활성화 핸들러
  const handleStartEMG = () => {
    setOnCamera(true);
  };

  // EMG 비활성화 핸들러
  const handleStopEMG = () => {
    setOnCamera(false);
  };


  return (
    <div>
      {/* SeniorNavbar 고정 */}
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
          {isSidebarVisible ? '닫기' : '열기'}
        </button>




        {/* EMG 컴포넌트 */}
        <div>
          {onCamera ? (
            <EMG onCamera={onCamera} sessId={session} />
          ) : (
            <EMG onCamera={onCamera} sessId={session} />
          )}
        </div>




        <div className={styles.chatContainer}>
          <div
            className={`${styles['chat-container']} ${isSidebarVisible ? styles.sidebarOpen : styles.sidebarClosed}`}
          >
            <div className={styles['chat-page']}>



              <button className={styles.emergencyButton} onClick={handleStartEMG}>
                비상 상황
              </button>




              <div id="read">

                {messages.map((message, index) => {
                  const isDuplicateAIMessage =
                    message.sender === "AI" &&
                    index > 0 &&
                    messages[index - 1]?.sender === "AI" &&
                    messages[index - 1]?.text === message.text;

                  if (isDuplicateAIMessage) {
                    return null; // 중복 메시지 렌더링 생략
                  }

                  return (
                    <div
                      key={index}
                      className={`${styles["chat-bubble"]} ${message.sender === "USER" ? styles["user-message"] : styles["ai-response"]
                        }`}
                    >
                      {message.sender === "AI" && message.loading && !message.text ? (
                        <Player
                          autoplay
                          loop
                          src="/lottie/doc-loading-anime.json"
                          style={{ height: "150px", width: "150px" }}
                        />
                      ) : (
                        <div
                          className={styles["markdown"]}
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        ></div>
                      )}
                    </div>
                  );
                })}

              </div>
              <div ref={chatEndRef}></div>
            </div>
          </div>
        </div>
      </div>



      <div
        className={`${styles['input-container']} ${isSidebarVisible ? styles['sidebar-open'] : styles['sidebar-closed']
          }`}
      >
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
  );
}

export default ChatPage;
