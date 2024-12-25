/* 전달받은 워크스페이스 ID를 기반으로 채팅 기록을 로드하고 새 메시지를 보내는 기능능 */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';
import { AuthContext } from '../../../AuthProvider.js';
// 사이드바 컴포넌트 가져오기
import SeniorSideBar from '../../../components/common/SeniorSideBar.js';
import { marked } from 'marked'; // marked 라이브러리 추가가 

function ChatPage() {
  const location = useLocation(); //  WelcomeChat.js에서 state로 전달한 값 받기 위함임.
  const { workspaceId: paramWorkspaceId } = useParams(); // URL에서 workspaceId 가져오기기
  const { workspaceId: stateWorkspaceId, aiReply } = location.state || {};  //  location.state는 Link에서 전달된 데이터를 포함한다.
  const workspaceId = stateWorkspaceId || paramWorkspaceId; // state에서 먼저 가져오고 없으면 URL에서 가져옴

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId); // 선택된 워크스페이스 ID

  // 메시지 상태변수 - 배열 형태 [사용자: '', AI: '']
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 사이드바 가시성 상태
  const { apiSpringBoot, accessToken, apiFlask, member } = useContext(AuthContext);

  /*
    & useRef: DOM 요소를 참조하기 위해 사용한다.
    & 여기서는 스크롤을 제어할 마지막 메시지를 참조한다.
  */
  const chatEndRef = useRef(null);



  const fetchChatHistory = async () => {
    if (!workspaceId) return;

    try {
      const response = await apiSpringBoot.get(`/api/chat/history/${workspaceId}`);
      const { data } = response?.data || {};

      if (Array.isArray(data)) {
        console.log('메시지 이력:', data)
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
      setSelectedWorkspaceId(workspaceId); // URL이나 state로 전달받은 workspaceId를 선택 상태로 설정
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

    try {
      // Flask 서버로 메시지 전송송
      const response = await apiFlask.post(
        '/chat',
        {
          message: inputText,
          createWorkspace: false // 기존 워크스페이스에서 메시지 전송 플래그
        },

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: localStorage.getItem('refreshToken') // RefreshToken 추가
          },
        }
      );


      const { reply } = response.data;
      const aiMessage = { sender: 'AI', text: reply };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
    }

    /*
    ^ 상태를 업데이트할 때 이전 메시지(messages) 배열에 새로운 메시지와 AI 응답을 추가한다.
    ^ 배열 순서: 1. 사용자가 메시지가 먼저, AI 응답이 나중에 추가된다.
    ^            2. 순서가 바뀌면 대화 흐름이 이상해지므로 바꾸지 않아야 한다. (USER -> AI)
    */
    // setMessages([...messages, newMessage, aiMessage]);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };


  //
  useEffect(() => {
    /*
    ~ chatEndRef.current가 존재하면 해당 요소로 스크롤하는데
    ~ behavior: 'smooth'는 부드럽게 스크롤하는 효과를 추가한다.
    */
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // 토글바로 사이드바 메뉴 출력
  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  }

  return (
    <div className={styles.container}>
      {/* 사이드바 */}
      <div
        className={`${styles.sidebar} ${isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
          }`}
      >
        <SeniorSideBar
          memUUID={member?.memUUID}
          selectedWorkspaceId={selectedWorkspaceId}
          setSelectedWorkspaceId={setSelectedWorkspaceId}  // 선택 상태 업데이트 함수 전달
        />
      </div>

      {/* 토글 버튼 */}
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        {isSidebarVisible ? '닫기' : '워크스페이스 열기'}
      </button>
      <Container>

        {/* 채팅 영역 */}
        <div className={styles['chat-container']}>
          <div className={styles['chat-page']}>
            {
              //^ messages 배열의 각 요소를 순회하면서 JSX를 반환한다.
            }
            {messages.map((message, index) => {
              {
                //~ 짝수 인덱스에서만 사용자 메시지와 AI 응답 세트를 처리한다.
                //~ 예) 0번 인덱스는 사용자 메시지, 1번 인덱스는 AI 응답.
              }
              if (index % 2 === 0) { // 메시지 세트를 구성하기 위해 짝수 인덱스만 처리
                const aiMessage = messages[index + 1]; // AI 응답은 항상 다음 인덱스에 위치

                console.log(marked(aiMessage.text)); // 변환된 HTML 확인

                return (
                  <div key={index} className={styles['message-set']}>
                    <div className={`${styles['chat-bubble']} ${styles['user-message']}`}>
                      <p>{message.text}</p>
                    </div>
                    {aiMessage && ( // AI 응답이 있는 경우에만 렌더링
                      <div className={`${styles['chat-bubble']} ${styles['ai-response']} ${styles['markdown']}`}
                        dangerouslySetInnerHTML={{ __html: marked(aiMessage.text) }}> 
                      </div>
                      
                    )
                    }
                  </div>
                );
              }
              //* 홀스 인덱스(AI 응답)은 이미 세트로 처리되었으므로 아무것도 반환하지 않는다.
              return null; // 홀수 인덱스 메시지는 이미 처리된 상태이므로 렌더링하지 않음
            })}
            {
              //^ 마지막 메시지를 참조하기 위한 요소다.
              //^ chatEndRef 가 이 요소를 가리켜 스크롤을 제어한다.
            }
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
