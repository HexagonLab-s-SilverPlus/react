// src/pages/member/EnrollManager.js
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import styles from './Enroll.module.css';
import Modal from '../../components/common/Modal';
import OrgSearch from './OrgSearch';

function EnrollManager() {
  // Modal 관리 상태변수
  const [showModal, setShowModal] = useState(false);
  const [selectOrgData, SetSelectOrgData] = useState();

  const [formData, setFormData] = useState({
    memId: '', // 아이디
    memPw: '', // 비밀번호
    memName: '', // 이름
    memEmail: '', // 이메일
    memAddress: '', // 주소
    memCellphone: '', // 휴대전화
    memCellphoneCheck: '', // 인증번호
    memPhone: '', // 일반전화
    memOrgName: '', // 관공서 코드
    memType: 'MANAGER', // 회원타입
    memPwChk: '',
  });

  const rnnEndRef = useRef(null);

  const navigate = useNavigate();
  // 아이디 사용가능여부 상태변수
  const [isIdAvailable, setIsAvailable] = useState(false);
  // 아이디 사용가능여부에 따른 메세지 출력 변수
  const [idCheckMsg, setIdCheckMsg] = useState('아이디 중복확인을 해주세요.');
  // 아이디 중복검사여부에 다른 메세지 컬러 변경 상태변수
  const [messageIdColor, setMessageIdColor] = useState('red');
  // 비밀번호 중복검사여부에 따른 메세지 상태변수
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  // 비밀번호 중복검사여부에 따른 메세지 컬러 변경 상태변수
  const [messagePwdColor, setMessagePwdColor] = useState('');
  // 비밀번호 유효성검사여부에 따른 메세지 컬러 변경 상태변수
  const [passwordValidate, setPasswordValidate] = useState(false);
  // 휴대전화 인증여부에 따른 상태변수
  const [cellphoneCheck, setCellphoneCheck] = useState(false);
  // 휴대전화 인증여부에 따른 메세지 변경 상태변수
  const [cellphoneCheckMsg, setCellphoneCheckMsg] =
    useState('휴대전화 인증을 진행해주세요.');

  // 이메일 인증관련 데이터 관리 상태변수
  const [emailId, setEmailId] = useState('');
  const [domain, setDomain] = useState('');

  const [rnn, setRnn] = useState({
    memRnnFront: '',
    memRnnEnd: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트에서 name과 value를 추출
    setFormData((prevFormData) => {
      let filteredValue = value;

      // 아이디 입력일 경우 영문자만 허용
      // if (name === 'memId') {
      //   filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); // 영문자와 숫자 이외의 문자는 제거
      // }

      const updateFormData = {
        ...prevFormData,
        [name]: filteredValue, // name에 해당하는 값을 업데이트
      };
      // 비밀번호 확인 칸이 입력 중일 때만 유효성 검사 실행
      if (name === 'memPwChk') {
        validate(updateFormData);
      }

      return updateFormData;
    });
  };

  // input 에 이메일정보(아이디부분) 입력시 저장하는 함수
  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
  };

  // input 에 이메일정보(도메인부분) 입력시 저장하는 함수
  const handleEmailDomainChange = (e) => {
    setDomain(e.target.value);
  };

  const handleRnnChange = (e) => {
    const { name, value } = e.target;

    // 입력값에서 숫자만 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');

    setRnn((prevRnn) => ({
      ...prevRnn, // 이전 상태를 복사
      [name]: filteredValue, // 변경할 키와 값만 업데이트
    }));
    if (name === 'memRnnFront' && value.length === 6) {
      rnnEndRef.current.focus();
    }
  };

  // 아이디 중복검사 버튼 클릭시 작동하는 핸들러
  const handleIdCheck = async (e) => {
    e.preventDefault(); // 기본 동작 방지 (중요)
    if (!formData.memId) {
      setIdCheckMsg('아이디를 입력해주세요.');
      setMessageIdColor('red');
      return;
    }

    try {
      const response = await apiSpringBoot.post('/member/idchk', null, {
        params: { memId: formData.memId }, // 서버로 전달할 id 값
      });
      if (response.data === 'ok') {
        setIsAvailable(true);
        setIdCheckMsg('사용가능한 아이디입니다.');
        setMessageIdColor('green');
      } else {
        setIsAvailable(false);
        setIdCheckMsg('이미 사용중인 아이디입니다.');
        setMessageIdColor('red');
      }
    } catch (error) {
      console.error('아이디 중복검사 실패 : '.error);
    }
  };

  // formdata 전송 전 input 값 유효성 검사 처리용 함수
  const validate = (updateFormData) => {
    if (updateFormData) {
      // 비밀번호 일치 확인
      if (updateFormData.memPw !== updateFormData.memPwChk) {
        setPasswordCheckMsg('비밀번호가 일치하지 않습니다.');
        setMessagePwdColor('red');
        return false;
      } else {
        setPasswordCheckMsg('비밀번호가 일치합니다.');
        setMessagePwdColor('green');
        return true;
      }
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    const isValid = passwordRegex.test(password); // 유효성 검사
    setPasswordValidate(isValid); // 상태를 즉시 업데이트
    return isValid;
  };

  const validateCellphone = () => {
    if (!cellphoneCheck) {
      return false;
    } else {
      return true;
    }
  };

  // 가입 버튼 클릭시 작동하는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 이벤트 발생 제거(submit 이벤트 취소) - 기본 폼 제출 방지

    if (!isIdAvailable) {
      alert('아이디 중복확인을 해주세요');
      return;
    }

    if (!validatePassword) {
      alert('비밀번호 조건에 맞지 않습니다.');
      return;
    }

    // 전송 전에 유효성 검사 확인
    if (!validate) {
      alert('비밀번호 일치 확인을 해주세요.');
      return;
    }

    if (!validateCellphone()) {
      alert('휴대전화 인증을 해주세요.');
      return;
    }

    const data = new FormData(); // 커맨드객체 작동을 위한 명칭 일치
    data.append('memId', formData.memId);
    data.append('memPw', formData.memPw);
    data.append('memName', formData.memName);
    data.append('memEmail', `${emailId}@${domain}`);
    data.append('memAddress', formData.memAddress);
    data.append('memCellphone', formData.memCellphone);
    data.append('memRnn', `${rnn.memRnnFront}-${rnn.memRnnEnd}`);
    data.append('memType', formData.memType);
    data.append('memStatus', 'ACTIVE');

    data.append('orgData', JSON.stringify(selectOrgData));

    try {
      const response = await apiSpringBoot.post('/member/enroll', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // 성공 응답 상태 확인
        alert('가입 성공');
        console.log('회원가입 성공 데이터:', response.data);
        navigate('/memRouter/loginmember');
      } else {
        alert('가입 실패');
        console.error('가입 실패 상태:', response);
      }
    } catch (error) {
      console.error('가입 처리 중 오류 발생:', error);
      alert('가입 실패');
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleVerifyPhone = async (e) => {
    e.preventDefault(); // 기본 동작 방지 (중요)
    const memCellphone = formData.memCellphone;
    try {
      const response = await apiSpringBoot.post('/api/sms', {
        memCellphone: memCellphone,
        code: '',
      });
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('인증번호요청 실패', error);
    }
  };

  const handlePhoneCheck = async (e) => {
    e.preventDefault(); // 기본 동작 방지 (중요)
    const memCellphone = formData.memCellphone;
    const memCellphoneCheck = formData.memCellphoneCheck;
    try {
      const response = await apiSpringBoot.post('/api/sms/verify', {
        memCellphone: memCellphone,
        code: memCellphoneCheck,
      });
      console.log('headers', response.headers);
      const verify = response.headers['verify'];
      console.log('verify', verify);
      if (verify === 'true') {
        alert('인증성공');
        setCellphoneCheck(true);
        setCellphoneCheckMsg('휴대전화 인증이 완료되었습니다.');
      } else if (verify === 'false') {
        alert('인증 실패. 인증시간이 만료되었거나 인증번호를 틀렸습니다.');
        setCellphoneCheck(false);
        setCellphoneCheckMsg('휴대전화 인증에 실패하였습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인 실패 : ', error);
    }
  };

  // Modal 관련 함수
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSelect = (selectData) => {
    console.log('검색한 데이터 확인 : ', selectData);
    SetSelectOrgData(selectData);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.enrollMainContainer}>
        <h3 style={{ textAlign: 'center', color: '#064420' }}>
          기관 담당자 회원가입
        </h3>
        <form enctype="multipart/form-data" onSubmit={handleSubmit}>
          <table className={styles.enrollForm}>
            <tr className={styles.valuebox}>이름</tr>
            <tr>
              <input
                type="text"
                name="memName"
                onChange={handleChange}
                className={styles.textbox}
                required
              />
            </tr>
            <tr className={styles.valuebox}>아이디</tr>

            <tr>
              <input
                type="text"
                name="memId"
                onChange={handleChange}
                className={styles.textbox}
                style={{
                  width: '350px',
                  borderStyle: 'solid',
                  height: '30px',
                  marginRight: '20px',
                  marginBottom: 0,
                }}
                value={formData.memId}
                pattern="[a-zA-Z0-9]*" // 영문자와 숫자만 허용
                title="아이디는 영문자와 숫자만 입력 가능합니다." // 경고 메시지
                onInvalid={(e) =>
                  e.target.setCustomValidity(
                    '아이디는 영문자와 숫자만 입력 가능합니다.'
                  )
                }
                onInput={(e) => e.target.setCustomValidity('')} // 입력 시 커스텀 메시지 초기화
                required
              />
              <button className={styles.button2} onClick={handleIdCheck}>
                중복확인
              </button>
            </tr>
            <tr>
              {setIsAvailable == true ? (
                <span
                  style={{
                    color: messageIdColor,
                    fontSize: '10px',
                    margin: 0,
                  }}
                >
                  {idCheckMsg}
                </span>
              ) : (
                <span
                  style={{
                    color: messageIdColor,
                    fontSize: '10px',
                    margin: 0,
                  }}
                >
                  {idCheckMsg}
                </span>
              )}
            </tr>
            <tr className={styles.valuebox}>비밀번호</tr>
            <tr>
              <input
                type="password"
                name="memPw"
                onChange={(e) => {
                  const password = e.target.value;
                  handleChange(e); // 기존 입력 상태 업데이트
                  validatePassword(password); // 즉시 유효성 검사 실행
                }}
                className={styles.textbox}
                style={{ marginBottom: '0' }}
                required
              />
            </tr>
            {!passwordValidate && (
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
            )}
            {passwordValidate && (
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
            <tr className={styles.valuebox}>비밀번호 확인</tr>
            <tr>
              <input
                type="password"
                name="memPwChk"
                className={styles.textbox}
                onChange={handleChange}
                style={{ marginBottom: '0' }}
                required
              />
            </tr>
            {formData.memPwChk === '' ? (
              <tr></tr>
            ) : (
              <tr
                style={{
                  textAlign: 'left',
                  fontSize: '10px',
                  color: messagePwdColor,
                  height: '20px',
                }}
                name="pwdCheck"
              >
                {messagePwdColor === 'green'}
                {passwordCheckMsg}
              </tr>
            )}

            <tr className={styles.valuebox}>이메일</tr>
            <tr>
              <input
                name="emailId"
                style={{ width: '160px' }}
                onChange={handleEmailIdChange}
                required
              />
              <span className={styles.findIdEmailSpan}>@</span>
              <input
                name="domain"
                style={{ width: '160px' }}
                value={domain}
                onChange={handleEmailDomainChange}
                required
              />
              <select name="domainOption" onChange={handleEmailDomainChange}>
                <option value="">직접입력</option>
                <option value="naver.com">네이버</option>
                <option value="google.com">구글</option>
                <option value="hanmail.net">한메일</option>
                <option value="nate.com">네이트</option>
              </select>
            </tr>
            <tr className={styles.valuebox}>주민등록번호</tr>
            <tr>
              <input
                type="text"
                name="memRnnFront"
                onChange={handleRnnChange}
                className={styles.textbox}
                style={{ width: '219px' }}
                maxLength={6}
                value={rnn.memRnnFront}
                required
              />
              <span>-</span>
              <input
                type="password"
                name="memRnnEnd"
                onChange={handleRnnChange}
                style={{ width: '219px' }}
                maxLength={7}
                value={rnn.memRnnEnd}
                ref={rnnEndRef}
                required
              />
            </tr>
            <tr className={styles.valuebox}>기관</tr>
            <tr>
              <input
                type="text"
                name="memOrgName"
                value={selectOrgData ? selectOrgData.org : ''}
                className={styles.textbox}
                style={{ width: '350px' }}
                onClick={(e) => handleSearch(e)}
                required
              />
              <button
                className={styles.button2}
                style={{
                  marginLeft: '20px',
                }}
                onClick={(e) => handleSearch(e)}
              >
                검색
              </button>
            </tr>
            <tr className={styles.valuebox}>기관주소</tr>
            <tr>
              <input
                type="text"
                name="memAddress"
                value={selectOrgData ? selectOrgData.add : ''}
                className={styles.textbox}
                required
              />
            </tr>
            <tr className={styles.valuebox}>기관전화</tr>
            <tr>
              <input
                className={styles.textbox}
                type="text"
                name="memPhone"
                placeholder=" '-' 없이 입력"
                onChange={handleChange}
                required
              />
            </tr>
            <tr className={styles.valuebox}>휴대전화</tr>
            <tr>
              <input
                type="text"
                name="memCellphone"
                onChange={handleChange}
                className={styles.textbox}
                placeholder=" '-' 없이 입력"
                style={{ width: '350px' }}
                required
              />
              <button
                className={styles.button2}
                style={{
                  marginLeft: '20px',
                }}
                onClick={handleVerifyPhone}
              >
                인증번호받기
              </button>
            </tr>
            <tr>
              <input
                type="text"
                name="memCellphoneCheck"
                onChange={handleChange}
                className={styles.textbox}
                placeholder=" 인증번호 입력"
                style={{ width: '350px' }}
              />
              <button
                className={styles.button2}
                style={{
                  marginLeft: '20px',
                }}
                onClick={handlePhoneCheck}
              >
                인증
              </button>
            </tr>
            <tr>
              {!cellphoneCheck ? (
                <span style={{ color: 'red', fontSize: '10px', margin: 0 }}>
                  {cellphoneCheckMsg}
                </span>
              ) : (
                <span style={{ color: 'green', fontSize: '10px', margin: 0 }}>
                  {cellphoneCheckMsg}
                </span>
              )}
            </tr>
            <tr>
              <button
                className={styles.button1}
                onClick={(e) => handleGoBack(e)}
                style={{ backgroundColor: '#d9d9d9', color: '#333333' }}
              >
                이전
              </button>
              <button
                type="submit"
                className={styles.button1}
                style={{ marginLeft: '90px' }}
              >
                가입
              </button>
            </tr>
          </table>
        </form>
      </div>
      {/* 기관 검색 모달창 */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <OrgSearch onSelect={handleSelect}></OrgSearch>
        </Modal>
      )}
    </>
  );
}

export default EnrollManager;
