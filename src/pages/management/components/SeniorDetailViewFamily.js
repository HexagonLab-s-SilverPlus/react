// src/pages/management/SeniorDetailViewFamily.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SeniorDetailViewManager.module.css';
import { AuthContext } from '../../../AuthProvider';
import { apiSpringBoot } from '../../../utils/axios';
import loading from '../../../assets/images/loading.gif';

const SeniorDetailViewFamily = ({ UUID }) => {
  const { member } = useContext(AuthContext);
  //   const { UUID } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [fileData, setFileData] = useState();
  //   const { UUID } = useParams();
  const [seniorFormData, setSeniorFormData] = useState();
  const [initialData, setInitialData] = useState(null); // 초기 데이터를 저장할 상태

  // 담당자 정보 객체 저장 상태변수
  const [manager, setManager] = useState();

  // 전송 온 파일데이터 저장 상태변수
  const [fData, setFData] = useState([]);

  // 나이 데이터 저장 상태변수
  const [age, setAge] = useState('');

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
  useEffect(() => {
    const SeniorDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
        console.log(
          '최초 화면 출력 시 가져오는 어르신 정보 확인 : ',
          response.data.member
        );
        const updateSeniorData = {
          ...response.data.member,
          memEnrollDate: convertUTCToKST(response.data.member.memEnrollDate),
        };

        calculateAge(response.data.member.memRnn.replace('-', ''));
        const [front, end] = response.data.member.memEmail.split('@');
        setEmailId(front);
        setDomain(end);

        setSeniorFormData(updateSeniorData);
        setInitialData(updateSeniorData);
        setFData(response.data.profileData);
        setManager(response.data.managerInfo);
      } catch (error) {
        console.error('회원 데이터 조회 실패 : ', error);
      }
    };

    SeniorDetail();
  }, [UUID]);

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
    <div className={styles.sdetailMainContainer}>
      <div className={styles.sdetailSubContainer}>
        <div className={styles.sdetailHeader}>
          <p>어르신 관리</p>
        </div>
        <div className={styles.sdetailSubHeader}>
          <p>인적 사항</p>
        </div>
        {/* 어르신 인적사항(수정가능) 레이어 시작 */}
        <div className={styles.sdetailDiv}>
          <form encType="multipart/form-data" className={styles.sdetailForm}>
            <div className={styles.sdetailTableDiv}>
              <div className={styles.sdetailProfilephoto}>
                <img
                  src={`data:${fData.mimeType};base64,${fData.fileContent}`}
                  className={styles.sdetailProfile}
                />
              </div>

              <table className={styles.sdetailTable}>
                <tr>
                  <th>이 름</th>
                  <td>
                    <input
                      name="memName"
                      value={seniorFormData.memName}
                      disabled
                    />
                  </td>
                  <th style={{ fontSize: '17px', textAlign: 'center' }}>
                    주민등록번호
                  </th>
                  <td>
                    <input
                      name="memRnn"
                      value={seniorFormData.memRnn}
                      disabled
                    />
                  </td>
                  <th>나 이</th>
                  <div className={styles.sdetailTableAgeDiv}>
                    <td>
                      <input
                        style={{ width: '100px' }}
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
                        disabled
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
                        disabled
                      />
                      <span style={{ margin: '0 10px' }}>@</span>

                      <input
                        name="domain"
                        style={{ width: '160px', margin: 0 }}
                        value={domain}
                        disabled
                      />
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
                      disabled
                      name="memCellphone"
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
                      style={{ width: '500px' }}
                      disabled
                      type="tel"
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
                      style={{ width: '900px' }}
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <th>기 관</th>
                  <td>
                    <input value={manager.memOrgName} disabled />
                  </td>
                  <th>기 관 주 소</th>
                  <td>
                    <input value={manager.memAddress} disabled />
                  </td>
                  <th>담 당 자</th>
                  <div className={styles.sdetailTableAgeDiv}>
                    <td>
                      <input
                        style={{ width: '100px' }}
                        value={manager.memName}
                        readOnly
                      />
                    </td>
                  </div>
                </tr>
              </table>
            </div>
          </form>
        </div>
        {/* 어르신 인적사항 레이어 끝 */}
      </div>
    </div>
  );
};

export default SeniorDetailViewFamily;
