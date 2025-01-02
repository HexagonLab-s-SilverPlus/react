// react : useState, useContext, useNavigate
import React, { useState, useContext } from "react";
import {useNavigate} from "react-router-dom";
// css
import styles from "./SpeechRecognitionModal.module.css";
// authContext
import { AuthContext } from "../../AuthProvider";


const SpeechRecognitionModal = ({ onClose }) => {
    // 사용자에게 보여줄 메세지
    const [message, setMessage] = useState("이동하고 싶은 페이지를 말씀해주세요.");
    // 음성 인식 결과 저장
    const [recognizedText, setRecognizedText] = useState("");
    // 인증 정보와 flask API URL 가져오기
    const { apiFlask } = useContext(AuthContext);
    // 페이지 이동용
    const navigate = useNavigate();
    // 음성 파일 확인
    const [audioUrl, setAudioUrl] = useState();

    // 음성 인식 처리
    const handleSpeechRecognition = async () => {
        // 메세지 출력력
        setMessage("음성 인식 중...");

        // 음원 정보를 담는 노드 생성 or 음원실행 or 디코딩 시킬변수
        const audioCtx = new window.AudioContext();

        try {
            // 마이크 접근 권한 요청
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // 오디오 녹음을 위한 MediaRecorder 객체 생성
            const mediaRecorder = new MediaRecorder(audioStream);
            // 녹음된 오디오 데이터를 저장할 배열 변수
            const audioChunks = [];
    
            // 녹음중 데이터가 생성 될 때마다 실행되는 이벤트 헨들러
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
                console.log(audioChunks);
            };

            
            
            // 녹음이 종료 되었을때 실행될 핸들러
            mediaRecorder.onstop = async () => {
                // 녹음된 데이터 blob 형태로변환
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                console.log(audioBlob);
                // Flask 서버로 전송할 FormData 생성
                const formData = new FormData();
                // blob 데이터를 audio 필드에 추가가
                formData.append("audio", audioBlob);
    
                try {
                    // flask 서버로 post 요청 보내기
                    const response = await apiFlask.post('/stt/pagerider', formData, {
                        headers:{
                            Accept:"application/json", // json 응답 처리
                        },
                    });
                    // 서버 응답 데이터
                    // 성공시
                    if (response.status === 200) {
                        const data = await response.data;
                        if (data.recognized_text) {
                            setRecognizedText(data.recognized_text);
                            handleNavigation(data.recognized_text);
                        } else {
                            // 실패시시
                            setMessage("음성을 인식하지 못했습니다. 다시 시도해주세요.");
                        }
                    } else {
                        setMessage("서버에서 오류가 발생했습니다.");
                        console.error("서버 오류:", response.statusText);
                    }
                } catch (error) {
                    console.error("Flask 서버 호출 중 오류:", error);
                    // 오류메세지
                    setMessage("서버와 통신 중 문제가 발생했습니다.");
                }
            };
            // 녹음 시작
            mediaRecorder.start();
            // 5초 후 녹음 종료
            setTimeout(() => mediaRecorder.stop(), 5000); // 5초간 녹음
        } catch (error) {
            // 콘솔에 오류 로그 출력
            console.error("마이크 접근 오류:", error);
            // 접근 실패 메시지
            setMessage("마이크에 접근할 수 없습니다.");
        }
    };
    
    // 텍스트에 따라 페이지 이동 처리
    const handleNavigation = (text) => {
        if (text.includes("프로그램")) {
            navigate("/program");
        } else if (text.includes("공지")) {
            navigate("/notice");
        } else if (text.includes("대시보드")) {
            navigate("/dashlist");
        } else if (text.includes("공문서")) {
            navigate("/docmain");
        } else if (text.includes("말동무") || text.includes("채팅") || text.includes("대화")) {
            navigate("/welcome-chat");
        } else if (text.includes("메뉴")) {
            navigate("/senior-menu");
        } else if (text.toLowerCase().includes("qna") || text.includes("큐앤에이")) {
            navigate("/qna");
        } else if (text.toLowerCase().includes("faq")) {
            navigate("/faq");
        } else {
            setMessage("음성을 제대로 인식하지 못하거나 \n 서비스하지 않는 기능입니다. \n 다시 한번 말씀해 주세요.");
            handleSpeechRecognition();
        }
    };

    // 랜더링 뷰뷰
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h1>{message}</h1>
                {recognizedText && <p>인식된 텍스트: {recognizedText}</p>}
                <div className={styles.buttons}>
                    <button onClick={handleSpeechRecognition}>음성 인식 시작</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default SpeechRecognitionModal;
