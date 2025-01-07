// src/pages/member/FaceLogin.js
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFlask, apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);
  const [captured, setCaptured] = useState(false); // 캡처 완료 여부
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

      setResult(response.data); // 결과 저장
      const serverResponse = await apiSpringBoot.post('/member/facelogin', {
        memSeniorProfile: response.data.best_match,
      });
      const accessToken = serverResponse.headers['authorization'];
      const refreshToken = serverResponse.headers['response'];
      login({ accessToken, refreshToken });
      navigate('/');
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <div>
      <h1>Face Comparison</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: '100%', maxWidth: '600px' }}
      ></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {!captured && <p>Camera is on. Capturing image in 5 seconds...</p>}
      {captured && !result && <p>Processing image...</p>}
      {result && (
        <div>
          <h2>Result:</h2>
          <p>Best Match: {result.best_match}</p>
          <p>Distance: {result.distance}</p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
};

export default FaceLogin;
