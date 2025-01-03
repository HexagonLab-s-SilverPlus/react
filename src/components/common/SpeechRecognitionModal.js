// react : useState, useContext, useNavigate
import React, { useState, useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";
// css
import styles from "./SpeechRecognitionModal.module.css";
// authContext
import { AuthContext } from "../../AuthProvider";


const SpeechRecognitionModal = ({ onClose }) => {
    // 사용자에게 보여줄 메세지
    const [message, setMessage] = useState("무엇을 도와드릴까요?\n원하는 기능을 눌러보세요");
    // // 음성 인식 결과 저장
    // const [recognizedText, setRecognizedText] = useState("");
    // 인증 정보와 flask API URL 가져오기
    const { apiFlask } = useContext(AuthContext);
    // 페이지 이동용
    const navigate = useNavigate();
    // 음성 인식 처리 시간
    const RECORDING_DURATION = 5000;

    // message 변경때마다 읽어주기
    useEffect(()=>{
        const fetchTTS = async () => {
            if (!message) return; // message가 없을 때 실행하지 않음
            try {
                const response = await apiFlask.post('/tts/pagereader', { text: message }, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.status === 200) {
                    const audioUrl = URL.createObjectURL(response.data); // Blob을 URL로 변환
                    const audio = new Audio(audioUrl); // Audio 객체 생성
                    audio.play(); // 재생
                } else {
                    console.error("TTS 서버 오류: ", response.statusText);
                }
            } catch (error) {
                console.error("TTS 요청 중 오류: ", error);
            }
        };
        fetchTTS(); // 비동기 함수 호출
    },[message]);

        
    // 음성 인식 처리
    const handleSpeechRecognition = async () => {
        // 메세지 출력
        setMessage("가고싶은 페이지를 말씀해 보세요.\n 예)말동무서비스, 어르신프로그램,\n 공문서작성, 맞고");
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
                // WAV 파일로 변환
                const wavBlob = await convertToWav(audioBlob);
                console.log(audioBlob);
                // Flask 서버로 전송할 FormData 생성
                const formData = new FormData();
                // blob 데이터를 audio 필드에 추가가
                formData.append("audio", wavBlob);
    
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
                        const data = response.data;
                        if (data.recognized_text) {
                            // setRecognizedText(data.recognized_text);
                            handleNavigation(data.recognized_text);
                        } else {
                            // 실패시
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
            setTimeout(() => mediaRecorder.stop(), RECORDING_DURATION); // 5초간 녹음
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
        } else if (text.toLowerCase().includes("qna") ||text.toLowerCase().includes("q&a") || text.includes("큐앤에이")) {
            navigate("/qna");
        } else if (text.toLowerCase().includes("faq")) {
            navigate("/faq");
        } else {
            setMessage("음성을 제대로 인식하지 못하거나 \n 서비스하지 않는 기능입니다.");
        }
    };

    // WAV 변환 유틸리티 함수
    async function convertToWav(blob) {
        // Blob 데이터를 ArrayBuffer로 변환
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer); // 오디오 디코딩

        const numberOfChannels = audioBuffer.numberOfChannels; // 채널 수
        const length = audioBuffer.length * numberOfChannels * 2 + 44; // WAV 헤더 크기 계산
        const buffer = new ArrayBuffer(length); // WAV 파일 데이터를 저장할 ArrayBuffer
        const view = new DataView(buffer);

        // WAV 헤더 작성
        writeString(view, 0, "RIFF"); // RIFF 헤더
        view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true); // 파일 크기
        writeString(view, 8, "WAVE"); // WAVE 포맷
        writeString(view, 12, "fmt "); // fmt 서브 청크
        view.setUint32(16, 16, true); // 서브 청크 크기
        view.setUint16(20, 1, true); // 오디오 포맷 (PCM)
        view.setUint16(22, numberOfChannels, true); // 채널 수
        view.setUint32(24, audioBuffer.sampleRate, true); // 샘플 레이트
        view.setUint32(28, audioBuffer.sampleRate * 4, true); // 바이트 레이트
        view.setUint16(32, numberOfChannels * 2, true); // 블록 정렬
        view.setUint16(34, 16, true); // 샘플 크기 (비트)
        writeString(view, 36, "data"); // 데이터 서브 청크
        view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true); // 데이터 크기

        // 오디오 데이터 작성
        const offset = 44;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i])); // 클리핑 방지
                view.setInt16(offset + (i * 2), sample * 0x7FFF, true); // 샘플을 16비트로 변환
            }
        }

        return new Blob([buffer], { type: "audio/wav" }); // Blob 생성 후 반환
    }

    // 문자열을 DataView에 쓰기
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    const handlePageReader = () => {};
    
    // 랜더링 뷰
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h1>            
                    {message.split("\n").map((line, index) => (
                        <span key={index}>
                        {line}
                        <br />
                    </span>
                    ))}
                </h1>
                {/* {recognizedText && <p>인식된 텍스트: {recognizedText}</p>} */}
                <div className={styles.buttons}>
                    <button onClick={handleSpeechRecognition}>페이지 이동</button>
                    <button onClick={handlePageReader}>페이지 읽기</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default SpeechRecognitionModal;
