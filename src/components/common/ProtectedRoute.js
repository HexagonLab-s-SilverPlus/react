// src/components/common/ProtectedRoute.js
//* 인증된 사용자만 접근할 수 있도록 하기 위함이다.
//* 이 컴포넌트를 사용하여 보호된 페이지에 접근할 때 사용자의 인증 상태를 확인하고,
//* 인증되지 않은 사용자는 로그인 페이지로 리다이렉트된다.

import React, { useContext } from 'react';
import { Navigate } form ''