// src/pages/member/EnrollManager.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import axios from 'axios';
// import { jwtDecode } from "jwt-decode"; // jwt-decode jwt 토큰 사용시 필요한 패키지
import styles from './Enroll.module.css';

function EnrollManager() {
  const [formData, setFormData] = useState({
    memId: '', // 아이디
    memPw: '', // 비밀번호
    memName: '', // 이름
    memEmail: '', // 이메일
    memAddress: '', // 주소
    memCellphone: '', // 휴대전화
    // memPhone: '',       // 일반전화
    memRnn: '', // 주민등록번호
    // memGovCode: '', // 관공서 코드
    memType: 'ADMIN', // 회원타입
  });

  const navigate = useNavigate();
  // 아이디 사용가능여부 상태변수
  const [isIdAvailable, setIsAvailable] = useState(null);
  // 아이디 사용가능여부에 따른 메세지 출력 변수
  const [idCheckMsg, setIdCheckMsg] = useState('');
  // 아이디 중복검사여부에 다른 메세지 컬러 변경 상태변수
  const [messageIdColor, setMessageIdColor] = useState('');
  // 비밀번호 중복검사여부에 따른 메세지 상태변수
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  // 비밀번호 중복검사여부에 따른 메세지 컬러 변경 상태변수
  const [messagePwdColor, setMessagePwdColor] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트에서 name과 value를 추출
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // name에 해당하는 값을 업데이트
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
  const validate = () => {
    // 비밀번호 일치 확인
    if (formData.memPw !== formData.memPwChk) {
      setPasswordCheckMsg('비밀번호가 일치하지 않습니다.');
      setMessagePwdColor('red');
      return false;
    } else {
      setPasswordCheckMsg(' 비밀번호가 일치합니다.');
      setMessagePwdColor('green');
      return true;
    }
  };

  // 비밀번호 확인 input 의 포커스가 사라지면 유효성검사를 작동시키는 함수
  const handleConfirmPwd = () => {
    if (formData.memPwChk) {
      validate();
    }
  };

  // 가입 버튼 클릭시 작동하는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 이벤트 발생 제거(submit 이벤트 취소) - 기본 폼 제출 방지

    // 전송 전에 유효성 검사 확인
    if (!validate()) {
      return;
    }

    const data = new FormData(); // 커맨드객체 작동을 위한 명칭 일치
    data.append('memId', formData.memId);
    data.append('memPw', formData.memPw);
    data.append('memName', formData.memName);
    data.append('memEmail', formData.memEmail);
    data.append('memAddress', formData.memAddress);
    data.append('memCellphone', formData.memCellphone);
    data.append('memRnn', formData.memRnn);
    data.append('memType', 'ADMIN');
    data.append('memStatus', 'ACTIVE');

    try {
      await apiSpringBoot.post('/member', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('가입 성공');
      navigate('/');
    } catch (error) {
      console.error('가입 실패');
      console.log(formData);
      console.log(data);
      alert('가입실패');
    }
  };

  const handleGoBack = () => {};

  return (
    <div>
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
            {setIsAvailable == true ? (
              <span
                style={{
                  color: messageIdColor,
                  fontSize: '10px',
                  marginTop: 0,
                }}
              >
                {idCheckMsg}
              </span>
            ) : (
              <span
                style={{
                  color: messageIdColor,
                  fontSize: '10px',
                  marginTop: 0,
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
              onChange={handleChange}
              className={styles.textbox}
              style={{ marginBottom: '0' }}
            />
          </tr>
          <tr
            style={{
              textAlign: 'left',
              fontSize: '10px',
              color: 'red',
              height: '20px',
            }}
          >
            {}
            대소문자, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요.
          </tr>
          <tr className={styles.valuebox}>비밀번호 확인</tr>
          <tr>
            <input
              type="password"
              name="memPwChk"
              className={styles.textbox}
              onChange={handleChange}
              style={{ marginBottom: '0' }}
              onBlur={handleConfirmPwd}
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
          <tr className={styles.valuebox}>이메일</tr>
          <tr>
            <input
              type="email"
              name="memEmail"
              onChange={handleChange}
              className={styles.textbox}
            />
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
              name="memRnn"
              onChange={handleChange}
              className={styles.textbox}
            />
          </tr>
          <tr className={styles.valuebox}>기관 코드</tr>
          <tr>
            <input
              type="text"
              name=""
              onChange={handleChange}
              className={styles.textbox}
              style={{ width: '350px' }}
            />
            <button
              className={styles.button2}
              style={{
                marginLeft: '20px',
              }}
            >
              검색
            </button>
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
            >
              인증번호 받기
            </button>
          </tr>
          <tr>
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
              style={{
                marginLeft: '20px',
              }}
            >
              인증
            </button>
          </tr>
          <tr>
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
          </tr>
        </table>
      </form>
    </div>
  );
}

export default EnrollManager;
