// src/pages/management/SeniorApporvalList.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';
import styles from './SeniorApprovalList.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import SideBar from '../../components/common/SideBar';
import { convertUTCToKST } from '../../fuction/function';

const SeniorApporvalList = () => {
  const { role, member } = useContext(AuthContext);

  const [seniorData, setSeniorData] = useState();
  const [familyData, setFamilyData] = useState();
  const navigate = useNavigate();

  const [pagingInfo, setPagingInfo] = useState({
    // 스프링 부터 search를 보낼때 담을 상태훅
    pageNumber: 1,
    action: '',
    listCount: 1,
    maxPage: 1,
    pageSize: 10,
    startPage: 1,
    endPage: 1,
    keyword: '',
  });

  useEffect(() => {
    const ApprovalList = async () => {
      try {
        if (role === 'MANAGER') {
          const response = await apiSpringBoot.get(`/member/approvalList`, {
            params: {
              memUUID: member.memUUID,
            },
          });
          const { maxPage, startPage, endPage } = PagingCalculate(
            response.data.search.pageNumber,
            response.data.search.listCount,
            response.data.search.pageSize
          );

          setPagingInfo(response.data.search);

          setPagingInfo((pre) => ({
            ...pre,
            maxPage: maxPage,
            startPage: startPage,
            endPage: endPage,
          }));

          console.log(response.data.senior[0]?.memEnrollDate); // 첫 번째 요소의 memEnrollDate
          console.log(response.data.family[0]?.memEnrollDate); // 첫 번째 요소의 memEnrollDate

          const updateSeniorList = response.data.senior.map((senior) => ({
            ...senior,
            memEnrollDate: senior.memEnrollDate
              ? convertUTCToKST(senior.memEnrollDate)
              : 'Invalid Date',
          }));

          const updateFamilyList = response.data.family.map((family) => ({
            ...family,
            memEnrollDate: family.memEnrollDate
              ? convertUTCToKST(family.memEnrollDate)
              : 'Invalid Date',
          }));
          setSeniorData(updateSeniorList);
          setFamilyData(updateFamilyList);
          console.log('업데이트 리스트 확인 : ', updateSeniorList);
          console.log('업데이트 리스트 확인 : ', updateFamilyList);
        }
      } catch (error) {
        console.error('리스트 출력 실패 : ', error);
      }
    };

    ApprovalList();
  }, []);

  // 페이지이동으로 인한 페이지 변경 시
  const handleUpdateView = async (page) => {
    console.log('검색 기능 작동확인');
    console.log(page);
    console.log(pagingInfo);
    try {
      const response = await apiSpringBoot.get(`/member/approvalList`, {
        params: {
          ...pagingInfo,
          pageNumber: page,
          memUUID: member.memUUID,
        },
      });
      setPagingInfo(
        PagingCalculate(
          page,
          response.data.search.listCount,
          response.data.search.pageSize
        )
      );
      setPagingInfo((prev) => ({
        ...prev,
        pageNumber: page,
        listCount: response.data.search.listCount,
        pageSize: response.data.search.pageSize,
      }));
      console.log(response.data.senior.memEnrollDate);
      console.log(response.data.family.memEnrollDate);
      const updateSeniorList = response.data.senior.map((senior) => ({
        ...senior,
        memEnrollDate: convertUTCToKST(senior.memEnrollDate),
      }));
      const updateFamilyList = response.data.family.map((family) => ({
        ...family,
        memEnrollDate: convertUTCToKST(family.memEnrollDate),
      }));
      setSeniorData(updateSeniorList);
      setFamilyData(updateFamilyList);
      console.log('업데이트 리스트 확인 : ', updateSeniorList);
      console.log('업데이트 리스트 확인 : ', updateFamilyList);
    } catch (error) {
      console.error('업데이트된 리스트 출력 실패 : ', error);
    }
  };

  const resetToDefaultView = () => {
    setSeniorData();
    setFamilyData();
    setPagingInfo({
      pageNumber: 1,
      action: '',
      listCount: 1,
      maxPage: 1,
      pageSize: 10,
      startPage: 1,
      endPage: 1,
      keyword: '',
    }); // 페이징 정보 초기화
    // 초기 데이터 다시 로드
    handleUpdateView(1, { action: '', keyword: '' });
  };

  const handleMoveDetail = (UUID) => {
    navigate(`/seniorlist/sdetailview/${UUID}`);
  };

  if (!seniorData || !familyData) {
    return <div>roading...</div>;
  }

  return (
    <div className={styles.alistContainer}>
      <SideBar />
      <div className={styles.alistSubContainer}>
        <div className={styles.alistviewHeader}>
          {/* 헤더 출력 레이어 */}
          <p onClick={resetToDefaultView}>계정승인 요청확인</p>
        </div>
        <div className={styles.alisttableDiv}>
          {/* 리스트 출력 레이어 */}
          <table className={styles.alistTable}>
            <thead>
              <tr style={{ cursor: 'auto' }}>
                <th>구분</th>
                <th>아이디</th>
                <th>이름</th>
                <th>어르신 성명</th>
                <th>요청날짜</th> {/* 가입날짜 */}
              </tr>
            </thead>
            <tbody>
              {seniorData.map((senior) => {
                const family = Array.isArray(familyData)
                  ? familyData.find(
                      (fam) => fam?.memUUID === senior?.memUUIDFam
                    )
                  : null;
                return (
                  <tr
                    key={senior.memUUID}
                    onClick={() => handleMoveDetail(senior.memUUID)}
                  >
                    <td>
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
                    <td>{family.memId}</td>
                    <td>{family.memName}</td>
                    <td>{senior.memName}</td>
                    <td>{family.memEnrollDate.split(' ')[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.alistPaging}>
            <Paging
              pageNumber={pagingInfo.pageNumber}
              maxPage={pagingInfo.maxPage}
              startPage={pagingInfo.startPage}
              endPage={pagingInfo.endPage}
              onPageChange={(page) => handleUpdateView(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorApporvalList;
