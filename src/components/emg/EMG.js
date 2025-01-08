import React, { useState, useEffect, useRef, useContext  } from 'react';
import Modal from '../../components/common/Modal';
import { AuthContext } from '../../AuthProvider'
import EMGWarning from './EMGWarning';

function EMG({onCamera, sessId}){
    const [videoStream, setVideoStream] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [imageData, setImageData] = useState([]);
    const videoRef = useRef(null); // video 요소에 대한 ref
    const { member} = useContext(AuthContext); 

    const [emg, setEMG] = useState(null)
    const [isEMG,setIsEMG] = useState(false)
    const [mEMG,setMEMG] = useState(null)

    // 버튼 클릭시 모달창이 열리게 하는 상태변수
    const [showModal, setShowModal] = useState(false);

    const total_time = 3000;
    const capture_time = 200;

     // 웹캠 스트리밍 시작
     useEffect(() => {
        startWebcam();
        if(onCamera){    
            handleEmg();
            } 
            return () => {
                if (videoStream && videoStream.srcObject) {
                    const tracks = videoStream.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
            };
        
    }, [onCamera]);

    // videoRef가 업데이트 되었을 때 srcObject를 설정
    useEffect(() => {
        if (videoStream && videoRef.current) {
            videoRef.current.srcObject = videoStream; // video 요소에 스트림을 설정
        }
    }, [videoStream]); // videoStream이 변경될 때마다 실행

    // 이미지를 서버로 전송
    useEffect(() => {
        if (!isSending && imageData.length > 0) {
            sendImageToServer(imageData);
        }
    }, [isSending]);

    useEffect(() => {
        if (isEnd) {
            serverInit();
        }
    }, [isEnd]);

    useEffect(() => {
        if (isEMG) {
            if(mEMG === "emg"){
                setShowModal(true);
            }
            setIsEMG(false);
        }
    }, [isEMG]);

    // 웹캠 시작 함수
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream); // 스트림을 상태로 설정
        } catch (error) {
            console.error('웹캠을 열 수 없습니다.', error);
            alert('웹캠을 열 수 없습니다.');
        }
    };
      // 이미지 캡처 함수
      const captureImage = () => {
        if (!videoRef.current) {
            return; // videoRef가 존재하지 않으면 리턴
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const videoElement = videoRef.current;

        if (!videoElement) {
            console.error('Video element not available.');
            return;
        }

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // videoElement는 HTMLVideoElement여야 함
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height); // 캡처

        return canvas.toDataURL('image/jpeg'); // Base64로 변환하여 반환
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // EMG 테스트 시작 함수
    const handleEmg = () => {
        setIsSending(true);
        setIsEnd(false);
        setImageData([]); // 테스트 시작 시 이미지를 초기화

        const sendImages = setInterval(() => {
            setImageData((prevData) => [
                ...prevData,
                captureImage(),  // 캡처된 이미지를 기존 상태 배열에 추가
            ]);
        }, capture_time);

        // 5초 후, 전송을 종료
        setTimeout(() => {
            clearInterval(sendImages);
            setIsSending(false);
        }, total_time);
    };

    // 이미지를 서버에 전송
    const sendImageToServer = async (imageData) => {
        try {
            const response = await fetch('http://localhost:5000/emg/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: imageData,
                    uuid: member.memUUID,
                    sessId: sessId,
                }),
            });
            const data = await response.json();
            setMEMG(data.emgMSG);
            setEMG( data.emgUUID);
            setIsEMG(true);

            console.log('emgMSG:', data.emgMSG);
            console.log('emgUUID:', data.emgUUID);
        } catch (error) {
            console.error('이미지 전송 실패:', error);
        }
        setIsEnd(true); // 서버로 전송 후 초기화
    };

    // EMG 테스트 종료 후 서버 초기화
    const serverInit = async () => {
        try {
            await fetch('http://localhost:5000/emg/end', {
                method: 'GET',
            });
        } catch (error) {
            console.error('error :', error);
        }
        setIsSending(false);
        setIsEMG(false);
        setMEMG(null);
        setImageData([]);
    };

    return (

            <div>
                {videoStream && 
                    <video
                        ref={videoRef} // videoRef로 video 요소를 참조
                        width="640"
                        height="480"
                        autoPlay
                        hidden
                    />}
                {showModal && (
                    <Modal onClose={handleCloseModal}>
                        <EMGWarning onCloseModal = {handleCloseModal} emgUUID={emg}/>
                    </Modal>
                )}
            </div>
    );

};

export default EMG;
