// src/pages/management/SeniorDetailViewManager.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SeniorDetailViewManager.module.css';
import SideBar from '../../../components/common/SideBar';
import { AuthContext } from '../../../AuthProvider';
import { apiSpringBoot } from '../../../utils/axios';
import loading from '../../../assets/images/loading.gif';

const SeniorDetailViewManager = ({ UUID, senior, manager, profileData }) => {
  const { member } = useContext(AuthContext);
  //   const { UUID } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [fileData, setFileData] = useState();
  //   const { UUID } = useParams();
  const [seniorFormData, setSeniorFormData] = useState();
  const [initialData, setInitialData] = useState(null); // 초기 데이터를 저장할 상태

  // // 담당자 정보 객체 저장 상태변수
  // const [manager, setManager] = useState();

  // 전송 온 파일데이터 저장 상태변수
  const [fData, setFData] = useState([]);

  // 나이 데이터 저장 상태변수
  const [age, setAge] = useState('');
  // 주민등록번호 저장 상태변수
  const [ssn, setSsn] = useState('');

  // 이메일 인증관련 데이터 관리 상태변수
  const [emailId, setEmailId] = useState('');
  const [domain, setDomain] = useState('');

  // 비밀번호, 비밀번호 확인 저장관리 상태변수
  const [pwd, setPwd] = useState({
    memPwd: '',
    memPwdChk: '',
  });

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

  // formData 값 변경 함수
  //   const handleInfoChange = (e) => {
  //     const { name, value } = e.target; // 이벤트에서 name과 value를 추출
  //     setSeniorFormData((prevSeniroFormData) => {
  //       const updateFormData = {
  //         ...prevSeniroFormData,
  //         [name]: value, // name에 해당하는 값을 업데이트
  //       };
  //       return updateFormData;
  //     });
  //   };
  const handleInfoChange = (e) => {
    const { name, value } = e.target;

    // 주민등록번호 처리 로직
    let updatedValue = value;
    if (name === 'memRnn') {
      updatedValue = value.replace(/[^0-9]/g, '').slice(0, 13); // 숫자만 허용하고 최대 13자리 제한
      if (updatedValue.length > 6) {
        updatedValue = updatedValue.slice(0, 6) + '-' + updatedValue.slice(6); // 6자리 이후에 자동으로 '-' 추가
      }
      setSsn(updatedValue); // 별도로 ssn 상태를 업데이트
      if (ssn.length == 13) {
        calculateAge(ssn);
      }
    }

    // formData 상태 업데이트
    setSeniorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue, // name에 해당하는 값을 업데이트
    }));
  };

  // 비밀번호, 비밀번호 재설정을 위한 값 변경 함수
  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwd((prevPwd) => {
      const updatePwd = {
        ...prevPwd,
        [name]: value,
      };
      console.log('비밀번호 입력 확인 : ', pwd);
      // 비밀번호 확인 칸이 입력 중일 때만 유효성 검사 실행
      if (name === 'memPwdChk') {
        validate(updatePwd);
      }
      return updatePwd;
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

  //   // 주민등록번호 변경 저장 함수
  //   const handleSsnChange = (e) => {
  //     let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 13); // 숫자만 허용하고 최대 13자리 제한

  //     if (value.length > 6) {
  //       value = value.slice(0, 6) + '-' + value.slice(6); // 6자리 이후에 자동으로 '-' 추가
  //     }

  //     setSsn(value);
  //   };

  // 날짜시간 데이터 UTC -> KST 변환 함수
  const convertUTCToKST = (utcDate) => {
    if (!utcDate) {
      console.error('Invalid date input:', utcDate);
      return null;
    }

    try {
      let date;

      // ISO 8601 형식인지 확인
      if (utcDate.includes('T') && utcDate.endsWith('Z')) {
        date = new Date(utcDate); // 이미 ISO 형식인 경우
      } else {
        // 서버 형식(`yyyy-MM-dd HH:mm:ss.SSS`)을 ISO 형식으로 변환
        const isoDateString = utcDate.replace(' ', 'T') + 'Z';
        date = new Date(isoDateString);
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date object');
      }

      // UTC → KST 변환
      const kstOffset = 9 * 60; // +9시간 (분 단위)
      const kstDate = new Date(date.getTime() + kstOffset * 60 * 1000);

      // 변환된 시간을 `yyyy-MM-dd HH:mm:ss` 형식으로 반환
      return kstDate.toISOString().replace('T', ' ').split('.')[0];
    } catch (error) {
      console.error('Error in convertUTCToKST:', error, 'Input:', utcDate);
      return null;
    }
  };

  // 최초 페이지 렌더링 시 어르신 정보 받아오기
  // useEffect(() => {
  //   const SeniorDetail = async () => {
  //     try {
  //       const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
  //       console.log(
  //         '최초 화면 출력 시 가져오는 어르신 정보 확인 : ',
  //         response.data.member
  //       );
  //       const updateSeniorData = {
  //         ...response.data.member,
  //         memEnrollDate: convertUTCToKST(response.data.member.memEnrollDate),
  //       };

  //       calculateAge(response.data.member.memRnn.replace('-', ''));
  //       const [front, end] = response.data.member.memEmail.split('@');
  //       setEmailId(front);
  //       setDomain(end);

  //       setSeniorFormData(updateSeniorData);
  //       setInitialData(updateSeniorData);
  //       setFData(response.data.profileData);
  //       setManager(response.data.managerInfo);
  //     } catch (error) {
  //       console.error('회원 데이터 조회 실패 : ', error);
  //     }
  //   };

  //   SeniorDetail();
  // }, [UUID]);

  useEffect(() => {
    console.log('전달받은 어르신 정보 객체', senior);
    console.log('전달받은 담당자 정보 객체', manager);
    const [front, end] = senior.memEmail.split('@');
    calculateAge(senior.memRnn.replace('-', ''));
    setDomain(end);
    setEmailId(front);
    setSeniorFormData(senior);
    setFData(profileData);
  }, [senior]);

  // input 에 이메일정보(아이디부분) 입력시 저장하는 함수
  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
  };

  // input 에 이메일정보(도메인부분) 입력시 저장하는 함수
  const handleEmailDomainChange = (e) => {
    setDomain(e.target.value);
  };

  // formdata 전송 전 input 값 유효성 검사 처리용 함수
  const validate = (updatePwd) => {
    if (updatePwd) {
      // 비밀번호 일치 확인
      if (updatePwd.memPwd !== updatePwd.memPwdChk) {
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
    if (passwordRegex.test(pwd.memPwd)) {
      setPasswordValidate(true);
    } else {
      setPasswordValidate(false);
    }
    return passwordRegex.test(pwd.memPwd);
  };

  const handleCheckPassword = () => {
    if (pwd.memPwd) {
      validatePassword();
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  // 어르신 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword() && pwd.memPwd.length > 0) {
      alert('비밀번호 조건에 맞지 않습니다.');
      return;
    }

    // 전송 전에 유효성 검사 확인
    if (!validatePwd && pwd.memPwd.length > 0) {
      alert('비밀번호 일치 확인을 해주세요.');
      return;
    }

    const currentTimestamp = convertUTCToKST(new Date().toISOString());
    console.log('정보 수정 날짜 확인 : ', currentTimestamp);

    // formData 상태의 최신 값으로 FormData에 추가
    const updatedSeniorFormData = {
      ...seniorFormData, // 기존 상태 값
      memChangeStatus: currentTimestamp, // 새로운 값 추가
      mem,
    };

    // FormData 객체 생성
    const data = new FormData();

    // FormData 객체에 값 추가
    Object.entries(updatedSeniorFormData).forEach(([key, value]) => {
      if (value != '') {
        data.append(key, value);
      }
    });

    // 조건부로 주민등록번호(memRnn) 업데이트
    if (ssn.length > 1) {
      data.set('memRnn', ssn); // 변경된 값이 있으면 새로운 값으로 설정
    } else {
      data.set('memRnn', seniorFormData.memRnn); // 기존 값을 유지
    }

    // 조건부로 이메일(memEmail) 업데이트
    const newEmail = `${emailId}@${domain}`;
    if (emailId.length > 1) {
      data.set('memEmail', newEmail); // 변경된 값이 있으면 새로운 값으로 설정
    } else {
      data.set('memEmail', seniorFormData.memEmail); // 기존 값을 유지
    }
    if (fileData) {
      data.append('profile', fileData);
    }

    // 조건부 비밀번호 업데이트
    if (pwd.memPwd.length > 7) {
      data.set('memPw', pwd.memPwd);
    }

    console.log('seniorFormData 확인 : ', Array.from(data.entries())); // 실제 전송할 데이터 확인
    try {
      await apiSpringBoot.put(`/member/seniorUpdate/${UUID}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('어르신 정보 수정 성공');
      window.location.reload();
      console.log('어르신 정보 수정 성공');
    } catch (error) {
      console.error('어르신 정보 수정 실패 : ', error);
    }
  };

  // 렌더링 파트

  if (!seniorFormData) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  return (
    // <div className={styles.sdetailMainContainer}>
    <div className={styles.sdetailSubContainer}>
      {/* <div className={styles.sdetailHeader}>
        <p>어르신 관리</p>
      </div> */}
      <div className={styles.sdetailSubHeader}>
        <p>인적 사항</p>
      </div>
      {/* 어르신 인적사항(수정가능) 레이어 시작 */}
      <div className={styles.sdetailDiv}>
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className={styles.sdetailForm}
        >
          <div className={styles.sdetailTableDiv}>
            <div className={styles.sdetailProfilephoto}>
              {profile ? (
                <img
                  src={profile}
                  className={styles.sdetailProfile}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('profile').click();
                  }}
                />
              ) : (
                <img
                  src={`data:${fData.mimeType};base64,${fData.fileContent}`}
                  className={styles.sdetailProfile}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('profile').click();
                  }}
                />
              )}

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

            <table className={styles.sdetailTable}>
              <tr>
                <th>이 름</th>
                <td>
                  <input
                    name="memName"
                    value={seniorFormData.memName}
                    onChange={handleInfoChange}
                  />
                </td>
                <th style={{ fontSize: '17px', textAlign: 'center' }}>
                  주민등록번호
                </th>
                <td>
                  <input
                    name="memRnn"
                    value={seniorFormData.memRnn}
                    onChange={handleInfoChange}
                  />
                </td>
                <th>나 이</th>
                <div className={styles.sdetailTableAgeDiv}>
                  <td>
                    <input
                      style={{ width: '124px' }}
                      value={`${age}세`}
                      readOnly
                    />
                  </td>
                </div>
              </tr>
              <tr>
                <th>성 별</th>
                <td>
                  {seniorFormData.memRnn === '' ? (
                    <input />
                  ) : seniorFormData.memRnn.length > 13 ? (
                    <input
                      value={
                        seniorFormData.memRnn.split('-')[1][0] === '1' ||
                        seniorFormData.memRnn.split('-')[1][0] === '3'
                          ? '남성'
                          : '여성'
                      }
                      readOnly
                    />
                  ) : (
                    <input />
                  )}
                </td>
                <div className={styles.sdetailEmailDiv}>
                  <th>이 메 일</th>
                  <td>
                    <input
                      name="emailId"
                      style={{ width: '160px' }}
                      value={emailId}
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
                    value={
                      seniorFormData.memCellphone &&
                      /^\d{11}$/.test(seniorFormData.memCellphone)
                        ? seniorFormData.memCellphone.replace(
                            /(\d{3})(\d{4})(\d{4})/,
                            '$1-$2-$3'
                          )
                        : seniorFormData.memCellphone || ''
                    }
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
                    value={seniorFormData.memPhone}
                    name="memPhone"
                    style={{ width: '524px' }}
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
                    value={seniorFormData.memAddress}
                    onChange={handleInfoChange}
                    style={{ width: '924px' }}
                  />
                </td>
              </tr>
              <tr>
                <th>기 관</th>
                <td>
                  <input value={manager.memOrgName} readOnly />
                </td>
                <th>기 관 주 소</th>
                <td>
                  <input value={manager.memAddress} readOnly />
                </td>
                <th>담 당 자</th>
                <div className={styles.sdetailTableAgeDiv}>
                  <td>
                    <input
                      style={{ width: '120px' }}
                      value={manager.memName}
                      readOnly
                    />
                  </td>
                </div>
              </tr>
              <tr style={{ height: '40px' }}>
                <div className={styles.sdetailIdPwd}>
                  <th>아 이 디</th>
                  <td>
                    <input
                      name="memId"
                      value={seniorFormData.memId}
                      readOnly
                      style={{
                        backgroundColor: '#ddd',
                        border: '3px solid #ddd',
                      }}
                    />
                  </td>
                  <th>비 밀 번 호</th>
                  <td>
                    <input
                      type="password"
                      name="memPwd"
                      // value={pwd.memPwd}
                      onChange={(e) => {
                        handlePwdChange(e);
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
                      name="memPwdChk"
                      // value={pwd.memPwdChk}
                      onChange={handlePwdChange}
                      style={{ width: '224px' }}
                    />
                  </td>
                </div>
              </tr>
              <tr>
                <div className={styles.sdetailIdPwdChk}>
                  <th></th>
                  <td></td>
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
                    {seniorFormData.memPwChk === '' ? (
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
          <div className={styles.sdetailButtonDiv}>
            <div>
              <input
                type="reset"
                value="초 기 화"
                className={styles.sdetailButton2}
                onClick={handleReset}
              />
              <input
                type="submit"
                value="수 정"
                className={styles.sdetailButton1}
                style={{ margin: '0' }}
              />
            </div>
          </div>
        </form>
      </div>
      {/* 어르신 인적사항(수정가능) 레이어 끝 */}
    </div>
    // </div>
  );
};

export default SeniorDetailViewManager;
