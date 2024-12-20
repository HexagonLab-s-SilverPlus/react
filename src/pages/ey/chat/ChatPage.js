/* 전달받은 워크스페이스 ID를 기반으로 채팅 기록을 로드하고 새 메시지를 보내는 기능능 */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ChatPage.module.css';
import Container from './Container.js';
import { AuthContext } from '../../../AuthProvider.js';

function ChatPage() {
  //& React Router에서 현재 경로와 관련된 정보를 가져온다.
  const location = useLocation();
  const { workspaceId, aiReply } = location.state || {};
  //& location.state는 Link에서 전달된 데이터를 포함한다.
  /*
  ^   ?. 는 옵셔널 체이닝(Optional Chaining)이다. state가 undefined인 경우 에러를 방지해준다.
  ^   예) location.state가 존재하지 않으면 undefined를 반환하고, 그 다음 속성을 읽지 않는다.
  */
  const initialMessage = location.state?.userMessage || '';

  // 메시지 상태변수 - 배열 형태 [사용자: '', AI: '']
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const { apiSpringBoot, accessToken, apiFlask } = useContext(AuthContext);

  const fetchChatHistory = async () => {
    try {
      const response = await apiSpringBoot.get(`/api/chat/history/${workspaceId}`);
      const { data } = response.data;

      if (data) {
        console.log('메시지 이력:', data)
        setMessages(data.map(msg => ({ sender: msg.msgSenderRole, text: msg.msgContent })));
      }else{
        console.log('AI와 나눈 대화 없음:', response.message);
      }
    } catch (error) {
      console.error("채팅 기록 불러오기 오류:", error);
    }
  };


  useEffect(() => {
    if (workspaceId) {
      fetchChatHistory();
    }

    if (aiReply) {
      setMessages(prev => [...prev, { sender: 'AI', text: aiReply }]);
    }
  }, [workspaceId, aiReply]);









  /*
  & useRef: DOM 요소를 참조하기 위해 사용한다.
  & 여기서는 스크롤을 제어할 마지막 메시지를 참조한다.
  */
  const chatEndRef = useRef(null);

  //   function getAiResponse(userMessage) {
  //     return `어깨 통증이 계속되면 몸이 더 힘들어지실 수 있으니, 
  // 가능한 한 편하게 쉬시는 것도 중요해요. 
  // 따뜻한 찜질을 하거나 어깨를 살짝 풀어주는 스트레칭도 도움이 될 수 있답니다. 
  // 혹시라도 증상이 심해지면 병원에 가보시는 게 좋을 것 같아요. 
  // 제가 더 필요한 정보나 방법이 있다면 언제든 알려드릴게요.`;
  //   }

  const handleInputChange = (e) => setInputText(e.target.value);


  const handleSendMessage = async() => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'USER', text: inputText };
    setMessages(prev => [...prev,  userMessage]);

    try{
      // Flask 서버로 메시지 전송송
      const response = await apiFlask.post(
        '/chat',
        { message: inputText },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );


      const { reply } = response.data;
      const aiMessage = { sender: 'AI', text: reply };

      setMessages(prev => [...prev, aiMessage]);
    }catch(error){
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

  return (
    <Container>
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
              return (
                <div key={index} className={styles['message-set']}>
                  <div className={`${styles['chat-bubble']} ${styles['user-message']}`}>
                    <p>{message.text}</p>
                  </div>
                  {aiMessage && ( // AI 응답이 있는 경우에만 렌더링
                    <div className={`${styles['chat-bubble']} ${styles['ai-response']}`}>
                      <p>{aiMessage.text}</p>
                    </div>
                  )}
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
  );
}

export default ChatPage;
