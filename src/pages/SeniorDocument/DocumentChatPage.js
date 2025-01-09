import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DocumentChatPage.module.css';
import { AuthContext } from '../../AuthProvider.js';
import { marked } from 'marked';
import DocumentService from './DocumentService.js';
import Container from '../chat/Container.js';
import SeniorNavbar from '../../components/common/SeniorNavbar.js';
import { Player } from '@lottiefiles/react-lottie-player'; // Lottie import


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


      // AI의 첫 질문 로딩 상태 추가
      setMessages([{ sender: 'AI', loading: true }]);



      try {
        const response = await documentService.generateQuestion(serverDocumentType);
        console.log('API 응답:', response);

        if (!response || !Array.isArray(response) || response.length === 0) {
          console.error('유효하지 않은 질문 응답:', response);
          setMessages([{ sender: 'AI', text: '질문 생성에 실패했습니다. 다시 시도해주세요.', loading: false }]);
          return;
        }

        // setKeys(response.map((q) => q.key)); // keys에는 key만 저장
        setQuestions(response); // 질문과 키를 함께 저장


        // 첫 번째 질문 추가 및 로딩 해제
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            sender: 'AI',
            text: response[0]?.question || '질문이 없습니다.',
            loading: false,
          };
          return updatedMessages;
        });

        setFileName(`${serverDocumentType}`); // 동적 파일 이름 설정
      } catch (error) {
        console.error('질문 생성 오류:', error);
        setMessages([{ sender: 'AI', text: '질문 생성 중 오류가 발생했습니다.', loading: false }]);
      }
    };

    fetchQuestions();
  }, [serverDocumentType]);



  const handleInputChange = (e) => setInputText(e.target.value);




  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'USER', text: inputText };
    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = questions[currentKeyIndex];
    if (!currentQuestion) {
      console.error('현재 질문이 정의되지 않았습니다.');
      return;
    }

    // 사용자 응답 저장
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: inputText }));


    setMessages((prev) => [...prev, { sender: 'AI', loading: true }]); // 로딩 상태 추가

    const nextKeyIndex = currentKeyIndex + 1;

    if (nextKeyIndex < questions.length) {
      setTimeout(() => {
        const nextQuestion = questions[nextKeyIndex].question;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1], // 이전 메시지 복사
            text: nextQuestion, // AI질문 텍스트 추가
            loading: false, // 로딩 상태 해제
          };
          return updatedMessages;
        });
        setCurrentKeyIndex(nextKeyIndex);
      }, 2000); // 로딩 애니메이션 유지
    } else {
      setIsLoading(true);
      try {
        const response = await documentService.submitDocument(documentType, answers);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            sender: 'AI',
            text: response.csvPath
              ? '성공적으로 문서가 생성되었습니다. 아래 버튼을 클릭해 다운로드하세요.'
              : '문서 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
            attachments: response.csvPath
              ? [{ label: 'CSV 파일', url: `${response.csvPath}` }]
              : [],
            loading: false, // 로딩 상태 해제
          };
          return updatedMessages;
        });

      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: '문서 제출 중 오류가 발생했습니다.', loading: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };




  const downloadFile = async (filePath) => {
    if (!filePath) {
      console.error("파일 경로가 비어 있습니다.");
      return;
    }

    try {
      console.log('파일 경로:', filePath);

      const response = await apiFlask.get(`/download-document`, {
        params: { csv_path: filePath }, // 여기서 filePath는 경로만 포함해야 함 (e.g. 'processed/address.csv')
        headers: {
          Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
          RefreshToken: `Bearer ${refreshToken}`,
        },
        responseType: 'blob', // 파일 다운로드를 위해 blob 타입 설정
      });

      // 파일 이름 추출: '_' 뒤의 문자열만 추출
      const fileName = filePath.includes('_')
        ? filePath.split('_').pop() // '_' 뒤의 문자열 추출
        : filePath.split('/').pop(); // 기본 파일 이름 추출

      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 파일 이름 설정
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
    if (chatEndRef.current) {
      console.log('스크롤 이동: ', chatEndRef.current);
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.pageWrapper}>
      <SeniorNavbar />
      <Container>
        <div className={styles['chat-container']}>
          <div className={styles['chat-page']}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles['chat-bubble']} ${message.sender === 'USER' ? styles['user-message'] : styles['ai-response']
                  }`}
              >
                {/* 로딩 상태일 때 Lottie 애니메이션 */}
                {message.loading ? (
                  <Player
                    autoplay
                    loop
                    src="/lottie/doc-loading-anime.json" // Lottie 파일 경로
                    style={{ height: '150px', width: '150px' }}
                    className={styles['lottie-player']}
                  />
                ) : (
                  <div
                    className={styles['markdown']}
                    dangerouslySetInnerHTML={{ __html: marked(message.text || '') }}
                  ></div>
                )}

                {/* 첨부파일 */}
                {message.attachments && (
                  <div className={styles['attachments']}>
                    {message.attachments.map((attachment, idx) => (
                      <button
                        key={idx}
                        className={styles['attachment-button']}
                        onClick={() => {
                          if (attachment.url) {
                            downloadFile(attachment.url); // 파일 다운로드 실행
                          } else {
                            console.error('첨부 파일 경로가 비어 있습니다:', attachment);
                          }
                        }}
                      >
                        {attachment.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* 이 위치에 항상 chatEndRef를 배치 */}
            <div ref={chatEndRef} />
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
    </div>
  );

}
export default DocumentChatPage;
