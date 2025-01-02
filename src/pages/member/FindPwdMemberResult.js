// src/pages/member/FindPwdMemberResult.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindPwdMemberResult.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindPwdMemberResult = () => {
  // 비밀번호 수정 데이터 저장관리 상태변수
  const [memPwd, setMemPwd] = useState({
    memPw: '',
    memPwChk: '',
  });
  // 조회 결과 저장관리 상태변수
  const [result, setResult] = useState('');
  // 조회된 UUID 저장관리 상태변수
  const [memUUID, setMemUUID] = useState('');

  const navigate = useNavigate();

  // 비밀번호 유효성검사여부에 따른 메세지 상태변수
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  // 비밀번호 유효성검사여부에 따른 메세지 컬러 변경 상태변수
  const [messagePwdColor, setMessagePwdColor] = useState('');
  // 비밀번호 유효성검사여부에 따른 상태변수
  const [passwordValidate, setPasswordValidate] = useState(false);

  const location = useLocation();
  const verifyData = location.state;
  console.log('넘어온 인증데이터 확인 : ', verifyData);

  useEffect(() => {
    const FindPwdResult = async () => {
      try {
        const response = await apiSpringBoot.post('/member/fpwd', {
          memId: verifyData.memId,
          memCellphone: verifyData.memCellphone,
          memEmail: verifyData.memEmail,
        });
        console.log('response 데이터 확인 : ', response.data);
        setResult(response.headers['response']);
        if (result === 'success') {
          setMemUUID(response.data);
        } else if (result === 'failed') {
          console.log('조회된 아이디가 없음');
        } else {
          console.log('비밀번호 찾기 실패');
        }
      } catch (error) {
        console.log('비밀번호 찾기 실패 : ', error);
      }
    };
    FindPwdResult();
  }, []);

  // input 입력 데이터 저장 함수
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 상태 업데이트 후 최신 상태에서 유효성 검사를 실행
    setMemPwd((prevMemPwd) => {
      const updatedMemPwd = {
        ...prevMemPwd,
        [name]: value,
      };

      // 비밀번호 확인 칸이 입력 중일 때만 유효성 검사 실행
      if (name === 'memPwChk') {
        validate(updatedMemPwd);
      }

      return updatedMemPwd;
    });
  };

  // formdata 전송 전 input 값 유효성 검사 처리용 함수
  const validate = (updatedMemPwd) => {
    const { memPw, memPwChk } = updatedMemPwd;

    if (memPw !== memPwChk) {
      setPasswordCheckMsg('비밀번호가 일치하지 않습니다.');
      setMessagePwdColor('red');
      return false;
    } else {
      setPasswordCheckMsg('비밀번호가 일치합니다.');
      setMessagePwdColor('green');
      return true;
    }
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (passwordRegex.test(memPwd.memPw)) {
      setPasswordValidate(true);
    } else {
      setPasswordValidate(false);
    }
    return passwordRegex.test(memPwd.memPw);
  };

  // 비밀번호 확인 input 의 포커스가 사라지면 유효성검사를 작동시키는 함수
  const handleConfirmPwd = () => {
    if (memPwd.memPwChk) {
      validate();
    }
  };

  const handleCheckPassword = () => {
    if (memPwd.memPw) {
      validatePassword();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 이벤트 발생 제거(submit 이벤트 취소) - 기본 폼 제출 방지

    if (!validatePassword()) {
      alert('비밀번호 조건에 맞지 않습니다.');
      return;
    }

    // 전송 전에 유효성 검사 확인
    if (!validate()) {
      alert('비밀번호 일치 확인을 해주세요.');
      return;
    }

    try {
      const response = await apiSpringBoot.put(`/member/pwdupdate/${memUUID}`, {
        memPw: memPwd.memPw,
      });
      const result = response.headers['response'];
      if (result === 'success') {
        alert('비밀번호 재설정 성공');
        navigate('/loginmember');
      } else if (result === 'failed') {
        alert('비밀번호 재설정 실패. 인증관련 내용을 확인해주세요.');
      } else {
        alert('비밀번호 재설정 오류 발생');
      }
    } catch (error) {}
  };

  // 아이디찾기 페이지로 이동하는 함수
  const handleMoveIdFind = () => {
    navigate('/findidmember');
  };

  return (
    <div className={styles.fpmResultMainContainer}>
      <div className={styles.fpmResultHead}>
        <div>
          <button
            className={styles.findNavigateBtn1}
            onClick={handleMoveIdFind}
          >
            아이디찾기
          </button>
          <button className={styles.findNavigateBtn2}>비밀번호찾기</button>
        </div>
        {/* <div className={styles.fpmProgress}>
          <small>
            회원정보인증 <span>→</span>
          </small>
        </div> */}
      </div>
      <div className={styles.fpmResultSubContainer}>
        <form onSubmit={handleSubmit}>
          {result === 'success' ? (
            <>
              <div className={styles.fpmComment}>
                <p>회원님의 정보는 암호화 처리되어 보관되기 때문에</p>
                <p>비밀번호 확인은 불가능 합니다.</p>
                <p>새로운 비밀번호를 설정해주세요.</p>
              </div>
              <div className={styles.fpmSuccessDiv}>
                <table>
                  <tr>새 비밀번호</tr>
                  <tr>
                    <input
                      type="password"
                      name="memPw"
                      onChange={(e) => {
                        handleChange(e);
                        handleCheckPassword();
                      }}
                      className={styles.textbox}
                      style={{ marginBottom: '0' }}
                    />
                  </tr>
                  {!passwordValidate ? (
                    <tr
                      style={{
                        textAlign: 'left',
                        fontSize: '10px',
                        color: 'red',
                        height: '20px',
                      }}
                    >
                      영문 소문자, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요.
                    </tr>
                  ) : (
                    <tr
                      style={{
                        textAlign: 'left',
                        fontSize: '10px',
                        color: 'green',
                        height: '20px',
                      }}
                    >
                      사용가능한 비밀번호입니다.
                    </tr>
                  )}
                  <tr>새 비밀번호 확인</tr>
                  <tr>
                    <input
                      type="password"
                      name="memPwChk"
                      className={styles.textbox}
                      onChange={handleChange}
                      style={{ marginBottom: '0' }}
                    />
                  </tr>
                  <tr
                    style={{
                      textAlign: 'left',
                      fontSize: '10px',
                      color: messagePwdColor,
                      height: '20px',
                    }}
                    name="pwdCheck"
                  >
                    {messagePwdColor === 'green' && <span>&#x2714;</span>}
                    {passwordCheckMsg}
                  </tr>
                </table>
              </div>
            </>
          ) : result === 'failed' ? (
            <div className={styles.fpmFailedDiv}>
              <p>입력하신 정보로 조회된 회원정보가 없습니다.</p>
              <p>회원정보를 다시 확인해주세요.</p>
            </div>
          ) : (
            <div className={styles.fpmErrordDiv}>
              <p>비밀번호 찾기 실패</p>
            </div>
          )}
          {result === 'success' ? (
            <div className={styles.buttonDiv}>
              <button
                className={styles.findPwdBtn}
                style={{
                  marginRight: '80px',
                  backgroundColor: '#D9D9D9',
                  color: '#333333',
                  border: 0,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                이 전
              </button>
              <input
                className={styles.findPwdBtn}
                value="다 음"
                type="submit"
              />
            </div>
          ) : (
            <div className={styles.buttonDiv}>
              <button
                className={styles.findPwdBtn}
                style={{
                  marginRight: '80px',
                  backgroundColor: '#D9D9D9',
                  color: '#333333',
                  border: 0,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                이 전
              </button>
              <button
                className={styles.findPwdBtn}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                메인화면
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FindPwdMemberResult;
