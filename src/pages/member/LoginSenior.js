// src/pages/member/LoginSenior.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './LoginSenior.module.css';

import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';

import SeniorFooter from '../../components/common/SeniorFooter';

const LoginSenior = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const { login, isLoggedIn, member } = useContext(AuthContext);

  const navigate = useNavigate();

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

  // 이미 로그인 상태 시 로그인화면 이동 불가
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate('/');
  //   }
  // }, [isLoggedIn, navigate]);

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
        const token = parseAccessToken(accessToken);
        if (token.role === 'SENIOR' || token.role === 'ADMIN') {
          login({ accessToken, refreshToken });
          alert('로그인 성공');
          navigate('/');
        } else {
          alert('해당 페이지는 어르신 전용 로그인 페이지 입니다.');
          window.location.reload();
          return;
        }
      }
    } catch (error) {
      console.error('Login Failed : ', error);
      alert('로그인 실패');
    }
  };

  const handleMoveLoginMember = (e) => {
    e.preventDefault();
    navigate('/loginmember');
  };

  const handleMoveLoginSenior = (e) => {
    e.preventDefault();
    navigate('/loginsenior');
  };

  // 멤버 타입에 따른 리다이렉트 처리
  useEffect(() => {
    if (!member || !member.memType) return;

    if (member.memType === 'SENIOR') navigate('/senior-menu');
    else if (member.memType === 'MANAGER') navigate('/dashlist');
    else if (member.memType === 'FAMILY') navigate('/seniorlist');
    else if (member.memType === 'ADMIN') navigate('/mlistview');
  }, [member, navigate]);

  const handleMoveFaceLogin = (e) => {
    e.preventDefault();
    navigate('/facelogin');
  };

  return (
    <>
      <div className={styles.form}>
        <div>
          <button
            className={styles.loginselectbtn}
            style={{
              boxShadow: '6px -6px 10px rgba(0, 0, 0, 0.1)',
              marginRight: '0.1px',
            }}
            onClick={handleMoveLoginSenior}
          >
            어 르 신
          </button>
          <button
            className={styles.loginselectbtn}
            onClick={handleMoveLoginMember}
            style={{
              backgroundColor: '#D9D9D9',
              marginLeft: '0.1px',
            }}
          >
            기 관 / 가 족
          </button>
        </div>
        <div className={styles.loginform}>
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                textAlign: 'center',
                color: '#064420',
                fontSize: '60px',
              }}
            >
              실버플러스
            </h2>
          </div>
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
            <div style={{ marginBottom: '15px' }}>
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
            <div style={{ marginBottom: '25px', textAlign: 'center' }}>
              <span>
                <Link to="/findidsenior" className={styles.findlink}>
                  아이디 찾기
                </Link>
              </span>
              <span className={styles.seperator}>❘</span>
              <span>
                <Link to="/findpwdsenior" className={styles.findlink}>
                  비밀번호 찾기
                </Link>
              </span>
              <span className={styles.seperator}>❘</span>
              <span>
                <Link to="/enrollselect" className={styles.findlink}>
                  회원가입
                </Link>
              </span>
            </div>
            <div>
              <button type="submit" className={styles.loginbutton}>
                로 그 인
              </button>
            </div>
            <div>
              <button
                style={{ marginTop: '20px' }}
                className={styles.loginbutton}
                onClick={handleMoveFaceLogin}
              >
                페 이 스 로 그 인
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.footer}>
        <SeniorFooter></SeniorFooter>
      </div>
    </>
  );
};

export default LoginSenior;
