// src/components/common/ProtectedRoute.js
//* 인증된 사용자만 접근할 수 있도록 하기 위함이다.
//* 이 컴포넌트를 사용하여 보호된 페이지에 접근할 때 사용자의 인증 상태를 확인하고,
//* 인증되지 않은 사용자는 로그인 페이지로 리다이렉트된다.

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// AuthContext를 import 하여 인증 상태에 접근
import { AuthContext } from '../../AuthProvider';

// ProtectedRoute 컴포넌트 정의
const ProtectedRoute = ({ children, roles = [] }) => {
    // AuthContext에서 auth 상태를 가져옴
    const { authInfo } = useContext(AuthContext);

    // 인증되지 않은 사용자인 경우 (accessToken이 없을 때)
    if()
}