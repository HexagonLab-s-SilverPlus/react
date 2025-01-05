// src/pages/member/oauth2.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';

const oauth2 = () => {
  const location = useLocation();
  const naviagte = useNavigate();
  const { login } = useContext(AuthContext);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const provider = queryParams.get('provider');
    const socialId = queryParams.get('socialId');
    const linked = queryParams.get('linked');
    if (linked === 'on') {
      console.log('연동여부 조건문 작동 확인(연동 O)');
      const accessToken = queryParams.get('accessToken');
      const refreshToken = queryParams.get('refreshToken');
      console.log('서버로부터 전달 온 토큰 값 확인(access) : ', accessToken);
      console.log('서버로부터 전달 온 토큰 값 확인(refresh) : ', refreshToken);
      login({ accessToken, refreshToken });
      naviagte('/');
    } else {
      const confirmExtend = window.confirm('회원이신가요?');
      if (confirmExtend) {
        naviagte('/loginmember');
      } else {
        naviagte('/enrollselect');
      }
    }
  }, [location]);

  return <div>소셜로그인 진행중</div>;
};

export default oauth2;
