// src/pages/member/MemberDetailView.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import styles from './MemberDetailView.module.css';
import loading from '../../assets/images/loading.gif';

const MemberDetailView = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const { UUID } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const MemberDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/mdetail/${UUID}`);
        console.log(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('회원데이터 조회 실패 : ', error);
      }
    };
    MemberDetail();
  }, [UUID]);

  const handleReset = () => {};
  const handleInfoUpdate = () => {};
  const handleTemporaryPassword = () => {};
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
        <div className={styles.mdetailDiv}>
          <div className={styles.mdetailProfilephoto}></div>
          <div className={styles.mdetailTableDiv}>
            <form>
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
                    <input value={formData.memEmail} />
                  </td>
                </tr>
                <tr>
                  <th>가 입 일 자</th>
                  <td>
                    <input
                      value={formData.memEnrollDate.split('T')[0]}
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
                                : '탈퇴'
                        }
                        readOnly
                        style={{ width: '150px' }}
                        onChange={handleInfoChange}
                        name="memStatus"
                      />
                      <select
                        className={styles.mdetailSelect}
                        onChange={(e) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            memStatus: e.target.value,
                          }))
                        }
                      >
                        <option value="ACTIVE" selected>
                          활동
                        </option>
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
                    />
                  </td>
                </tr>
              </table>
            </form>
          </div>
        </div>
        <div className={styles.mdetailButtonDiv}>
          <div>
            <button
              className={styles.mdetailButton1}
              onClick={() => navigate(-1)}
            >
              목 록
            </button>
          </div>
          <div>
            <button
              type="reset"
              className={styles.mdetailButton2}
              onClick={handleReset}
            >
              초 기 화
            </button>
            <button
              className={styles.mdetailButton1}
              style={{ fontSize: '16px' }}
              onClick={handleTemporaryPassword(formData.memUUID)}
            >
              임시비밀번호발급
            </button>
            <button
              className={styles.mdetailButton1}
              style={{ margin: '0' }}
              onClick={handleInfoUpdate}
            >
              수 정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailView;
