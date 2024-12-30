// src/pages/member/MemberDetailView.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import styles from './MemberDetailView.module.css';
import loading from '../../assets/images/loading.gif';
import noimage from '../../assets/images/No image.png';

const MemberDetailView = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const { UUID } = useParams();
  const [formData, setFormData] = useState();
  const [initialData, setInitialData] = useState(null); // 초기 데이터를 저장할 상태

  useEffect(() => {
    const MemberDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/mdetail/${UUID}`);
        console.log('최초 화면출력시 가져오는 데이터 : ', response.data);
        setFormData(response.data);
        setInitialData(response.data);
      } catch (error) {
        console.error('회원데이터 조회 실패 : ', error);
      }
    };
    MemberDetail();
  }, [UUID]);

  // 임시비밀번호 발급 함수
  const handleTemporaryPassword = () => {};

  // formData 값 변경 함수수
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTimestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, ''); // ISO 8601 형식의 현재 시간
    console.log('memChangeStatus 에 넣을 현재시간 : ', currentTimestamp);

    // FormData 객체 생성
    const data = new FormData();

    // formData 상태의 최신 값으로 FormData에 추가
    const updatedFormData = {
      ...formData, // 기존 상태 값
      memChangeStatus: currentTimestamp, // 새로운 값 추가
    };

    // FormData 객체에 값 추가
    Object.entries(updatedFormData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // const data = new FormData();
    // Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    // const currentTimestamp = new Date().toISOString(); // ISO 8601 형식의 현재 시간
    // data.append('memChangeStatus', currentTimestamp);

    console.log('formData 확인 : ', formData); // 여전히 이전 상태 출력 가능 (비동기 특성)
    console.log('FormData 확인 : ', Array.from(data.entries())); // 실제 전송할 데이터 확인
    try {
      await apiSpringBoot.put(`/member/update/${formData.memUUID}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('회원정보 수정 성공');
      console.log('정보 수정 성공');
    } catch (error) {
      console.error('회원정보수정 실패 : ', error);
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
          <p>계정 관리</p>
        </div>
        <div className={styles.mdetailSubHeader}>
          <p>계정 정보</p>
        </div>
        {formData.memType === 'MANAGER' ? (
          <div className={styles.mdetailDiv}>
            <div className={styles.mdetailProfilephoto}>
              <img
                src={noimage}
                // style={{ width: '250px', height: '300px' }}
                className={styles.image}
              ></img>
            </div>
            <div className={styles.mdetailTableDiv}>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <table className={styles.mdetailTable}>
                  <tr>
                    <th>이 름</th>
                    <td>
                      <input value={formData.memName} readOnly />
                    </td>
                    <th>아 이 디</th>
                    <td>
                      <input value={formData.memId} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <th>성 별</th>
                    <td>
                      <input
                        value={
                          formData.memRnn.split('-')[1][0] === '1' ||
                          formData.memRnn.split('-')[1][0] === '3'
                            ? '남성'
                            : '여성'
                        }
                        readOnly
                      />
                    </td>
                    <th>이 메 일</th>
                    <td>
                      <input
                        value={formData.memEmail}
                        onChange={handleInfoChange}
                        name="memEmail"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>가 입 일 자</th>
                    <td>
                      <input
                        value={formData.memEnrollDate.split(' ')[0]}
                        readOnly
                      />
                    </td>
                    <th>계 정 상 태</th>
                    <td>
                      <div className={styles.mdetailSelectDiv}>
                        <input
                          value={
                            formData.memStatus === 'ACTIVE'
                              ? '활동'
                              : formData.memStatus === 'INACTIVE'
                                ? '휴면'
                                : formData.memStatus === 'BLOCKED'
                                  ? '정지'
                                  : formData.memStatus
                          }
                          readOnly
                          style={{ width: '150px' }}
                          onChange={handleInfoChange}
                          name="memStatus"
                        />
                        <select
                          className={styles.mdetailSelect}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              memStatus:
                                newValue === '선택'
                                  ? prevFormData.memStatus
                                  : newValue,
                            }));
                          }}
                        >
                          <option selected>선택</option>
                          <option value="ACTIVE">활동</option>
                          <option value="INACTIVE">휴면</option>
                          <option value="BLOCKED">정지</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>연 락 처</th>
                    <td>
                      <input
                        value={
                          formData.memCellphone &&
                          /^\d{11}$/.test(formData.memCellphone)
                            ? formData.memCellphone.replace(
                                /(\d{3})(\d{4})(\d{4})/,
                                '$1-$2-$3'
                              )
                            : formData.memCellphone || ''
                        }
                        onChange={handleInfoChange}
                        name="memCellphone"
                      />
                    </td>
                    <th>기 관 전 화 번 호</th>
                    <td>
                      <input value={formData.memPhone} name="memPhone" />
                    </td>
                  </tr>
                  <tr>
                    <th>기 관</th>
                    <td>
                      <input readOnly />
                    </td>
                    <th>기 관 코 드</th>
                    <td>
                      <input value={formData.memGovCode} name="memGovCode" />
                    </td>
                  </tr>
                  <tr>
                    <th>주 소</th>
                    <td>
                      <input
                        name="memAddress"
                        value={formData.memAddress}
                        onChange={handleInfoChange}
                        style={{ width: '550px' }}
                        readOnly
                      />
                    </td>
                  </tr>
                </table>
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
                    <button
                      className={styles.mdetailButton1}
                      style={{ fontSize: '16px' }}
                      onClick={handleTemporaryPassword(formData.memUUID)}
                    >
                      임시비밀번호발급
                    </button>
                    <input
                      type="submit"
                      value="수 정"
                      className={styles.mdetailButton1}
                      style={{ margin: '0' }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className={styles.mdetailDiv}>
            <div className={styles.mdetailProfilephoto}></div>
            <div className={styles.mdetailTableDiv}>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <table className={styles.mdetailTable}>
                  <tr>
                    <th>이 름</th>
                    <td>
                      <input value={formData.memName} readOnly />
                    </td>
                    <th>아 이 디</th>
                    <td>
                      <input value={formData.memId} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <th>성 별</th>
                    <td>
                      <input
                        value={
                          formData.memRnn.split('-')[1][0] === '1' ||
                          formData.memRnn.split('-')[1][0] === '3'
                            ? '남성'
                            : '여성'
                        }
                        readOnly
                      />
                    </td>
                    <th>이 메 일</th>
                    <td>
                      <input
                        value={formData.memEmail}
                        onChange={handleInfoChange}
                        name="memEmail"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>가 입 일 자</th>
                    <td>
                      <input
                        value={formData.memEnrollDate.split(' ')[0]}
                        readOnly
                      />
                    </td>
                    <th>계 정 상 태</th>
                    <td>
                      <div className={styles.mdetailSelectDiv}>
                        <input
                          value={
                            formData.memStatus === 'ACTIVE'
                              ? '활동'
                              : formData.memStatus === 'INACTIVE'
                                ? '휴면'
                                : formData.memStatus === 'BLOCKED'
                                  ? '정지'
                                  : formData.memStatus
                          }
                          readOnly
                          style={{ width: '150px' }}
                          onChange={handleInfoChange}
                          name="memStatus"
                        />
                        <select
                          className={styles.mdetailSelect}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              memStatus:
                                newValue === '선택'
                                  ? prevFormData.memStatus
                                  : newValue,
                            }));
                          }}
                        >
                          <option selected>선택</option>
                          <option value="ACTIVE">활동</option>
                          <option value="INACTIVE">휴면</option>
                          <option value="BLOCKED">정지</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>연 락 처</th>
                    <td>
                      <input
                        value={
                          formData.memCellphone &&
                          /^\d{11}$/.test(formData.memCellphone)
                            ? formData.memCellphone.replace(
                                /(\d{3})(\d{4})(\d{4})/,
                                '$1-$2-$3'
                              )
                            : formData.memCellphone || ''
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
                        value={formData.memAddress}
                        onChange={handleInfoChange}
                        style={{ width: '550px' }}
                      />
                    </td>
                  </tr>
                </table>
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
                    <button
                      className={styles.mdetailButton1}
                      style={{ fontSize: '16px' }}
                      onClick={handleTemporaryPassword(formData.memUUID)}
                    >
                      임시비밀번호발급
                    </button>
                    <input
                      type="submit"
                      value="수 정"
                      className={styles.mdetailButton1}
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

export default MemberDetailView;
