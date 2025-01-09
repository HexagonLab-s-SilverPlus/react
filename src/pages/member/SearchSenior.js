// src/pages/member/SearchSenior.js
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import styles from './SearchSenior.module.css';
import Paging from '../../components/common/Paging';
import {
  convertUTCToKST,
  parseResidentNumber,
  calculateAge,
} from '../../fuction/function';
import searchImag from '../../assets/images/search.png';

const SearchSenior = ({ onSelectMultiple }) => {
  const [seniorData, setSeniorData] = useState();
  const [familyData, setFamilyData] = useState();
  const [pagingInfo, setPagingInfo] = useState({
    // 스프링 부터 search를 보낼때 담을 상태훅
    pageNumber: 1,
    action: '',
    listCount: 1,
    maxPage: 1,
    pageSize: 7,
    startPage: 1,
    endPage: 1,
    keyword: '',
  });
  // 키워드 저장
  const [tempKeyword, setTempKeyword] = useState('');
  const [search, setSearch] = useState({
    action: '전체',
    keyword: '',
  });

  const [isSearch, setIsSearch] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]); // 선택된 데이터 관리
  const [relationships, setRelationships] = useState({}); // 관계 데이터 관리

  // 어르신 선택 함수
  const toggleRowSelection = (senior, isDisabled) => {
    if (isDisabled) return; // 가족 계정이 있는 경우 선택 불가

    setSelectedRows((prevSelected) => {
      // 이미 선택된 데이터인지 확인
      if (prevSelected.some((item) => item.memUUID === senior.memUUID)) {
        // 선택 해제: 배열에서 제거
        return prevSelected.filter((item) => item.memUUID !== senior.memUUID);
      } else {
        // 선택 추가
        return [...prevSelected, senior];
      }
    });
  };

  // 관계 설정 핸들러
  const handleRelationshipChange = (memUUID, relationship) => {
    setRelationships((prev) => ({
      ...prev,
      [memUUID]: relationship, // 어르신 ID를 키로, 관계를 값으로 저장
    }));
  };

  // 페이지 랜더링 시 출력할 리스트
  useEffect(() => {
    const Search = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/fsSearch`);
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
        const updateList = response.data.senior.map((senior) => ({
          ...senior,
          memEnrollDate: convertUTCToKST(senior.memEnrollDate),
        }));
        setSeniorData(updateList);
        setFamilyData(response.data.family);
        console.log('서버에서 가져온 어르신 데이터 : ', response.data.senior);
        console.log('서버에서 가져온 가족 데이터 : ', response.data.family);
      } catch (error) {
        console.error('리스트 출력 실패 : ', error);
      }
    };
    Search(1, '전체');
  }, []);

  // 검색 시 출력할 리스트
  const handleUpdateList = async (page, updatedSearch) => {
    try {
      const response = await apiSpringBoot.get(`/member/fsSearch`, {
        params: {
          ...pagingInfo,
          pageNumber: page,
          ...updatedSearch,
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
      const updateList = response.data.senior.map((senior) => ({
        ...senior,
        memEnrollDate: convertUTCToKST(senior.memEnrollDate),
      }));
      setSeniorData(updateList);
    } catch (error) {
      console.error('검색한 리스트 출력 실패 : ', error);
    }
  };

  // 키워드 변경 함수
  const handleSearch = () => {
    const updatedSearch = {
      action: '이름',
      keyword: tempKeyword,
    };
    setSearch(updatedSearch);
    setPagingInfo((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
    setIsSearch(true);
    handleUpdateList(1, updatedSearch);
  };

  const handleChangeKeyword = (e) => {
    setTempKeyword(e.target.value);
  };

  if (!seniorData || !familyData) {
    return <div>loading...</div>;
  }

  return (
    <>
      {/* 랜더링 파트 */}
      <div className={styles.sSearchMainContainer}>
        {/* 검색 창 레이어 */}
        <div className={styles.sSearchDiv}>
          <input
            placeholder="이름으로 검색해주세요."
            onChange={handleChangeKeyword}
            value={tempKeyword}
          />
          <img
            className={styles.sSearchIcon}
            src={searchImag}
            onClick={handleSearch}
          />
        </div>
        {/* 리스트 출력 레이어 */}
        {isSearch && (
          <div className={styles.sSearchTableDiv}>
            <table className={styles.sSearchTable}>
              <thead>
                <tr>
                  <th className={styles.select}></th>
                  <th className={styles.name}>이름</th>
                  <th className={styles.gender}>성별</th>
                  <th className={styles.birthdate}>생년월일(나이)</th>
                  <th className={styles.famid}>가족계정</th>
                  <th className={styles.approval}>계정승인여부</th>
                  <th className={styles.relationship}>
                    <button
                      onClick={() =>
                        onSelectMultiple(
                          selectedRows.map((senior) => ({
                            ...senior,
                            relationship: relationships[senior.memUUID] || '', // 관계 설정 정보 추가
                          }))
                        )
                      }
                      className={styles.sSearchSelect}
                    >
                      선택완료
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {seniorData.map((senior) => {
                  const family = Array.isArray(familyData)
                    ? familyData.find(
                        (fam) => fam?.memUUID === senior?.memUUIDFam
                      )
                    : null; // familyData 배열 검증
                  const isDisabled = family && family.memId !== 'N/A';
                  return (
                    <tr
                      key={senior.memUUID}
                      onClick={() => toggleRowSelection(senior, isDisabled)}
                      style={{
                        backgroundColor: selectedRows.some(
                          (item) => item.memUUID === senior.memUUID
                        )
                          ? '#d3f8d3'
                          : 'white', // 선택된 행 색상 변경
                        pointerEvents: isDisabled ? 'none' : 'auto', // 클릭 방지
                        opacity: isDisabled ? 0.5 : 1, // 비활성화된 항목 흐리게
                      }}
                    >
                      <td className={styles.select}>
                        <input
                          type="checkbox"
                          checked={selectedRows.some(
                            (item) => item.memUUID === senior.memUUID
                          )}
                          readOnly
                        />
                      </td>
                      <td className={styles.name}>{senior.memName}</td>
                      <td className={styles.gender}>
                        {parseResidentNumber(senior.memRnn).gender}
                      </td>
                      <td className={styles.birthdate}>
                        {parseResidentNumber(senior.memRnn).birthDate}&nbsp;
                        <br />({calculateAge(senior.memRnn)}세)
                      </td>
                      <td className={styles.famid}>
                        {family?.memId || '없음'}
                      </td>
                      <td className={styles.approval}>
                        {senior?.memFamilyApproval || ''}
                      </td>
                      <td className={styles.relationship}>
                        <select
                          onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                          onChange={(e) =>
                            handleRelationshipChange(
                              senior.memUUID,
                              e.target.value
                            )
                          }
                          value={relationships[senior.memUUID] || ''}
                          disabled={
                            !selectedRows.some(
                              (item) => item.memUUID === senior.memUUID
                            )
                          }
                        >
                          <option value="">관계 선택</option>
                          <option value="자녀">자녀</option>
                          <option value="형제자매">형제자매</option>
                          <option value="배우자">배우자</option>
                          <option value="며느리">며느리</option>
                          <option value="사위">사위</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.sSearchPaging}>
              <Paging
                pageNumber={pagingInfo.pageNumber}
                maxPage={pagingInfo.maxPage}
                startPage={pagingInfo.startPage}
                endPage={pagingInfo.endPage}
                onPageChange={(page) => handleUpdateList(page)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchSenior;
