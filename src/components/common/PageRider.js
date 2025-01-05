import React, { useState, useEffect } from "react";
import styles from "./PageRider.module.css";
import button from "../../assets/images/chatIcon.png";
import stopButton from "../../assets/images/stop.png";
import SpeechRecognitionModal from "./SpeechRecognitionModal";

const PageRider = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [audio, setAudio] = useState(null); // TTS Audio 객체 상태
    const [isStopButtonVisible, setIsStopButtonVisible] = useState(false); // 정지 버튼 표시 상태


    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // TTS 재생 시작
    const startTTS = (newAudio) => {
        if (audio) {
            // 이전 오디오가 있다면 중지
            audio.pause();
            audio.currentTime = 0;
        }

        setAudio(newAudio);
        setIsModalOpen(false); // 모달 닫기
        setIsStopButtonVisible(true); // 정지 버튼 표시

        // 재생 종료 시 이벤트 리스너 추가
        newAudio.onended = () => {
            setIsStopButtonVisible(false); // 정지 버튼 숨기기
        };

        newAudio.play();
    };

    // TTS 정지
    const stopTTS = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // 오디오 재생 초기화
            setIsStopButtonVisible(false); // 정지 버튼 숨기기
        }
    };
    // 페이지 이동 시 TTS 중지
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // 오디오 재생 초기화
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener("beforeunload", handleBeforeUnload);

        // 페이지 이동 시 URL 변경 감지
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            handleBeforeUnload();
            originalPushState.apply(window.history, args);
        };

        window.history.replaceState = function (...args) {
            handleBeforeUnload();
            originalReplaceState.apply(window.history, args);
        };

        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, [audio]);

    return (
        <>
            <img
                src={button}
                className={styles.floatingButton}
                onClick={handleButtonClick}
                alt="Floating Button"
            />
            {isModalOpen && <SpeechRecognitionModal onClose={closeModal} onStartTTS={startTTS} />}
            {isStopButtonVisible && (
                    <img src={stopButton} className={styles.stopButton} onClick={stopTTS}/>

            )}
        </>
    );
};

export default PageRider;
