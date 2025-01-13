// src/pages/member/FindIdSenior.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindIdSenior.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindIdSenior = () => {
  const [timeLeft, setTimeLeft] = useState(0); // 3분(180초)
  const [isTimerVisible, setIsTimerVisible] = useState(false); // 타이머 표시 여부
  const navigate = useNavigate();

  // 인증 옵션선택을 관리하는 상태변수
  const [selectOption, setSelectOption] = useState('phone');

  // 인증 옵션 선택시 작동하는 함수
  const handleSelectOption = (e) => {
    setSelectOption(e.target.value);
    setIsTimerVisible(false);
    setVerifyData({
      memName: '',
      memCellphone: '',
      memEmail: '',
      isVerify: false,
    });
  };

  // 다음페이지로 보낼 데이터를 관리하는 상태변수
  const [verifyData, setVerifyData] = useState({
    memName: '',
    memCellphone: '',
    memEmail: '',
    isVerify: false,
  });

  // 휴대전화 인증관련 관리 상태변수
  const [phoneAuthNum, setPhoneAuthNum] = useState('');

  // 이메일 인증관련 데이터 관리 상태변수
  const [emailId, setEmailId] = useState('');
  const [domain, setDomain] = useState('');
  const [emailAuthNum, setEmailAuthNum] = useState('');

  useEffect(() => {
    // 타이머가 보이지않거나 0이되면 중지
    if (!isTimerVisible || timeLeft <= 0) return;

    // 1초마다 timeLeft 감소시키는 타이머 설정
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // 컴포넌트가 언마운트 될 때 타이머 정리
    return () => clearInterval(timer);
  }, [timeLeft, isTimerVisible]);

  // 타이머를 계산하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // input 에 휴대전화번호 입력시 저장하는 함수
  const handleCellphoneChange = (e) => {
    setVerifyData((prevVerifiyData) => ({
      ...prevVerifiyData,
      memCellphone: e.target.value,
    }));
  };

  // input 에 인증번호(휴대전화) 입력시 저장하는 함수
  const handlePhoneAuthNum = (e) => {
    setPhoneAuthNum(e.target.value);
  };

  // input 에 이메일정보(아이디부분) 입력시 저장하는 함수
  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
  };

  // input 에 이메일정보(도메인부분) 입력시 저장하는 함수
  const handleEmailDomainChange = (e) => {
    setDomain(e.target.value);
  };

  // input 에 인증번호(이메일) 입력시 저장하는 함수
  const handleEmailAuthNum = (e) => {
    setEmailAuthNum(e.target.value);
  };

  // const handleDomainOptionChange = (e) => {
  //   setDomain(e.target.value);
  // };

  // input 에 이름 입력시 저장하는 함수
  const handleMemNameChange = (e) => {
    setVerifyData((prevVerifiyData) => ({
      ...prevVerifiyData,
      memName: e.target.value,
    }));
  };

  // 휴대전화 인증번호 요청
  const FindIdVerifyPhone = async () => {
    // e.preventDefault();
    try {
      await apiSpringBoot.post('/api/sms', {
        memCellphone: verifyData.memCellphone,
        code: '',
      });
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('인증번호 요청실패 : ', error);
    }
  };

  // 휴대전화로 요청한 인증번호 확인요청
  const FindIdPhoneCheck = async () => {
    // e.preventDefault();
    try {
      const response = await apiSpringBoot.post('/api/sms/verify', {
        memCellphone: verifyData.memCellphone,
        code: phoneAuthNum,
      });
      const verify = response.headers['verify'];
      if (verify === 'true') {
        alert('인증성공');
        setVerifyData((prevVerifiyData) => ({
          ...prevVerifiyData,
          isVerify: true,
        }));
      } else if (verify === 'false') {
        alert('인증 실패\n인증시간이 만료되었거나 인증번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('인증 실패 : ', error);
    }
  };

  // 이메일 인증번호 요청
  const FindIdVerifyEmail = async () => {
    setTimeLeft(180);
    setIsTimerVisible(true);
    try {
      await apiSpringBoot.post('/api/email', {
        email: `${emailId}@${domain}`,
        verifyCode: '',
      });
      alert('인증번호가 발송되었습니다.');
      setVerifyData((prevVerifiyData) => ({
        ...prevVerifiyData,
        memEmail: `${emailId}@${domain}`,
      }));
    } catch (error) {
      alert('인증번호발송실패');
      console.error('인증번호발송실패 : ', error);
    }
  };

  // 이메일로 요청한 인증번호 확인 요청
  const FindIdEmailCheck = async () => {
    try {
      const response = await apiSpringBoot.post('/api/email/verify', {
        email: `${emailId}@${domain}`,
        verifyCode: emailAuthNum,
      });
      const verify = response.headers['verify'];
      if (verify === 'true') {
        alert('인증성공');
        setVerifyData((prevVerifiyData) => ({
          ...prevVerifiyData,
          isVerify: true,
        }));
      } else if (verify === 'false') {
        alert('인증실패');
      }
    } catch (error) {
      alert('인증시도오류');
      console.error('인증실패 : ', error);
    }
  };

  // 아이디 찾기 결과페이지 이동 함수
  const moveFindIdResult = () => {
    if (verifyData.isVerify === true) {
      navigate('/fimResult', { state: verifyData });
    } else {
      alert('휴대전화 또는 이메일 인증을 진행해주세요.');
      return;
    }
  };

  const handleMoveReturn = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  // const moveFindIdResult = () => {
  //   navigate('/fisResult', { state: verifyData });
  // };

  const handleMovePwdFind = () => {
    navigate('/findpwdsenior');
  };

  return (
    <>
      <div className={styles.findIdMainContainer}>
        <div className={styles.findIdtHead}>
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
        <div className={styles.findIdSubContainer}>
          <div className={styles.findIdPhoneContainer}>
            <label className={styles.findIdlabel}>
              <input
                type="radio"
                value="phone"
                checked={selectOption === 'phone'}
                onClick={handleSelectOption}
              />{' '}
              휴대전화로 인증하기
            </label>
            {selectOption === 'phone' && (
              <div>
                <table className={styles.findIdPhoneTable}>
                  <tr>
                    <td>이름</td>
                  </tr>
                  <tr>
                    <input onChange={handleMemNameChange} />
                  </tr>
                  <tr>
                    <td>전화번호</td>
                  </tr>
                  <tr>
                    <input
                      name="memCellphone"
                      style={{ width: '335px' }}
                      onChange={handleCellphoneChange}
                    />
                    <button
                      className={styles.findIdPhoneTableBtn}
                      onClick={FindIdVerifyPhone}
                    >
                      인증번호받기
                    </button>
                    {isTimerVisible && (
                      <div className={styles.findIdEmailTimer}>
                        {timeLeft > 0 ? (
                          <p>남은시간 : {formatTime(timeLeft)}</p>
                        ) : (
                          <p>시간이 초과되었습니다.</p>
                        )}
                      </div>
                    )}
                  </tr>
                  <tr>
                    <input
                      name="phoneAuthNum"
                      style={{ width: '335px' }}
                      onChange={handlePhoneAuthNum}
                    />
                    <button
                      className={styles.findIdPhoneTableBtn}
                      onClick={FindIdPhoneCheck}
                    >
                      인 증
                    </button>
                  </tr>
                </table>
              </div>
            )}
          </div>

          <div className={styles.findIdEmailContainer}>
            <label className={styles.findIdlabel}>
              <input
                type="radio"
                value="email"
                checked={selectOption === 'email'}
                onChange={handleSelectOption}
              />{' '}
              이메일로 인증하기
            </label>
            {selectOption === 'email' && (
              <div>
                <table className={styles.findIdEmaileTable}>
                  <tr>
                    <td>이름</td>
                  </tr>
                  <tr>
                    <input onChange={handleMemNameChange} />
                  </tr>
                  <tr>
                    <td>이메일</td>
                  </tr>
                  <tr>
                    <input
                      name="emailId"
                      style={{ width: '145px' }}
                      onChange={handleEmailIdChange}
                    />
                    <span className={styles.findIdEmailSpan}>@</span>
                    <input
                      name="domain"
                      style={{ width: '145px' }}
                      value={domain}
                      onChange={handleEmailDomainChange}
                    />
                    <select
                      name="domainOption"
                      onChange={handleEmailDomainChange}
                    >
                      <option value="">직접입력</option>
                      <option value="naver.com">네이버</option>
                      <option value="google.com">구글</option>
                      <option value="hanmail.net">한메일</option>
                      <option value="nate.com">네이트</option>
                    </select>
                  </tr>
                  <tr>
                    <button
                      className={styles.findIdEmailTableBtn}
                      style={{ margin: '5px 0' }}
                      onClick={FindIdVerifyEmail}
                    >
                      인증번호받기
                    </button>
                    {isTimerVisible && (
                      <div className={styles.findIdEmailTimer}>
                        {timeLeft > 0 ? (
                          <p>남은시간 : {formatTime(timeLeft)}</p>
                        ) : (
                          <p>시간이 초과되었습니다.</p>
                        )}
                      </div>
                    )}
                  </tr>
                  <tr>
                    <input
                      name="emailAuthNum"
                      style={{ width: '290px' }}
                      onChange={handleEmailAuthNum}
                    />
                    <button
                      className={styles.findIdEmailTableBtn}
                      onClick={FindIdEmailCheck}
                    >
                      인 증
                    </button>
                  </tr>
                </table>
              </div>
            )}
          </div>
          <div className={styles.buttonDiv}>
            <button
              className={styles.findIdBtn}
              style={{
                marginRight: '95px',
                backgroundColor: '#D9D9D9',
                color: '#333333',
                border: 0,
              }}
              onClick={handleMoveReturn}
            >
              이 전
            </button>
            <button className={styles.findIdBtn} onClick={moveFindIdResult}>
              다 음
            </button>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <SeniorFooter></SeniorFooter>
      </div>
    </>
  );
};
export default FindIdSenior;
