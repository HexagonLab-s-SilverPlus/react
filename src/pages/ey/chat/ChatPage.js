import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';
import { AuthContext } from '../../../AuthProvider.js';
import SeniorSideBar from '../../../components/common/SeniorSideBar.js';
import { marked } from 'marked';

function ChatPage() {
  const location = useLocation();
  const { workspaceId: paramWorkspaceId } = useParams();
  const { workspaceId: stateWorkspaceId, aiReply } = location.state || {};
  const workspaceId = stateWorkspaceId || paramWorkspaceId;

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { apiSpringBoot, accessToken, apiFlask, member } = useContext(AuthContext);
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
    if (workspaceId) {
      setSelectedWorkspaceId(workspaceId);
      fetchChatHistory();
    }
    if (aiReply) {
      setMessages(prev => [...prev, { sender: 'AI', text: aiReply }]);
    }
  }, [workspaceId, aiReply]);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'USER', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'AI', text: "AI 응답 생성 중..." }]);

    try {
      const response = await apiFlask.post(
        '/chat',
        {
          message: inputText,
          createWorkspace: false
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: localStorage.getItem('refreshToken')
          },
        }
      );

      const { reply } = response.data;
      const aiMessage = { sender: 'AI', text: reply };

      setMessages(prev => prev.slice(0, -1).concat(aiMessage));
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      setMessages(prev =>
        prev.slice(0, -1).concat({ sender: 'AI', text: "AI 응답 생성에 실패했습니다. 다시 시도해주세요." })
      );
    } finally {
      setInputText('');
      setIsLoading(false);
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

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarVisible : ''}`}>
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
            {messages.map((message, index) => {
              if (index % 2 === 0) {
                const aiMessage = messages[index + 1] || { text: isLoading ? "AI 응답 생성 중 ..." : "" };

                console.log(marked(aiMessage.text));

                return (
                  <div key={index} className={styles['message-set']}>
                    <div className={`${styles['chat-bubble']} ${styles['user-message']}`}>
                      <p>{message.text}</p>
                    </div>
                    {aiMessage && (
                      <div className={`${styles['chat-bubble']} ${styles['ai-response']} ${styles['markdown']}`}
                        dangerouslySetInnerHTML={{ __html: marked(aiMessage.text) }}>
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
    </div>
  );
}

export default ChatPage;
