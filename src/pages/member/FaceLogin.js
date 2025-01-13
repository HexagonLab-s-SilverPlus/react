// src/pages/member/FaceLogin.js
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFlask, apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';
import styles from './FaceLogin.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';
import SeniorNavbar from '../../components/common/SeniorNavbar';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState();
  const [captured, setCaptured] = useState(false); // 캡처 완료 여부
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMoveIdLogin = () => {
    navigate('/loginsenior');
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // 5초 후에 이미지 캡처 및 전송
        setTimeout(() => {
          captureAndSendImage();
        }, 5000); // 5초 뒤 실행
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();
  }, []);

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.error('Canvas or Video reference is not initialized');
      return null;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return null;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
  };

  const captureAndSendImage = async () => {
    if (captured) return; // 이미 캡처가 완료된 경우 중단
    setCaptured(true); // 캡처 완료 상태 설정

    const imageData = captureImage();
    if (!imageData) {
      console.error('Failed to capture image');
      return;
    }

    try {
      const response = await apiFlask.post('/compare', {
        image: imageData,
      });
      const serverResponse = await apiSpringBoot.post('/member/facelogin', {
        memSeniorProfile: response.data.best_match,
      });
      setResult(serverResponse.data);
      const accessToken = serverResponse.headers['authorization'];
      const refreshToken = serverResponse.headers['response'];
      alert('로그인 성공');
      login({ accessToken, refreshToken });
      navigate('/senior-menu');
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <>
      <SeniorNavbar />
      <div className={styles.floginMainContainer}>
        <div className={styles.floginSubContainer}>
          <h1>카메라를 5초간 정면으로 바라봐 주세요. </h1>
          {!result ? (
            <>
              <video ref={videoRef} autoPlay muted></video>
              <canvas ref={canvasRef}></canvas>
            </>
          ) : (
            <span class="material-symbols-outlined" style={{ color: 'green' }}>
              check_circle
            </span>
          )}

          <div className={styles.floginBtnDiv}>
            <button onClick={handleMoveIdLogin}>아 이 디 로 그 인</button>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <SeniorFooter></SeniorFooter>
      </div>
    </>
  );
};

export default FaceLogin;
