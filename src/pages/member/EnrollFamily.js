// src/pages/member/EnrollFamily.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import styles from './Enroll.module.css';
import Modal from '../../components/common/Modal';
import SearchSenior from './SearchSenior';

function EnrollFamily({ memType }) {
  // Modal 관리 상태변수
  const [showModal, setShowModal] = useState(false);
  const [selectSeniorData, SetSelectSeniorData] = useState();

  const [formData, setFormData] = useState({
    memId: '', // 아이디
    memPw: '', // 비밀번호
    memName: '', // 이름
    memEmail: '', // 이메일
    memAddress: '', // 주소
    memCellphone: '', // 휴대전화
    memCellphoneCheck: '', // 인증번호
    // memPhone: '',       // 일반전화
    // memGovCode: '', // 관공서 코드
    memType: memType, // 회원타입
    memPwChk: '',
  });

  const navigate = useNavigate();
  // 아이디 사용가능여부 상태변수
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  // 아이디 사용가능여부에 따른 메세지 출력 변수
  const [idCheckMsg, setIdCheckMsg] = useState('아이디 중복확인을 해주세요.');
  // 아이디 중복검사여부에 다른 메세지 컬러 변경 상태변수
  const [messageIdColor, setMessageIdColor] = useState('red');
  // 비밀번호 유효성검사여부에 따른 메세지 상태변수
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  // 비밀번호 유효성검사여부에 따른 메세지 컬러 변경 상태변수
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
      const updateFormData = {
        ...prevFormData,
        [name]: value, // name에 해당하는 값을 업데이트
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
    setRnn((prevRnn) => ({
      ...prevRnn, // 이전 상태를 복사
      [name]: value, // 변경할 키와 값만 업데이트
    }));
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
        setIsIdAvailable(true);
        setIdCheckMsg('사용가능한 아이디입니다.');
        setMessageIdColor('green');
      } else {
        setIsIdAvailable(false);
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
        setPasswordCheckMsg(' 비밀번호가 일치합니다.');
        setMessagePwdColor('green');
        return true;
      }
    }
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (passwordRegex.test(formData.memPw)) {
      setPasswordValidate(true);
    } else {
      setPasswordValidate(false);
    }
    return passwordRegex.test(formData.memPw);
  };

  const validateCellphone = () => {
    if (!cellphoneCheck) {
      return false;
    } else {
      return true;
    }
  };

  const handleCheckPassword = () => {
    if (formData.memPw) {
      validatePassword();
    }
  };

  // 가입 버튼 클릭시 작동하는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 이벤트 발생 제거(submit 이벤트 취소) - 기본 폼 제출 방지

    if (!isIdAvailable) {
      alert('아이디 중복확인을 해주세요');
      return;
    }

    if (!validatePassword()) {
      alert('비밀번호 조건에 맞지 않습니다.');
      return;
    }

    // 전송 전에 유효성 검사 확인
    if (!validate()) {
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

    // 선택된 파일 추가
    selectedFiles.forEach((file) => {
      data.append('memFiles', file); // 파일 배열로 전송
    });

    try {
      await apiSpringBoot.post('/member/enroll', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('가입 성공');
      console.log('memType', memType);
      onEnrollSuccess();
    } catch (error) {
      console.error('가입 실패');
      console.log(formData);
      console.log(data);
      alert('가입실패');
    }
  };

  const handleGoBack = () => {};

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
        alert('인증 실패. 인증시간이 완료되었거나 인증번호를 틀렸습니다.');
        setCellphoneCheck(false);
        setCellphoneCheckMsg('휴대전화 인증에 실패하였습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인 실패 : ', error);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    event.preventDefault();
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    // 기본 동작 방지
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // Modal 관련 함수
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSelect = (data) => {
    SetSelectSeniorData(data);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.enrollMainContainer}>
        <h3 style={{ textAlign: 'center', color: '#064420' }}>
          가족 계정 회원가입
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
              />
              <button className={styles.button2} onClick={handleIdCheck}>
                중복확인
              </button>
            </tr>
            <tr>
              {isIdAvailable ? (
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
            <tr className={styles.valuebox}>비밀번호 확인</tr>
            <tr>
              <input
                type="password"
                name="memPwChk"
                className={styles.textbox}
                onChange={handleChange}
                style={{ marginBottom: '0' }}
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
              />
              <span className={styles.findIdEmailSpan}>@</span>
              <input
                name="domain"
                style={{ width: '160px' }}
                value={domain}
                onChange={handleEmailDomainChange}
              />
              <select name="domainOption" onChange={handleEmailDomainChange}>
                <option value="">직접입력</option>
                <option value="naver.com">네이버</option>
                <option value="google.com">구글</option>
                <option value="hanmail.net">한메일</option>
                <option value="nate.com">네이트</option>
              </select>
            </tr>
            <tr className={styles.valuebox}>주소</tr>
            <tr>
              <input
                type="text"
                name="memAddress"
                onChange={handleChange}
                className={styles.textbox}
              />
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
              />
              <span>-</span>
              <input
                type="text"
                name="memRnnEnd"
                onChange={handleRnnChange}
                style={{ width: '219px' }}
                maxLength={7}
              />
            </tr>
            <tr className={styles.valuebox}>휴대전화</tr>
            <tr>
              <input
                type="text"
                name="memCellphone"
                onChange={handleChange}
                className={styles.textbox}
                placeholder="'-' 없이 입력"
                style={{ width: '350px' }}
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
            <tr style={{ marginBottom: 0 }}>
              <input
                type="text"
                name="memCellphoneCheck"
                onChange={handleChange}
                className={styles.textbox}
                placeholder="인증번호 입력"
                style={{ width: '350px' }}
              />
              <button
                className={styles.button2}
                style={{ marginLeft: '20px' }}
                onClick={handlePhoneCheck}
              >
                인증
              </button>
            </tr>
            {!cellphoneCheck ? (
              <span style={{ color: 'red', fontSize: '10px', marginTop: 0 }}>
                {cellphoneCheckMsg}
              </span>
            ) : (
              <span style={{ color: 'green', fontSize: '10px', marginTop: 0 }}>
                {cellphoneCheckMsg}
              </span>
            )}
            <tr className={styles.valuebox}>어르신</tr>
            <tr>
              <input
                className={styles.textbox}
                style={{ width: '350px' }}
                value={selectSeniorData}
              />
              <button
                className={styles.button2}
                style={{ marginLeft: '20px' }}
                onClick={(e) => handleSearch(e)}
              >
                검색
              </button>
            </tr>

            <tr>
              <input
                type="text"
                className={styles.fileinputbox}
                value={
                  selectedFiles.length > 0
                    ? `${selectedFiles.length}개의 파일 선택됨`
                    : '선택된 파일 없음'
                }
                disabled
              />
              <input
                type="file"
                id="file-upload"
                multiple
                accept="*/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className={styles.button2}
                onClick={() => document.getElementById('file-upload').click()}
              >
                파일 선택
              </button>
            </tr>
            <span style={{ color: 'red', fontSize: '10px' }}>
              어르신과의 보호자 관계 확인을 위해{' '}
              <span style={{ textDecoration: 'underline', fontSize: '11px' }}>
                가족관계증명서
              </span>{' '}
              를 제출해 주시기 바랍니다.
            </span>
            <div className={styles.filelist}>
              {selectedFiles.map((file, index) => (
                <div className={styles.filelistitem} key={index}>
                  <span className={styles.filename}>{file.name}</span>
                  <button
                    type="button" // 버튼이 form의 기본 동작(submit)을 막아줌
                    className={styles.fileremovebutton}
                    onClick={(e) => {
                      e.preventDefault(); // 기본 동작 방지
                      removeFile(index);
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.button1}
                onClick={handleGoBack}
                style={{ backgroundColor: '#d9d9d9', color: '#333333' }}
              >
                이전
              </button>
              <input
                type="submit"
                value="가입"
                className={styles.button1}
                style={{ marginLeft: '90px' }}
              />
            </div>
          </table>
        </form>
      </div>

      {/* 검색 창 Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <SearchSenior onSelect={handleSelect} />
        </Modal>
      )}
    </>
  );
}

export default EnrollFamily;
