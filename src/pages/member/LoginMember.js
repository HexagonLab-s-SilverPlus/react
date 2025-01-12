// src/pages/member/LoginMember.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './LoginMember.module.css';

import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';

import SeniorFooter from '../../components/common/SeniorFooter';

import kakao from '../../assets/images/icon/Kakao Icon.png';
import naver from '../../assets/images/icon/Naver Icon.png';
import google from '../../assets/images/icon/Google Icon.png';

const LoginMember = () => {
  const [memId, setMemId] = useState('');
  const [memPw, setMemPw] = useState('');
  const { login, isLoggedIn, member, role } = useContext(AuthContext);

  const navigate = useNavigate();

  // 이미 로그인 상태 시 로그인화면 이동 불가
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate('/');
  //   }
  // }, [isLoggedIn, navigate]);

  const googleLoginUrl = 'http://localhost:8080/oauth2/authorization/google';
  const kakaoLoginUrl = 'http://localhost:8080/oauth2/authorization/kakao';
  const naverLoginUrl = 'http://localhost:8080/oauth2/authorization/naver';

  const handleKakaoLogin = (e) => {
    e.preventDefault();
    window.location.href = kakaoLoginUrl;
  };
  const handleNaverLogin = (e) => {
    e.preventDefault();
    window.location.href = naverLoginUrl;
  };
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = googleLoginUrl;
  };

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
      // console.log('이거머지: ', response);

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
      // if (response.data.errorCode === '')
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

  return (
    <>
      <div className={styles.form}>
        <div>
          <button
            className={styles.loginselectbtn}
            style={{ marginRight: '0.1px', backgroundColor: '#D9D9D9' }}
            onClick={handleMoveLoginSenior}
          >
            어 르 신
          </button>
          <button
            className={styles.loginselectbtn}
            onClick={handleMoveLoginMember}
            style={{
              boxShadow: '-6px -6px 10px rgba(0, 0, 0, 0.1)',
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
                fontSize: '48px',
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
                <Link to="/findIdMember" className={styles.findlink}>
                  아이디 찾기
                </Link>
              </span>
              <span className={styles.seperator}>❘</span>
              <span>
                <Link to="/findPwdMember" className={styles.findlink}>
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
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <hr className={styles.line} />
              <span style={{ fontSize: '20px', margin: '10px 10px' }}>
                {' '}
                소 셜 로 그 인{' '}
              </span>
              <hr className={styles.line} />
            </div>
            <div className={styles.loginSocialDiv}>
              <button onClick={handleKakaoLogin}>
                <img src={kakao}></img>
              </button>
              <button onClick={handleNaverLogin}>
                <img src={naver}></img>
              </button>
              <button onClick={handleGoogleLogin}>
                <img src={google}></img>
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

export default LoginMember;
