// src/AuthProvider.js
// 전역 상태 관리자 : 로그인 여부 상태 와 accessToken, refreshToken 상태 관리가 목적임

import React, { createContext, useState, useEffect } from 'react';

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴함
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
  const [authInfo, setAuthInfo] = useState({ isLoggedIn: false, role: '', username: '' });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const parsedToken = parseAccessToken(token);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          username: parsedToken.username,
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};