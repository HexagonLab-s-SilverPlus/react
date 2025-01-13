// react : useState, useContext, useNavigate
import React, { useState, useContext, useEffect, useRef } from "react";
// css
import styles from "./SpeechRecognitionModal.module.css";
// authContext
import { AuthContext } from "../../AuthProvider";


const SpeechRecognitionModal = ({ onClose, onStartTTS }) => {
    // 사용자에게 보여줄 메세지
    const [message, setMessage] = useState("무엇을 도와드릴까요?\n원하는 기능을 눌러보세요");
    // // 음성 인식 결과 저장
    const [recognizedText, setRecognizedText] = useState("");
    // 인증 정보와 flask API URL 가져오기
    const { apiFlask } = useContext(AuthContext);
    // 음성 인식 처리 시간
    const RECORDING_DURATION = 7000;
    // 잠시 보여주기용 텍스트
    const [wait, setWait] = useState("");
    // 현재 재생 중인 Audio 객체를 관리
    const audioRef = useRef(null);

    // message 변경때마다 읽어주기
    useEffect(() => {
        const fetchTTS = async () => {
            if (!message) return; // message가 없을 때 실행하지 않음
            try {
                const firstMessage = message.split("\n")[0];
                const response = await apiFlask.post('/tts/pagereader', { text: firstMessage }, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    // 기존 재생 중인 오디오를 멈춤
                    stopAudio();
                    const audioUrl = URL.createObjectURL(response.data); // Blob을 URL로 변환
                    const audio = new Audio(audioUrl); // Audio 객체 생성
                    // 새로운 오디오 객체를 참조에 저장
                    audioRef.current = audio;
                    audio.play(); // 재생
                } else {
                    console.error("TTS 서버 오류: ", response.statusText);
                }
            } catch (error) {
                console.error("TTS 요청 중 오류: ", error);
            }
        };
        fetchTTS(); // 비동기 함수 호출
    }, [message]);


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
                        headers: {
                            Accept: "application/json", // json 응답 처리
                        },
                    });
                    // 서버 응답 데이터
                    // 성공시
                    if (response.status === 200) {
                        const data = response.data;
                        if (data.recognized_text) {
                            setRecognizedText(data.recognized_text);
                            console.log(data.recognized_text);
                            handleNavigation(data.recognized_text);
                        } else {
                            // 실패시
                            setMessage("음성을 제대로 인식하지 못했습니다.\n 다시 시도해주세요.");
                        }
                    } else {
                        setMessage("서버에서 오류가 발생했습니다.");
                        console.error("서버 오류:", response.statusText);
                    }
                } catch (error) {
                    console.error("Flask 서버 호출 중 오류:", error);
                    // 오류메세지
                    setMessage(error.response.data.error);
                }
            };
            // 녹음 시작
            mediaRecorder.start();
            // 5초 후 녹음 종료
            setTimeout(() => mediaRecorder.stop(), RECORDING_DURATION); // 녹음
        } catch (error) {
            // 콘솔에 오류 로그 출력
            console.error("마이크 접근 오류:", error);
            // 접근 실패 메시지
            setMessage("마이크에 접근할 수 없습니다.");
        }
    };

    // 텍스트에 따라 페이지 이동 처리
    const handleNavigation = (text) => {
        if (text.includes("프로그램") || text.includes("어르신")) {
            window.location.href = "/program";
        } else if (text.includes("공지") || text.includes("사항")) {
            window.location.href = "/notice";
        } else if (text.includes("공문서") || text.includes("작성")) {
            window.location.href = "/docmain";
        } else if (text.includes("말동무") || text.includes("채팅") || text.includes("대화")) {
            window.location.href = "/welcome-chat";
        } else if (text.toLowerCase().includes("faq") || text.includes("질문") || text.includes("자주") || text.includes("문의")) {
            window.location.href = "/faq";
        } else if (text.includes("메뉴") || text.includes("전체")) {
            window.location.href = "/senior-menu";
        } else if (text.includes("게임") || text.includes("맞고") || text.includes("화투") || text.includes("오락") || text.toLowerCase().includes("game")) {
            window.location.href = "/game";
        } else if (text.includes("책") || text.includes("읽기") || text.includes("도서관") || text.includes("북") || text.toLowerCase().includes("book")) {
            window.location.href = "/book";
        } else {
            setMessage("음성을 제대로 인식하지 못하거나 서비스하지 않는 기능입니다.");
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

    const handlePageReader = async () => {
        // 1. 특정 id의 특스트 가져오기
        const targetElement = document.getElementById("read"); // 특정 id로 요소 가져오기
        if (!targetElement) {
            setMessage("읽을 내용이 없습니다.");
            return;
        }
        const pageText = targetElement.innerText.trim(); //텍스트가져오기
        if (!pageText) {
            setMessage("읽을 내용이 없습니다.");
            return;
        }
        console.log(pageText);
        setMessage("");
        setWait("잠시만 기다려주세요.");


        try {
            // 2. TTS API 호출
            const response = await apiFlask.post('/tts/pagereader', { text: pageText }, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // 3. 음성 재생
                const audioUrl = URL.createObjectURL(response.data);//Blob -> URL변환
                const newAudio = new Audio(audioUrl);
                // 새로운 오디오 객체를 참조에 저장
                audioRef.current = audio;
                newAudio.play();
                onStartTTS(newAudio); // TTS 시작 콜백 호출
            } else {
                console.log("음성변환에 실패하였습니다. 다시 시도해주세요.");
                setMessage("음성변환에 실패하였습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("TTS 요청중 오류 : ", error);
            setMessage("음성변환에 실패하였습니다. 다시 시도해주세요.")
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // 재생 위치를 처음으로 초기화
        }
    };

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
                    {wait}
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
