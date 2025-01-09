// src/pages/member/MyInfoManager.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './MyInfoManager.module.css';
import SideBar from '../../components/common/SideBar';
import noimage from '../../assets/images/No image.png';

const MyInfoManager = () => {
  const { member, refreshToken, isLoggedIn, logout } = useContext(AuthContext);
  const [pwdChk, setPwdChk] = useState('');
  const [updateMember, setUpdateMember] = useState();
  const [isVerify, setIsVerify] = useState('none');
  const [initialData, setInitialData] = useState(null);
  const [pwdVerify, setPwdVerify] = useState({
    memPw: '',
    memPwChk: '',
  });

  // 비밀번호 유효성검사여부에 따른 메세지 상태변수
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  // 비밀번호 유효성검사여부에 따른 메세지 컬러 변경 상태변수
  const [messagePwdColor, setMessagePwdColor] = useState('');
  // 비밀번호 유효성검사여부에 따른 상태변수
  const [passwordValidate, setPasswordValidate] = useState(false);

  const navigate = useNavigate();

  const MyInfo = async () => {
    const pwdCheck = await apiSpringBoot.post(`/member/pwdCheck`, {
      memPw: pwdChk,
      memUUID: member.memUUID,
    });
    if (pwdCheck.headers['response'] === 'true') {
      try {
        const response = await apiSpringBoot.get(
          `/member/minfo/${member.memUUID}`
        );
        const verify = response.headers['response'];
        if (verify === 'success') {
          const updatedData = {
            ...response.data,
            memEnrollDate: convertUTCToKST(response.data.memEnrollDate),
          };

          setUpdateMember(updatedData);
          setInitialData(updatedData);
          setIsVerify('true');
          console.log('넘어온 member 데이터 확인 : ', response.data);
        } else if (verify === 'failed') {
          alert('내 정보 조회 실패');
        }
      } catch (error) {
        console.error('내 정보 조회 오류 발생 : ', error);
      }
    } else {
      setIsVerify('false');
    }
  };

  const handlePwdChkChange = (e) => {
    setPwdChk(e.target.value);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUpdateMember((prevUpdateMember) => ({
      ...prevUpdateMember,
      [name]: value,
    }));

    setPwdVerify((prevPwdVerify) => {
      const verify = {
        ...prevPwdVerify,
        [name]: value,
      };

      if (name === 'memPwChk') {
        validate(verify);
      }

      return verify;
    });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      const response = await apiSpringBoot.put(
        `/member/remove/${member.memId}`
      );
      const result = response.headers['response'];
      if (result === 'success') {
        if (isLoggedIn) {
          logout({ refreshToken });
          navigate('/loginmember');
          alert('회원탈퇴 성공');
        }
      } else if (result === 'failed') {
        alert('회원탈퇴 실패');
        navigate('/');
      } else {
        alert('회원 탈퇴 에러 발생(서버)');
      }
    } catch (error) {
      console.error('회원 탈퇴 에러 발생(클라이언트) : ', error);
    }
  };

  // formdata 전송 전 input 값 유효성 검사 처리용 함수
  const validate = (verify) => {
    const { memPw, memPwChk } = verify;

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
    if (passwordRegex.test(pwdVerify.memPw)) {
      setPasswordValidate(true);
    } else {
      setPasswordValidate(false);
    }
    return passwordRegex.test(pwdVerify.memPw);
  };

  const handleCheckPassword = () => {
    if (pwdVerify.memPw) {
      validatePassword();
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTimestamp = convertUTCToKST(new Date().toISOString());

    // FormData 객체 생성
    const data = new FormData();

    const newUpdateMember = {
      ...updateMember,
      memChangeStatus: currentTimestamp,
    };

    Object.entries(newUpdateMember).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await apiSpringBoot.put(`/member/update/${updateMember.memUUID}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('내 정보 수정 성공');
    } catch (error) {
      alert('내 정보 수정 실패');
      console.error('내 정보 수정중 오류 발생 : ', error);
    }
  };

  const handleTest = () => {
    navigate(`/test/${member.memUUID}`);
  };

  return (
    <div className={styles.myfoMainContainer}>
      <SideBar />
      <div className={styles.myfoSubContainer}>
        <div className={styles.myfoHeader}>
          <p>마이페이지</p>
        </div>
        <div className={styles.myfoSubHeader}>
          <p>내정보</p>
          <div className={styles.myinfoRemove}>
            {isVerify === 'true' && (
              <>
                <button onClick={handleRemove}>회원 탈퇴</button>
              </>
            )}
          </div>
        </div>
        {isVerify === 'none' ? (
          <div className={styles.myinfoPwdCheck}>
            <p>비밀번호를 입력하세요.</p>
            <input
              type="password"
              name="pwdChk"
              onChange={handlePwdChkChange}
            />
            <button onClick={MyInfo}>확 인</button>
          </div>
        ) : isVerify === 'false' ? (
          <div className={styles.myinfoFailPage}>
            <p>비밀번호가 틀립니다. 다시 입력해주세요.</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              이전으로 돌아가기
            </button>
          </div>
        ) : (
          <div className={styles.myfoDiv}>
            <div className={styles.myfoProfilephoto}>
              <img
                src={noimage}
                // style={{ width: '250px', height: '300px' }}
                className={styles.image}
              ></img>
            </div>
            <div className={styles.myfoTableDiv}>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <table className={styles.myfoTable}>
                  <tr>
                    <th>이 름</th>
                    <td>
                      <input value={updateMember.memName} readOnly />
                    </td>
                    <th>아 이 디</th>
                    <td>
                      <input value={updateMember.memId} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <th>성 별</th>
                    <td>
                      <input
                        value={
                          updateMember.memRnn.split('-')[1][0] === '1' ||
                          updateMember.memRnn.split('-')[1][0] === '3'
                            ? '남성'
                            : '여성'
                        }
                        readOnly
                      />
                    </td>
                    <th>이 메 일</th>
                    <td>
                      <input
                        value={updateMember.memEmail}
                        onChange={handleInfoChange}
                        name="memEmail"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>비 밀 번 호</th>
                    <td>
                      <input
                        type="password"
                        name="memPw"
                        onChange={(e) => {
                          handleInfoChange(e);
                          handleCheckPassword();
                        }}
                      />
                    </td>
                    <th>비 밀 번 호 확 인</th>
                    <td>
                      <input
                        type="password"
                        name="memPwChk"
                        onChange={handleInfoChange}
                      />
                    </td>
                  </tr>
                  <tr style={{ height: '20px' }}>
                    <th></th>
                    <div style={{ marginLeft: '10px' }}>
                      {!passwordValidate ? (
                        <td
                          style={{
                            marginLeft: '25px',
                            textAlign: 'left',
                            fontSize: '10px',
                            color: 'red',
                            height: '20px',
                          }}
                        >
                          영문 소문자, 숫자, 특수문자 포함 8 ~ 16자로
                          입력해주세요.
                        </td>
                      ) : (
                        <td
                          style={{
                            textAlign: 'left',
                            fontSize: '10px',
                            color: 'green',
                            height: '20px',
                          }}
                        >
                          사용가능한 비밀번호입니다.
                        </td>
                      )}
                    </div>
                    <th></th>
                    <div style={{ marginLeft: '10px' }}>
                      {pwdVerify.memPwChk === '' ? (
                        <td></td>
                      ) : (
                        <td
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
                        </td>
                      )}
                    </div>
                  </tr>
                  <tr>
                    <th>가 입 일 자</th>
                    <td>
                      <input
                        value={updateMember.memEnrollDate.split(' ')[0]}
                        readOnly
                      />
                    </td>
                    <th>계 정 상 태</th>
                    <td>
                      <input
                        value={
                          updateMember.memStatus === 'ACTIVE'
                            ? '활동'
                            : updateMember.memStatus === 'INACTIVE'
                              ? '휴면'
                              : updateMember.memStatus === 'BLOCKED'
                                ? '정지'
                                : updateMember.memStatus
                        }
                        readOnly
                        onChange={handleInfoChange}
                        name="memStatus"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>연 락 처</th>
                    <td>
                      <input
                        value={
                          updateMember.memCellphone &&
                          /^\d{11}$/.test(updateMember.memCellphone)
                            ? updateMember.memCellphone.replace(
                                /(\d{3})(\d{4})(\d{4})/,
                                '$1-$2-$3'
                              )
                            : updateMember.memCellphone || ''
                        }
                        onChange={handleInfoChange}
                        name="memCellphone"
                      />
                    </td>
                    <th>기 관 전 화 번 호</th>
                    <td>
                      <input value={updateMember.memPhone} name="memPhone" />
                    </td>
                  </tr>
                  <tr>
                    <th>기 관</th>
                    <td>
                      <input readOnly />
                    </td>
                    <th>기 관 코 드</th>
                    <td>
                      <input
                        value={updateMember.memGovCode}
                        name="memGovCode"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>주 소</th>
                    <td>
                      <input
                        name="memAddress"
                        value={updateMember.memAddress}
                        onChange={handleInfoChange}
                        style={{ width: '550px' }}
                      />
                    </td>
                  </tr>
                </table>
                <div className={styles.myfoButtonDiv}>
                  <div>
                    <button
                      className={styles.myfolButton1}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                      }}
                    >
                      이 전
                    </button>
                  </div>
                  <div>
                    <input
                      type="reset"
                      value="초 기 화"
                      className={styles.myfoButton2}
                      onClick={() => setUpdateMember(initialData)}
                    />
                    <input
                      type="submit"
                      value="수 정"
                      className={styles.myfolButton1}
                      style={{ margin: '0' }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInfoManager;
