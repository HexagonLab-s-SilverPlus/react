// src/pages/management/SeniorDetailViewFamilyApproval.js
import React, { useContext, useEffect, useState } from 'react';
import styles from './SeniorDetailViewFamilyApproval.module.css';
import loading from '../../../assets/images/loading.gif';
import { apiSpringBoot } from '../../../utils/axios';
import { parseResidentNumber } from '../../../fuction/function';

const SeniorDetailViewFamilyApproval = ({ UUID, family, senior }) => {
  const [isApproval, setIsApproval] = useState(false);
  const [statusD, setStatusD] = useState('');
  const [fileList, setFileList] = useState([]); // 파일 목록 상태
  const [showFileList, setShowFileList] = useState(false); // 파일 목록 표시 상태

  useEffect(() => {
    console.log('전달받은 가족 정보', family);
  }, [UUID]);

  // 가족계정 회원가입시 첨부한 파일 목록 출력 핸들러
  const handleFileList = async () => {
    if (fileList.length > 0) {
      setShowFileList((prev) => !prev);
      return;
    }

    if (!showFileList) {
      try {
        const response = await apiSpringBoot.get(
          `/member/fflist/${family.memUUID}`
        );
        setFileList(response.data.list);
        setShowFileList(true);
        console.log('출력한 파일 데이터 확인 : ', response.data.list);
      } catch (error) {
        console.error('파일목록 가져오기 실패 ', error);
        alert('파일목록 가져오기 실패');
      }
    } else {
      setShowFileList(false);
    }
  };

  // 파일 다운로드 핸들러
  const FileDown = async (oFileName, rFileName) => {
    try {
      const response = await apiSpringBoot.get(`/member/fdown`, {
        params: { oFileName, rFileName },
        responseType: 'blob',
      });

      console.log('다운로드 응답 데이터:', response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', oFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('다운로드 에러 발생', error);
      alert('파일 다운로드 실패');
    }
  };

  // 가족계정 승인/반려 핸들러
  const handleApproval = async (e) => {
    const status = e.target.value;
    if (status === '승인') {
      const approvalConfirm = window.confirm('승인하시겠습니까?');
      if (approvalConfirm) {
        setStatusD(status);
        console.log(status);
        await apiSpringBoot.put(`member/approval/${UUID}`, null, {
          params: { status: status },
        });
        status === '승인' ? setIsApproval(true) : setIsApproval(false);
        status === '승인' ? alert('승인완료') : alert('반려완료');
        window.location.reload();
      } else {
        return;
      }
    } else {
      const approvalConfirm = window.confirm('반려하시겠습니까?');
      if (approvalConfirm) {
        setStatusD(status);
        console.log(status);
        await apiSpringBoot.put(`member/approval/${UUID}`, null, {
          params: { status: status },
        });
        status === '승인' ? setIsApproval(true) : setIsApproval(false);
        status === '승인' ? alert('승인완료') : alert('반려완료');
        window.location.reload();
      } else {
        return;
      }
    }
  };

  if (!UUID) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  return (
    <>
      {family && (
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
                    <td className={styles.separateCol}>
                      {senior.memSenFamRelationship === 'child'
                        ? '자녀'
                        : senior.memSenFamRelationship === 'brosis'
                          ? '형제'
                          : senior.memSenFamRelationship === 'partner'
                            ? '배우자'
                            : senior.memSenFamRelationship === 'bride'
                              ? '며느리'
                              : senior.memSenFamRelationship === 'groom'
                                ? '사위'
                                : ''}
                    </td>
                    <td className={styles.genderCol}>
                      {parseResidentNumber(family.memRnn).gender}
                    </td>
                    <td className={styles.nameCol}>{family.memName}</td>
                    <td className={styles.addressCol}>{family.memAddress}</td>
                    <td className={styles.idCol}>{family.memId}</td>
                    <td className={styles.fileCol}>
                      <button onClick={handleFileList}>다운로드</button>
                    </td>
                    <td className={styles.approvalCol}>
                      {senior.memFamilyApproval === 'PENDING' ? (
                        <>
                          {!isApproval ? (
                            <>
                              <button
                                value="승인"
                                onClick={(e) => handleApproval(e)}
                                className={styles.approvalBtn}
                              >
                                승 인
                              </button>
                              <button
                                value="반려"
                                onClick={(e) => handleApproval(e)}
                                className={styles.rejectlBtn}
                              >
                                반 려
                              </button>
                            </>
                          ) : statusD === '승인' ? (
                            '승인완료'
                          ) : (
                            '반려완료'
                          )}
                        </>
                      ) : senior.memFamilyApproval === 'REJECTED' ? (
                        '반려'
                      ) : senior.memFamilyApproval === 'APPROVED' ? (
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
            {/* 파일 목록 드롭다운 - 표 밖 */}
            {showFileList && (
              <div className={styles.dropdownContainer}>
                <h3>첨부 파일 목록</h3>
                <ul className={styles.dropdownMenu}>
                  {fileList.map((file, index) => (
                    <li
                      key={index}
                      className={styles.dropdownItem}
                      onClick={() => {
                        FileDown(file.mfOriginalName, file.mfRename);
                      }}
                    >
                      {file.mfOriginalName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SeniorDetailViewFamilyApproval;
