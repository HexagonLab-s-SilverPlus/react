import React, { useState, useContext } from "react";
import styles from "./SpeechRecognitionModal.module.css";
import { AuthContext } from "../../AuthProvider";

const SpeechRecognitionModal = ({ onClose }) => {
    const [message, setMessage] = useState("이동하고 싶은 페이지를 말씀해주세요.");
    const [recognizedText, setRecognizedText] = useState("");
    const { apiFlask, accessToken } = useContext(AuthContext);

    const handleSpeechRecognition = async () => {
        setMessage("음성 인식 중...");
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(audioStream);
            const audioChunks = [];
    
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
    
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("audio", audioBlob);
    
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const response = await apiFlask.post("/stt/process-audio", formData, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            RefreshToken: `Bearer ${refreshToken}`,
                        },
                    });
                    const data = response.data;
    
                    if (data.recognized_text) {
                        setRecognizedText(data.recognized_text);
                        handleNavigation(data.recognized_text);
                    } else {
                        setMessage("음성을 인식하지 못했습니다. 다시 시도해주세요.");
                    }
                } catch (error) {
                    console.error("Flask 서버 호출 중 오류:", error);
                    setMessage("서버와 통신 중 문제가 발생했습니다.");
                }
            };
    
            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); // 5초간 녹음
        } catch (error) {
            console.error("마이크 접근 오류:", error);
            setMessage("마이크에 접근할 수 없습니다.");
        }
    };
    

    const handleNavigation = (text) => {
        if (text.includes("홈")) {
            window.location.href = "/home";
        } else if (text.includes("소개")) {
            window.location.href = "/about";
        } else {
            setMessage("이동할 페이지를 찾을 수 없습니다.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>{message}</h2>
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
