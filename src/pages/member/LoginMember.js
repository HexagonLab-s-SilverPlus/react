// src/pages/member/LoginMember.js
import React, { useState, useContext } from 'react';
import styles from './LoginMember.module.css';
import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';
import SideBar from '../../components/common/SideBar';

const LoginMember = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiSpringBoot.post(
        '/login',
        {
          memId: memId,
          memPw: memPw,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log('엑세스토큰확인 : ', response.headers['authorization']);
      const authorizationHeader = response.headers['authorization'];
      console.log('authorizationHeader ', authorizationHeader);
      if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const accessToken = authorizationHeader.substring('Bearer '.length);
        const { refreshToken } = response.data;
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        login({ accessToken, refreshToken });
        alert('로그인 성공');
      }
    } catch (error) {
      console.error('Login Failed : ', error);
      alert('로그인 실패');
    }
  };

  return (
    <>
      <SideBar></SideBar>

      <div className={styles.loginform}>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              id="memId"
              name="memId"
              placeholder="아이디"
              value={memId}
              className={styles.logininput}
              onChange={(e) => setMemId(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              id="memPw"
              name="memPw"
              placeholder="비밀번호"
              className={styles.logininput}
              value={memPw}
              onChange={(e) => setMemPw(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className={styles.loginbutton}>
              로 그 인
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginMember;
