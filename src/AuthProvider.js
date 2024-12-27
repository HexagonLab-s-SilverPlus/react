// src/AuthProvider.js

// 전역 상태 관리자 : 로그인 여부 상태와 accessToken, refreshToken 상태 관리가 목적임

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot, apiFlask } from './utils/axios';
import PropTypes from 'prop-types'; // PropTypes를 import

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴
const parseAccessToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

let isInerceptorSetup = false;

// 요청, 응답 인터셉터 함수
const setupInterceptors = (axiosInstance) => {
  if (isInerceptorSetup) return;
  isInerceptorSetup = true;
  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      console.log('요청 인터셉터 확인');
      if (
        config.url.includes('/login') ||
        config.url.includes('/logout') ||
        config.url.includes('/reissue') ||
        config.url.includes('/api/sms') ||
        config.url.includes('/api/sms/verify') ||
        config.url.includes('/idchk') ||
        config.url.includes('/enroll')
      ) {
        console.log('예외 url 작동확인');
        return config;
      }

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['RefreshToken'] = `Bearer ${refreshToken}`;
        console.log('config headers', config.headers['Authorization']);
        console.log('config headers', config.headers['Authorization']);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // 오류가 발생하면 Promise 체인에 전달
    }
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => {
      return response; // 응답에 문제가 없으면 바로 반환
    },
    async (error) => {
      console.log('응답 인터셉터 하는지 확인');
      if (error.config.url.includes('/api/sms/verify')) {
        console.log('응답 인터셉터 예외 url 작동 확인');
        return;
      }
      const originalRequest = error.config; // 원래 요청 정보 저장
      const tokenExpiredHeader = error.response?.headers['token-expired'];

      console.log('response : ', error.response);
      console.log('originalRequest :', originalRequest);
      console.log('tokenExpiredHeader :', tokenExpiredHeader);

      if (!originalRequest) {
        console.error('originalRequest가 정의되지 않음');
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        console.warn('이미 재시도된 요청입니다. 무한 반복 방지');
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 토큰 재발급
      if (
        error.response.status === 401 &&
        tokenExpiredHeader === 'RefreshToken'
      ) {
        originalRequest._retry = true;
        // accessToken 유효, refreshToken 만료
        // refreshToken 만료시 로그인 연장여부 확인

        const confirmExtend = window.confirm(
          '로그인이 만료되었습니다. 연장하시겠습니까?'
        );
        if (confirmExtend) {
          try {
            localStorage.setItem('extendLogin', confirmExtend);
            const newRefreshToken = await refreshAccessToken();
            originalRequest.headers['RefreshToken'] =
              `Bearer ${newRefreshToken}`;
            localStorage.setItem('refreshToken', newRefreshToken);
            return await axiosInstance(originalRequest);
          } catch (error) {
            console.error('로그인 연장 실패 : ', error.response?.data);
            alert('다시 로그인해주세요.');
            localStorage.clear();
            window.location.href = '/loginmember';
          }
        } else {
          alert('다시 로그인해주세요.(로그인연장 거부)');
          localStorage.clear();
          window.location.href = '/loginmember';
          return Promise.reject(error);
        }
      }

      // accessToken 만료, refreshToken 유효
      if (
        error.response.status === 401 &&
        tokenExpiredHeader === 'AccessToken'
      ) {
        try {
          originalRequest._retry = true;
          console.log('AccessToken 만료. 재발급 진행 중...');
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            console.log(
              'newAccesstoken 헤더에 저장 확인 : ',
              originalRequest.headers['Authorization']
            );
            console.log(originalRequest.headers);
            return await axiosInstance(originalRequest);
          }
        } catch (error) {
          console.error('accessToken 재발급 실패 : ', error.response?.data);
          localStorage.clear();
          window.location.href = '/loginmember';
          return Promise.reject(error);
        }
      }

      if (error.response.status === 401 && tokenExpiredHeader === 'AllToken') {
        console.warn('모든 토큰 만료.');
        localStorage.clear();
        window.location.href = '/loginmember';
      }

      if (error.response && error.response.status !== 401) {
        localStorage.clear();
        window.location.href = '/loginmember';
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(apiSpringBoot);
setupInterceptors(apiFlask);

// token 재발급 요청
const refreshAccessToken = async () => {
  let accessToken = localStorage.getItem('accessToken')?.trim();
  let refreshToken = localStorage.getItem('refreshToken')?.trim();
  let extendLogin = localStorage.getItem('extendLogin');
  console.log('extendlogin 체크 : ', extendLogin);
  console.log(
    '토근 재발급 코드, 변수에 토큰 저장 확인 accessToken : ',
    accessToken
  );
  console.log(
    '토근 재발급 코드, 변수에 토큰 저장 확인 refreshToken : ',
    refreshToken
  );

  if (!accessToken || !refreshToken) {
    console.error('reisssu 요청 실패 : 토큰 없음');
    alert('세션 만료. 다시 로그인해주세요.');
    localStorage.clear();
    window.location.href = '/loginmember';
    return;
  }

  try {
    console.log('reissue 요청 - accessToken : ', accessToken);
    console.log('reissue 요청 - refreshToken : ', refreshToken);

    const response = await apiSpringBoot.post('/reissue', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        RefreshToken: `Bearer ${refreshToken}`,
        extendLogin: `${extendLogin}`,
      },
    });

    console.log('reissue 성공. 응답헤더 : ', response.headers);
    console.log('authorization : ', response.headers['authorization']);
    console.log('refreshtoken : ', response.headers['refreshToken']);

    if (!extendLogin) {
      const newAccessToken = response.headers['authorization']
        ?.split(' ')[1]
        ?.trim();
      localStorage.setItem('accessToken', newAccessToken);
      console.log('newAccessToken', newAccessToken);
      return newAccessToken;
    } else {
      const newRefreshToken = response.headers['refreshtoken']
        ?.split(' ')[1]
        ?.trim();
      localStorage.setItem('refreshToken', newRefreshToken);
      console.log('newRefreshToken', newRefreshToken);
      return newRefreshToken;
    }
  } catch (error) {
    console.error('Reissue 실패 - 상태 코드:', error.response?.status);
    console.error('Reissue 실패 - 응답 데이터:', error.response?.data);

    const expiredTokenType = error.response?.headers['token-expired'];
    if (
      expiredTokenType === 'RefreshToken' ||
      error.response?.data === 'session expired'
    ) {
      alert('세션 만료. 다시 로그인해주세요.');
      localStorage.clear();
      window.location.href = '/loginmember';
    } else if (expiredTokenType === 'AccessToken') {
      console.warn('accessToken 만료됨. 재발급 진행');
      return await refreshAccessToken();
    } else {
      console.error('오류 발생 : ', error.message);
      localStorage.clear();
      window.location.href = '/loginmember';
    }
  }
};

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authInfo, setAuthInfo] = useState(() => {
    // 초기화 시 로컬 저장소를 기반으로 상태 설정
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      const parsedToken = parseAccessToken(accessToken);
      return {
        isLoggedIn: true,
        accessToken,
        refreshToken,
        role: parsedToken.role,
        memName: parsedToken.name,
        memId: parsedToken.sub,
        member: parsedToken.member,
      };
    }
    return {
      isLoggedIn: false,
      accessToken: '',
      refreshToken: '',
      role: '',
      memName: '',
      memId: '',
      member: null,
    };
  });

  // 로그인 함수 : 로그인 시 토큰을 저장하고 로그인 상태를 업데이트 처리함
  const login = ({ accessToken, refreshToken }) => {
    // 로컬스토리지에 엑세스토큰과 리프레시토큰 저장
    tokenUpdate(accessToken, refreshToken);
    const parsedToken = parseAccessToken(accessToken); // 페이로드만 리턴받음
    setAuthInfo({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      role: parsedToken.role, // JWTUtil 클래스에서 토큰 생성 메소드를 확인해서 이름 맞춤
      memName: parsedToken.name, // JWTUtil 클래스에서 토큰 생성 메소드를 확인해서 이름 맞춤
      memId: parsedToken.sub, // 토큰에서 subject 정보 추출
      member: parsedToken.member,
    });
    console.log('login : ', authInfo);
    console.log('member:', authInfo.member); // member 객체가 포함되었는지 확인인
  };

  // 토큰 저장 함수
  const tokenUpdate = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  // 로그아웃 함수 : 로그인 상태를 초기화하고, 로컬 스토리지에 저장된 토큰 삭제 처리
  const logout = async (refreshToken) => {
    try {
      const response = await apiSpringBoot.get('/logout', {
        headers: {
          Authorization: `Bearer ${refreshToken.refreshToken}`,
        },
      });

      console.log('response :', response);

      localStorage.clear();
      setAuthInfo({
        isLoggedIn: false,
        accessToken: '',
        refreshToken: '',
        role: '',
        memName: '',
        memId: '',
        member: null,
      });
      navigate('/loginmember');
    } catch (error) {
      console.error('로그아웃 실패 : ', error);
      alert('로그아웃 실패');
    }
  };

  useEffect(() => {
    // authInfo 상태 변경 시 로컬 저장소와 동기화
    if (authInfo.accessToken) {
      localStorage.setItem('accessToken', authInfo.accessToken);
    }
    if (authInfo.refreshToken) {
      localStorage.setItem('refreshToken', authInfo.refreshToken);
    }
  }, [authInfo.accessToken, authInfo.refreshToken]);

  return (
    <AuthContext.Provider
      value={{ ...authInfo, login, logout, apiSpringBoot, apiFlask }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// PropTypes 설정
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // children이 필수 Prop임을 명시
};