// src/AuthProvider.js

// 전역 상태 관리자 : 로그인 여부 상태와 accessToken, refreshToken 상태 관리가 목적임

import React, { createContext, useState, useEffect } from 'react';
import {apiSpringBoot} from './utils/axios';

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

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  // authInfo 는 accessToken, refreshToken 을 상태관리함
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    role: '',
    memName: '',
    memId: '',
    member: null,
  });

  // 로그인 함수 : 로그인 시 토큰을 저장하고 로그인 상태를 업데이트 처리함
  const login = ({ accessToken, refreshToken }) => {
    // 로컬스토리지에 엑세스토큰과 리프레시토큰 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

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
  };

  // // 로그아웃 함수 : 로그인 상태를 초기화하고, 로컬 스토리지에 저장된 토큰 삭제 처리
  //   const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   setAuthInfo({
  //     isLoggedIn:false,
  //     accessToken:'',
  //     refreshToken:'',
  //     role:'',
  //     username:'',
  //     userid:'',
  //   });
  // };

  // 로그아웃 함수 : 로그인 상태를 초기화하고, 로컬 스토리지에 저장된 토큰 삭제 처리
  const logout = async (refreshToken) => {
    try {
      const response = await apiSpringBoot.get('/logout', {
        headers: {
          Authorization: `Bearer ${refreshToken.refreshToken}`,
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthInfo({
        isLoggedIn: false,
        accessToken: '',
        refreshToken: '',
        role: '',
        memName: '',
        memId: '',
        member: null,
      });
    } catch (error) {}
  };

  // refreshToken 사용해서 새 accessToken 을 요청
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refreshToken available');

      // reissue 요청시 refreshToken 을 parameter 로 전송한다면
      // const response = await axios.post('http://localhost:8080/reissue', {refreshToken});

      // 만들어 놓은 reissue 컨트롤러에서는 request header 에 'Bearer' 뒤에 추가한 것을 추출하게 해 놓았음
      const response = await apiSpringBoot.post('/reissue', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      const parsedToken = parseAccessToken(newAccessToken);
      setAuthInfo({
        isLoggedIn: true,
        role: parsedToken.role,
        refreshToken: refreshToken,
        memName: parsedToken.name,
        memId: parsedToken.sub,
        accessToken: newAccessToken,
        member: parsedToken.member,
      });
    } catch (error) {
      console.error('Failed to refreshToken : ', error);
    }
  };

  // 컴포넌트 마운트시 (연동시) 로컬 스토리지에서 토큰 확인인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      const parsedToken = parseAccessToken(accessToken);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          memName: parsedToken.name,
          memId: parsedToken.sub,
          accessToken: accessToken,
          refreshToken: refreshToken,
          member: parsedToken.member,
        });
      }
    }
    console.log('login : ', authInfo);
  }, []);

  useEffect(() => {
    console.log('Updated authInfo: ', authInfo);
  }, [authInfo]); // authInfo가 변경될 때 실행

  return (
    <AuthContext.Provider
      value={{ ...authInfo, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
