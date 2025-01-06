import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DocumentChatPage.module.css';
import { AuthContext } from '../../../AuthProvider.js';
import { marked } from 'marked';
import DocumentService from './DocumentService.js';
import Container from '../chat/Container.js';



function DocumentChatPage() {
  const { documentType } = useParams(); // URL에서 문서 유형 가져오기
  const { apiFlask, accessToken, refreshToken } = useContext(AuthContext); // Context에서 apiFlask 가져오기
  const documentService = DocumentService(apiFlask, accessToken, refreshToken); // DocumentService를 apiFlask로 생성
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fileName, setFileName] = useState(""); // 동적 파일 이름 저장
  const [questions, setQuestions] = useState([]); // 질문과 키를 함께 저장


  // 문서 유형 매핑 테이블
  const documentTypeMap = {
    address: '전입신고서',
    death: '사망신고서',
    medical: '의료급여 신청서',
    basic: '기초연금 신청서',
  };

  // Flask 서버에서 기대하는 문서 유형으로 변환
  const serverDocumentType = documentTypeMap[documentType];

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!serverDocumentType) {
        console.error('문서 유형이 잘못되었습니다:', documentType);
        return;
      }

      try {
        const response = await documentService.generateQuestion(serverDocumentType);
        console.log('API 응답:', response);

        if (!response || !Array.isArray(response) || response.length === 0) {
          console.error('유효하지 않은 질문 응답:', response);
          setMessages([{ sender: 'AI', text: '질문 생성에 실패했습니다. 다시 시도해주세요.' }]);
          return;
        }

        // setKeys(response.map((q) => q.key)); // keys에는 key만 저장
        setQuestions(response); // 질문과 키를 함께 저장
        setMessages([{ sender: 'AI', text: response[0]?.question || '질문이 없습니다.' }]); // 첫 번째 질문 설정
        setFileName(`${serverDocumentType}`); // 동적 파일 이름 설정
      } catch (error) {
        console.error('질문 생성 오류:', error);
        setMessages([{ sender: 'AI', text: '질문 생성 중 오류가 발생했습니다.' }]);
      }
    };

    fetchQuestions();
  }, [serverDocumentType]);



  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'USER', text: inputText };
    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = questions[currentKeyIndex]; // 현재 질문 가져오기
    if (!currentQuestion) {
      console.error('현재 질문이 정의되지 않았습니다.');
      return;
    }

    // 사용자 응답을 answers에 저장
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: inputText })); // key-value 저장

    const nextKeyIndex = currentKeyIndex + 1;

    if (nextKeyIndex < questions.length) {
      const nextQuestion = questions[nextKeyIndex]?.question || '질문이 없습니다.';
      setMessages((prev) => [...prev, { sender: 'AI', text: nextQuestion }]);
      setCurrentKeyIndex(nextKeyIndex);
    } else {
      try {
        setIsLoading(true);
        const response = await documentService.submitDocument(documentType, answers);


        setMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: '성공적으로 문서가 생성되었습니다. 아래 링크를 클릭해 다운로드하세요.',
            attachments: [
              {
                label: 'CSV 파일',
                url: `${response.csv_path}`, // 경로만 설정
              },
            ],
          },
        ]);
        // window.location.href = response.file_path; // 다운로드 링크
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




  const downloadFile = async (filePath) => {
    try {
      console.log('파일 경로:', filePath);

      const response = await apiFlask.get(`/download-document`, {
        params: { file_path: filePath }, // 여기서 filePath는 경로만 포함해야 함 (e.g. 'processed/address.csv')
        headers: {
          Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
          RefreshToken: `Bearer ${refreshToken}`,
        },
        responseType: 'blob', // 파일 다운로드를 위해 blob 타입 설정
      });

      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop()); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
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
                <div>
                  <div
                    className={styles['markdown']}
                    dangerouslySetInnerHTML={{ __html: marked(message.text || '') }}
                  ></div>
                  {message.attachments && (
                    <div className={styles['attachments']}>
                      {message.attachments.map((attachment, idx) => (
                        <button
                          key={idx}
                          className={styles['attachment-button']}
                          onClick={() => downloadFile(attachment.url)} // 파일 경로만 전달
                        >
                          {attachment.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p>{message.text || '잘못된 메시지 형식입니다.'}</p>
              )}
            </div>
          ))}
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
