// src/pages/member/FindIdMemberResult.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindIdMemberResult.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindIdMemberResult = () => {
  // 조회된 아이디 저장관리 상태변수
  const [memId, setMemId] = useState('');
  // 조회 결과 저장관리 상태변수
  const [result, setResult] = useState('');

  const navigate = useNavigate();

  const location = useLocation();
  const verifyData = location.state;
  console.log('넘어온 인증데이터 확인 : ', verifyData);

  useEffect(() => {
    const FindIdResult = async () => {
      try {
        const response = await apiSpringBoot.post('/member/fid', {
          memName: verifyData.memName,
          memCellphone: verifyData.memCellphone,
          memEmail: verifyData.memEmail,
        });
        console.log('response 데이터 확인 : ', response.data);
        setResult(response.headers['response']);
        if (result === 'success') {
          setMemId(response.data);
        } else if (result === 'failed') {
          console.log('조회된 아이디가 없음');
        } else {
          console.log('아이디 찾기 실패');
        }
      } catch (error) {
        console.log('아이디 찾기 실패 : ', error);
      }
    };
    FindIdResult();
  });

  const handleMovePwdFind = () => {
    navigate('/findpwdmember');
  };

  return (
    <div className={styles.fimResultMainContainer}>
      <div className={styles.fimResultHead}>
        <div>
          <button className={styles.findNavigateBtn1}>아이디찾기</button>
          <button
            className={styles.findNavigateBtn2}
            onClick={handleMovePwdFind}
          >
            비밀번호찾기
          </button>
        </div>
        {/* <div className={styles.fimProgress}>
          <small>
            회원정보인증 <span>→</span>
          </small>
        </div> */}
      </div>
      <div className={styles.fimResultSubContainer}>
        {result === 'success' ? (
          <div className={styles.fimSuccessDiv}>
            <p>조회된 회원님의 아이디는</p>
            <div>
              <p>{memId}</p> <p>입니다.</p>
            </div>
          </div>
        ) : result === 'failed' ? (
          <div className={styles.fimFailedDiv}>
            <p>입력하신 정보로 조회된 아이디가 없습니다.</p>
            <p>회원정보를 다시 확인해주세요.</p>
          </div>
        ) : (
          <div className={styles.fimErrordDiv}>
            <p>아이디 찾기 실패</p>
          </div>
        )}
        {result === 'success' ? (
          <div className={styles.buttonDiv}>
            <button
              className={styles.findIdBtn}
              style={{
                marginRight: '80px',
                backgroundColor: '#D9D9D9',
                color: '#333333',
                border: 0,
              }}
              onClick={() => navigate('/loginmember')}
            >
              로그인 하기
            </button>
            <button className={styles.findIdBtn} onClick={handleMovePwdFind}>
              비밀번호 찾기
            </button>
          </div>
        ) : (
          <div className={styles.buttonDiv}>
            <button
              className={styles.findIdBtn}
              style={{
                marginRight: '80px',
                backgroundColor: '#D9D9D9',
                color: '#333333',
                border: 0,
              }}
              onClick={() => navigate(-1)}
            >
              이 전
            </button>
            <button className={styles.findIdBtn} onClick={() => navigate('/')}>
              메인화면
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindIdMemberResult;
