// src/pages/management/SeniorDetailViewFamilyApproval.js
import React, { useContext, useEffect, useState } from 'react';
import styles from './SeniorDetailViewFamilyApproval.module.css';
import loading from '../../../assets/images/loading.gif';
import { apiSpringBoot } from '../../../utils/axios';

const SeniorDetailViewFamilyApproval = ({ UUID, family }) => {
  const [isApproval, setIsApproval] = useState(false);
  const [statusD, setStatusD] = useState('');
  // 가족 정보 객체 저장 상태변수
  //   const [family, setFamily] = useState();

  //   // 최초 페이지 렌더링 시 어르신 정보 받아오기
  //   useEffect(() => {
  //     const SeniorDetail = async () => {
  //       try {
  //         const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
  //         setFamily(response.data.familyInfo);
  //       } catch (error) {
  //         console.error('회원 데이터 조회 실패 : ', error);
  //       }
  //     };

  //     SeniorDetail();
  //   }, [UUID]);

  // 렌더링 파트
  useEffect(() => {
    console.log('전달받은 가족 정보', family);
  }, [family]);

  if (!family) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  const handleApproval = async (e) => {
    const status = e.target.value;
    setStatusD(status);
    console.log(status);
    await apiSpringBoot.put(`member/approval/${family.memUUID}`, null, {
      params: { status: status },
    });
    status === '승인' ? setIsApproval(true) : setIsApproval(false);
    status === '승인' ? alert('승인완료') : alert('반려완료');
  };

  return (
    <div className={styles.sdvfaMainContainer}>
      <div className={styles.sdvfaSubContainer}>
        <div className={styles.sdvfaHeader}>
          <p>가족계정승인</p>
        </div>
        {/* 가족계정승인 레이어 시작 */}
        <div className={styles.sdvfaTableDiv}>
          <table className={styles.sdvfaTable}>
            <thead>
              <tr>
                <th className={styles.separateCol}>구분</th>
                <th className={styles.genderCol}>성별</th>
                <th className={styles.nameCol}>성명</th>
                <th className={styles.addressCol}>주소</th>
                <th className={styles.idCol}>가족계정</th>
                <th className={styles.fileCol}>파일</th>
                <th className={styles.approvalCol}>승인여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.separateCol}>자녀</td>
                <td className={styles.genderCol}>남자</td>
                <td className={styles.nameCol}>{family.memName}</td>
                <td className={styles.addressCol}>{family.memAddress}</td>
                <td className={styles.idCol}>{family.memId}</td>
                <td className={styles.fileCol}>다운로드</td>
                <td className={styles.approvalCol}>
                  {family.memFamilyApproval === 'PENDING' ? (
                    <>
                      {!isApproval ? (
                        <>
                          <button
                            value="승인"
                            onClick={(e) => handleApproval(e)}
                            className={styles.approvalBtn}
                          >
                            승인
                          </button>
                          <button
                            value="반려"
                            onClick={(e) => handleApproval(e)}
                            className={styles.rejectlBtn}
                          >
                            반려
                          </button>
                        </>
                      ) : statusD === '승인' ? (
                        '승인완료'
                      ) : (
                        '반려완료'
                      )}
                    </>
                  ) : family.memFamilyApproval === 'REJECTED' ? (
                    '반려'
                  ) : family.memFamilyApproval === 'APPROVED' ? (
                    '승인'
                  ) : (
                    '오류발생'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 가족계정승인 레이어 끝 */}
      </div>
    </div>
  );
};

export default SeniorDetailViewFamilyApproval;
