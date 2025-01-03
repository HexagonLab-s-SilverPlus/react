import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DocumentChatPage.module.css';
import { AuthContext } from '../../../AuthProvider.js';
import { marked } from 'marked';
import DocumentService from './DocumentService.js';
import Container from '../chat/Container.js';


// 문서 유형 매핑 테이블
const documentTypeMap = {
  address: '전입신고서',
  death: '사망신고서',
  medical: '의료급여 신청서',
  basic: '기초연금 신청서',
};



function DocumentChatPage() {
  const { documentType } = useParams(); // URL에서 문서 유형 가져오기
  const { apiFlask, accessToken } = useContext(AuthContext); // Context에서 apiFlask 가져오기
  const documentService = DocumentService(apiFlask, accessToken); // DocumentService를 apiFlask로 생성
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [keys, setKeys] = useState([]);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Flask 서버에서 기대하는 문서 유형으로 변환
  const serverDocumentType = documentTypeMap[documentType];



  // 문서 키 가져오기
  useEffect(() => {
    const fetchKeys = async () => {
      // 문서 유형 검증
      if (!serverDocumentType) {
        console.error('문서 유형이 잘못되었습니다:', documentType);
        return;
      }

      try {
        const response = await documentService.getKeys(serverDocumentType);
        setKeys(response.keys || []);


        if (response.keys.length > 0) {
         const firstKey = response.keys[0];
         const question = await documentService.generateQuestion(firstKey);

         setMessages([{ sender: 'AI', text: question }]);
        }else{
          console.error('문서 키가 없습니다.');
        }
      } catch (error) {
        console.error('문서 키 가져오기 오류:', error);
      }
    };


    fetchKeys(); // useEffect의 dependency가 잘못 설정되었을 경우 무한 호출 가능
  }, [serverDocumentType]);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const currentKey = keys[currentKeyIndex];
    const userMessage = { sender: 'USER', text: inputText };

    setAnswers((prev) => ({ ...prev, [currentKey]: inputText }));
    setMessages((prev) => [...prev, userMessage]);

    const nextKeyIndex = currentKeyIndex + 1;

    if (nextKeyIndex < keys.length) {
      try{
        const nextKey = keys[nextKeyIndex];
        const question = await documentService.generateQuestion(nextKey);

        setMessages((prev) => [...prev, { sender: 'AI', text: question }]);
        setCurrentKeyIndex(nextKeyIndex);
      }catch(error){
        console.error('질문 생성 오류:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: '질문 생성 중 오류가 발생했습니다. 다시 시도해주세요.' },
        ]);
      }
    } else {
      setIsLoading(true);

      try {
        const response = await documentService.submitDocument(documentType, answers);
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: '문서 작성이 완료되었습니다. 아래에서 다운로드하세요.' },
        ]);
        setInputText('');
        window.location.href = response.file_path; // 다운로드 링크
      } catch (error) {
        console.error('문서 제출 오류:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: '문서 작성 중 오류가 발생했습니다. 다시 시도해주세요.' },
        ]);
      } finally {
        setIsLoading(false);
      }
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

  return (
    <Container>
      <div className={styles['chat-container']}>
        <div className={styles['chat-page']}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles['chat-bubble']} ${message.sender === 'USER' ? styles['user-message'] : styles['ai-response']
                }`}
            >
              {message.sender === 'AI' ? (
                <div
                  className={styles['markdown']}
                  dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                ></div>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          ))}
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
            disabled={!inputText.trim() || isLoading}
          >
            <span className={styles['arrow-icon']}>➤</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

export default DocumentChatPage;
