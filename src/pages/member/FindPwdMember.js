// src/pages/member/FindPwdMember.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindPwdMember.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindPwdMember = () => {
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
      memEmail: '',
      memCellphone: '',
      isVerify: false,
    });
  };

  // 다음페이지로 보낼 데이터를 관리하는 상태변수
  const [verifyData, setVerifyData] = useState({
    memId: '',
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

  // input 에 아이디 입력시 저장하는 함수
  const handleMemIdChange = (e) => {
    setVerifyData((prevVerifiyData) => ({
      ...prevVerifiyData,
      memId: e.target.value,
    }));
  };

  // 휴대전화 인증번호 요청
  const FindPwdVerifyPhone = async () => {
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
  const FindPwdPhoneCheck = async () => {
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
  const FindPwdVerifyEmail = async () => {
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
  const FindPwdEmailCheck = async () => {
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

  // 비밀번호 찾기 결과페이지 이동 함수
  const moveFindPwdResult = () => {
    if (verifyData.isVerify === true) {
      navigate('/fpmResult', { state: verifyData });
    } else {
      alert('휴대전화 또는 이메일 인증을 진행해주세요.');
      return;
    }
  };

  const handleMoveReturn = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  // const moveFindPwdResult = () => {
  //   navigate('/fpmResult', { state: verifyData });
  // };

  const handleMoveIdFind = () => {
    navigate('/findidmember');
  };

  return (
    <>
      <div className={styles.findPwdMainContainer}>
        <div className={styles.findPwdtHead}>
          <div>
            <button
              className={styles.findNavigateBtn1}
              onClick={handleMoveIdFind}
            >
              아이디찾기
            </button>
            <button className={styles.findNavigateBtn2}>비밀번호찾기</button>
          </div>
          {/* <div className={styles.fimProgress}>
            <small>
              회원정보인증 <span>→</span>
            </small>
          </div> */}
        </div>
        <div className={styles.findPwdSubContainer}>
          <div className={styles.findPwdPhoneContainer}>
            <label className={styles.findPwdlabel}>
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
                <table className={styles.findPwdPhoneTable}>
                  <tr>
                    <td>아이디</td>
                  </tr>
                  <tr>
                    <input onChange={handleMemIdChange} />
                  </tr>
                  <tr>
                    <td>전화번호</td>
                  </tr>
                  <tr>
                    <input
                      name="memCellphone"
                      style={{ width: '260px' }}
                      onChange={handleCellphoneChange}
                      placeholder="'-' 를 제외한 숫자만 입력하세요."
                    />
                    <button
                      className={styles.findPwdPhoneTableBtn}
                      onClick={FindPwdVerifyPhone}
                    >
                      인증번호받기
                    </button>
                    {isTimerVisible && (
                      <div className={styles.findPwdEmailTimer}>
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
                      style={{ width: '260px' }}
                      onChange={handlePhoneAuthNum}
                    />
                    <button
                      className={styles.findPwdPhoneTableBtn}
                      onClick={FindPwdPhoneCheck}
                    >
                      인 증
                    </button>
                  </tr>
                </table>
              </div>
            )}
          </div>

          <div className={styles.findPwdEmailContainer}>
            <label className={styles.findPwdlabel}>
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
                <table className={styles.findPwdEmaileTable}>
                  <tr>
                    <td>아이디</td>
                  </tr>
                  <tr>
                    <input onChange={handleMemIdChange} />
                  </tr>
                  <tr>
                    <td>이메일</td>
                  </tr>
                  <tr>
                    <input
                      name="emailId"
                      style={{ width: '130px' }}
                      onChange={handleEmailIdChange}
                    />
                    <span className={styles.findPwdEmailSpan}>@</span>
                    <input
                      name="domain"
                      style={{ width: '130px' }}
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
                      className={styles.findPwdEmailTableBtn}
                      style={{ margin: 0 }}
                      onClick={FindPwdVerifyEmail}
                    >
                      인증번호받기
                    </button>
                    {isTimerVisible && (
                      <div className={styles.findPwdEmailTimer}>
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
                      className={styles.findPwdEmailTableBtn}
                      onClick={FindPwdEmailCheck}
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
              className={styles.findPwdBtn}
              style={{
                marginRight: '80px',
                backgroundColor: '#D9D9D9',
                color: '#333333',
                border: 0,
              }}
              onClick={handleMoveReturn}
            >
              이 전
            </button>
            <button className={styles.findPwdBtn} onClick={moveFindPwdResult}>
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

export default FindPwdMember;
