// src/pages/member/MyInfoFamily.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './MyInfoFamily.module.css';
import SideBar from '../../components/common/SideBar';
import noimage from '../../assets/images/No image.png';

import kakao from '../../assets/images/icon/Kakao Icon.png';
import naver from '../../assets/images/icon/Naver Icon.png';
import google from '../../assets/images/icon/Google Icon.png';

const MyInfoFamily = () => {
  const { member } = useContext(AuthContext);
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
          setUpdateMember(response.data);
          setInitialData(response.data);
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

  // 소셜 연동 함수
  const handleSocialLink = async (e, provider) => {
    e.preventDefault();

    const requestURL = `http://localhost:8080/oauth2/authorization/${provider}?memUUID=${updateMember.memUUID}`;
    let result = null;

    // 소셜 연동/연동해제 요청
    if (provider === 'google') {
      updateMember.memSocialGoogle === 'N'
        ? (window.location.href = `${requestURL}&linking=true`)
        : (result = await apiSpringBoot.put(
            `/member/social/${updateMember.memUUID}`,
            null,
            {
              params: { provider: provider },
            }
          ));
      if (result) {
        if (result.headers['response'] === 'success') {
          alert('연동 해제 성공');
          window.location.reload();
        } else {
          alert('연동 해제 실패');
        }
      }
    }

    if (provider === 'kakao') {
      updateMember.memSocialKakao === 'N'
        ? (window.location.href = `${requestURL}&linking=true`)
        : (result = await apiSpringBoot.put(
            `/member/social/${updateMember.memUUID}`,
            null,
            {
              params: { provider: provider },
            }
          ));
      if (result) {
        if (result.headers['response'] === 'success') {
          alert('연동 해제 성공');
          window.location.reload();
        } else {
          alert('연동 해제 실패');
        }
      }
    }

    if (provider === 'naver') {
      updateMember.memSocialNaver === 'N'
        ? (window.location.href = `${requestURL}&linking=true`)
        : (result = await apiSpringBoot.put(
            `/member/social/${updateMember.memUUID}`,
            null,
            {
              params: { provider: provider },
            }
          ));
      if (result) {
        if (result.headers['response'] === 'success') {
          alert('연동 해제 성공');
          window.location.reload();
        } else {
          alert('연동 해제 실패');
        }
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTimestamp = new Date();
    console.log('memChangeStatus 에 넣을 현재시간 : ', currentTimestamp);
    const currentTimestampKST = new Date(
      currentTimestamp.getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, '');

    // FormData 객체 생성
    const data = new FormData();

    const newUpdateMember = {
      ...updateMember,
      memChangeStatus: currentTimestampKST,
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

  return (
    <div className={styles.myfoMainContainer}>
      <SideBar />
      <div className={styles.myfoSubContainer}>
        <div className={styles.myfoHeader}>
          <p>마이페이지</p>
        </div>
        <div className={styles.myfoSubHeader}>
          <p>내정보</p>
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
                  <tr>
                    {/* <th></th>
                    <td></td> */}
                    <th>소 셜 연 동</th>
                    <td>
                      <div className={styles.socialLinkDiv}>
                        <button onClick={(e) => handleSocialLink(e, 'google')}>
                          <img src={google} />
                        </button>
                        {updateMember.memSocialGoogle === 'N' ? (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'red' }}
                          >
                            close
                          </span>
                        ) : (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'green' }}
                          >
                            check_circle
                          </span>
                        )}
                        <button onClick={(e) => handleSocialLink(e, 'kakao')}>
                          <img src={kakao} />
                        </button>
                        {updateMember.memSocialKakao === 'N' ? (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'red' }}
                          >
                            close
                          </span>
                        ) : (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'green' }}
                          >
                            check_circle
                          </span>
                        )}
                        <button onClick={(e) => handleSocialLink(e, 'naver')}>
                          <img src={naver} />
                        </button>
                        {updateMember.memSocialNaver === 'N' ? (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'red' }}
                          >
                            close
                          </span>
                        ) : (
                          <span
                            class="material-symbols-outlined"
                            style={{ color: 'green' }}
                          >
                            check_circle
                          </span>
                        )}
                      </div>
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

export default MyInfoFamily;
