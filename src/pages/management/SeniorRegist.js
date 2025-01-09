// src/pages/management/SeniorRegist.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeniorRegist.module.css';
import SideBar from '../../components/common/SideBar';
import noimage from '../../assets/images/No image.png';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';

const SeniorRegist = () => {
  const { member } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [fileData, setFileData] = useState();
  //   const { UUID } = useParams();
  const [formData, setFormData] = useState({
    memId: '', // 아이디
    memPw: '', // 비밀번호
    memName: '', // 이름
    memAddress: '', // 주소
    memCellphone: '', // 휴대전화
    memCellphoneCheck: '', // 인증번호
    memPhone: '', // 일반전화
    memGovCode: '', // 관공서 코드
    memType: 'SENIOR', // 회원타입
    memPwChk: '',
    memStatus: 'ACTIVE',
    memRnn: '',
    memEmail: '',
  });
  const [initialData, setInitialData] = useState(null); // 초기 데이터를 저장할 상태

  // 나이 데이터 저장 상태변수
  const [age, setAge] = useState('');
  // 주민등록번호 저장 상태변수
  const [ssn, setSsn] = useState('');

  // 이메일 인증관련 데이터 관리 상태변수
  const [emailId, setEmailId] = useState('');
  const [domain, setDomain] = useState('');

  // 아이디 사용가능여부 상태변수
  const [isIdAvailable, setIsAvailable] = useState(false);
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
  // 비밀번호 일치 확인여부 관리 상태변수
  const [validatePwd, setValidatePwd] = useState(false);

  // 파일 첨부 함수
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setProfile(URL.createObjectURL(file));
      setFileData(file);
    }
  };

  // 파일 첨부 취소 함수
  const handleFileDelete = (e) => {
    e.preventDefault();
    setProfile(null);
  };

  // 최초 렌더링 시 폼데이터 초기값 저장
  useEffect(() => {
    setInitialData(formData);
  }, []);

  // formData 값 변경 함수
  const handleInfoChange = (e) => {
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

  // 주민등록번호 정보를 이용한 나이 계산함수
  const calculateAge = (ssn) => {
    if (!ssn || ssn.length !== 13) {
      alert('주민등록번호를 정확히 입력해주세요.');
      return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const yearPrefix = parseInt(ssn[6], 10) < 3 ? 1900 : 2000; // 1, 2는 1900년대, 3, 4는 2000년대
    const birthYear = yearPrefix + parseInt(ssn.slice(0, 2), 10);
    const birthMonth = parseInt(ssn.slice(2, 4), 10);
    const birthDay = parseInt(ssn.slice(4, 6), 10);

    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let calculatedAge = currentYear - birthYear;

    // 생일이 지났는지 확인
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      calculatedAge -= 1;
    }

    setAge(calculatedAge);
  };

  // 주민등록번호 변경 저장 함수
  const handleSsnChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 13); // 숫자만 허용하고 최대 13자리 제한

    if (value.length > 6) {
      value = value.slice(0, 6) + '-' + value.slice(6); // 6자리 이후에 자동으로 '-' 추가
    }

    setSsn(value);
  };

  // ssn 값이 변경되었을 때 자동으로 나이 계산
  useEffect(() => {
    if (ssn.length === 14) {
      console.log('입력 완료된 주민등록번호:', ssn);
      calculateAge(ssn.replace('-', '')); // '-' 제거 후 계산
    }
  }, [ssn]);

  // input 에 이메일정보(아이디부분) 입력시 저장하는 함수
  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
  };

  // input 에 이메일정보(도메인부분) 입력시 저장하는 함수
  const handleEmailDomainChange = (e) => {
    setDomain(e.target.value);
  };

  // 아이디 중복검사 버튼 클릭시 작동하는 핸들러
  const handleIdCheck = async (e) => {
    e.preventDefault(); // 기본 동작 방지 (중요)
    if (!formData.memId) {
      setIdCheckMsg('아이디를 입력해주세요.');
      setMessageIdColor('red');
      return;
    }
    console.log('전달할 아이디 값 : ', formData.memId);

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
        setValidatePwd(false);
        return false;
      } else {
        setPasswordCheckMsg(' 비밀번호가 일치합니다.');
        setMessagePwdColor('green');
        setValidatePwd(true);
        return true;
      }
    }
  };

  // 비밀번호 유효성 검사
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

  const handleCheckPassword = () => {
    if (formData.memPw) {
      validatePassword();
    }
  };

  // 어르신 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdAvailable) {
      alert('아이디 중복확인을 해주세요');
      return;
    }

    if (!validatePassword()) {
      alert('비밀번호 조건에 맞지 않습니다.');
      return;
    }

    // 전송 전에 유효성 검사 확인
    if (!validatePwd) {
      alert('비밀번호 일치 확인을 해주세요.');
      return;
    }

    if (!fileData) {
      alert('프로필 사진을 첨부해주세요.');
      return;
    }

    // const currentTimestamp = new Date();
    // console.log('memChangeStatus 에 넣을 현재시간 : ', currentTimestamp);
    // const currentTimestampKST = new Date(
    //   currentTimestamp.getTime() + 9 * 60 * 60 * 1000
    // )
    //   .toISOString()
    //   .replace('T', ' ')
    //   .replace(/\..*/, '');

    // // formData 상태의 최신 값으로 FormData에 추가
    // const updatedFormData = {
    //   ...formData, // 기존 상태 값
    //   memChangeStatus: currentTimestampKST, // 새로운 값 추가
    // };

    // FormData 객체 생성
    const data = new FormData();

    // FormData 객체에 값 추가
    Object.entries(formData).forEach(([key, value]) => {
      if (value != '') {
        data.append(key, value);
      }
    });

    data.append('memRnn', ssn);
    data.append('memEmail', `${emailId}@${domain}`);
    data.append('memUUIDMgr', member.memUUID);
    data.append('profile', fileData);

    console.log('formData 확인 : ', formData); // 여전히 이전 상태 출력 가능 (비동기 특성)
    console.log('FormData 확인 : ', Array.from(data.entries())); // 실제 전송할 데이터 확인
    try {
      await apiSpringBoot.post(`/member/sregist`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('어르신 등록 성공');
      console.log('어르신 등록 성공');
    } catch (error) {
      console.error('어르신 등록 실패 : ', error);
    }
  };

  // 렌더링 파트

  if (!formData) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  return (
    <div className={styles.mdetailMainContainer}>
      <SideBar />
      <div className={styles.mdetailSubContainer}>
        <div className={styles.mdetailHeader}>
          <p>어르신 관리</p>
        </div>
        <div className={styles.mdetailSubHeader}>
          <p>어르신 등록</p>
        </div>
        <div className={styles.mdetailDiv}>
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className={styles.sregistForm}
          >
            <div className={styles.mdetailTableDiv}>
              <div className={styles.mdetailProfilephoto}>
                <img
                  src={profile || noimage}
                  className={styles.sregistProfile}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('profile').click();
                  }}
                />
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  onChange={handleFileChange}
                ></input>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('profile').click();
                  }}
                >
                  프로필 사진
                </button>
                <button
                  style={{
                    marginLeft: '5px',
                    color: 'red',
                    border: 0,
                  }}
                  onClick={handleFileDelete}
                >
                  X
                </button>
              </div>

              <table className={styles.mdetailTable}>
                <tr>
                  <th>이 름</th>
                  <td>
                    <input
                      name="memName"
                      value={formData.memName}
                      onChange={handleInfoChange}
                    />
                  </td>
                  <th style={{ fontSize: '17px', textAlign: 'center' }}>
                    주민등록번호
                  </th>
                  <td>
                    <input
                      name="memRnn"
                      value={ssn}
                      onChange={handleSsnChange}
                    />
                  </td>
                  <th>나 이</th>
                  <td>
                    <input
                      style={{ width: '100px' }}
                      value={`${age}세`}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th>성 별</th>
                  <td>
                    {ssn === '' ? (
                      <input />
                    ) : ssn.length > 13 ? (
                      <input
                        value={
                          ssn.split('-')[1][0] === '1' ||
                          ssn.split('-')[1][0] === '3'
                            ? '남성'
                            : '여성'
                        }
                        readOnly
                      />
                    ) : (
                      <input />
                    )}
                  </td>
                  <div className={styles.sregistEmailDiv}>
                    <th>이 메 일</th>
                    <td>
                      <input
                        name="emailId"
                        style={{ width: '160px' }}
                        onChange={handleEmailIdChange}
                      />
                      <span style={{ margin: '0 10px' }}>@</span>

                      <input
                        name="domain"
                        style={{ width: '160px', margin: 0 }}
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
                    </td>
                  </div>
                </tr>
                <tr>
                  <th>연 락 처</th>
                  <td>
                    <input
                      value={formData.memCellphone}
                      onChange={handleInfoChange}
                      name="memCellphone"
                      placeholder=" - 없이 숫자만 입력"
                      maxLength={11}
                    />
                  </td>
                  <th style={{ fontSize: '17px', textAlign: 'center' }}>
                    자택전화번호
                  </th>
                  <td>
                    <input
                      value={formData.memPhone}
                      name="memPhone"
                      style={{ width: '500px' }}
                      onChange={handleInfoChange}
                      type="tel"
                      placeholder=" - 없이 숫자만 입력"
                      maxLength={11}
                    />
                  </td>
                </tr>
                <tr>
                  <th>주 소</th>
                  <td>
                    <input
                      name="memAddress"
                      value={formData.memAddress}
                      onChange={handleInfoChange}
                      style={{ width: '900px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>기 관</th>
                  <td>
                    <input readOnly />
                  </td>
                  <th>기 관 코 드</th>
                  <td>
                    <input value={member.memGovCode} readOnly />
                  </td>
                  <th>담 당 자</th>
                  <td>
                    <input
                      style={{ width: '100px' }}
                      value={member.memName}
                      readOnly
                    />
                  </td>
                </tr>
                <tr style={{ height: '40px' }}>
                  <div className={styles.sregistIdPwd}>
                    <th>아 이 디</th>
                    <td>
                      <input
                        name="memId"
                        value={formData.memId}
                        onChange={handleInfoChange}
                      />
                    </td>
                    <th>비 밀 번 호</th>
                    <td>
                      <input
                        type="password"
                        name="memPw"
                        value={formData.memPw}
                        onChange={(e) => {
                          handleInfoChange(e);
                          handleCheckPassword();
                        }}
                      />
                    </td>
                    <th style={{ fontSize: '17px', textAlign: 'center' }}>
                      비밀번호확인
                    </th>
                    <td>
                      <input
                        type="password"
                        name="memPwChk"
                        value={formData.memPwChk}
                        onChange={handleInfoChange}
                      />
                    </td>
                  </div>
                </tr>
                <tr>
                  <div className={styles.sregistIdPwdChk}>
                    <th></th>
                    <td>
                      <button onClick={handleIdCheck}>중복확인</button>
                      {isIdAvailable ? (
                        <input
                          disabled
                          value={idCheckMsg}
                          style={{
                            width: '130px',
                            color: messageIdColor,
                            fontSize: '10px',
                            margin: 0,
                            marginLeft: '5px',
                          }}
                        />
                      ) : (
                        <input
                          disabled
                          value={idCheckMsg}
                          style={{
                            width: '130px',
                            color: messageIdColor,
                            fontSize: '10px',
                            margin: 0,
                            marginLeft: '5px',
                          }}
                        />
                      )}
                    </td>
                    <th></th>
                    <td>
                      {!passwordValidate ? (
                        <input
                          disabled
                          value="영문 소문자, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요."
                          style={{
                            textAlign: 'left',
                            fontSize: '9px',
                            color: 'red',
                            height: '20px',
                            width: '250px',
                          }}
                        />
                      ) : (
                        <input
                          style={{
                            textAlign: 'left',
                            fontSize: '9px',
                            color: 'green',
                            height: '20px',
                            width: '250px',
                          }}
                          disabled
                          value="사용가능한 비밀번호입니다."
                        />
                      )}
                    </td>
                    <th></th>
                    <td>
                      {formData.memPwChk === '' ? (
                        <input value="" disabled />
                      ) : (
                        <input
                          disabled
                          value={passwordCheckMsg}
                          style={{
                            color: messagePwdColor,
                            width: '250px',
                            fontSize: '9px',
                          }}
                        />
                      )}
                    </td>
                  </div>
                </tr>
              </table>
            </div>
            <div className={styles.mdetailButtonDiv}>
              <div>
                <button
                  className={styles.mdetailButton1}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                >
                  목 록
                </button>
              </div>
              <div>
                <input
                  type="reset"
                  value="초 기 화"
                  className={styles.mdetailButton2}
                  onClick={() => setFormData(initialData)}
                />
                <input
                  type="submit"
                  value="등 록"
                  className={styles.mdetailButton1}
                  style={{ margin: '0' }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeniorRegist;
