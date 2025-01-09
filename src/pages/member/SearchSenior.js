// src/pages/member/SearchSenior.js
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import styles from './SearchSenior.module.css';
import Paging from '../../components/common/Paging';
import { convertUTCToKST } from '../../fuction/function';

const SearchSenior = () => {
  const [seniorData, setSeniorData] = useState();
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
  // 키워드 저장
  const [tempKeyword, setTempKeyword] = useState('');
  const [search, setSearch] = useState({
    action: '전체',
    keyword: '',
  });

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
        const updateList = response.data.list.map((senior) => ({
          ...senior,
          memEnrollDate: formatDate(senior.memEnrollDate),
        }));
        setSeniorData(updateList);
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
      const updateList = response.data.list.map((senior) => ({
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
      ...search,
      keyword: tempKeyword,
    };
    setSearch(updatedSearch);
    setPagingInfo((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
    handleUpdateList(1, updatedSearch);
  };

  {
    /* 랜더링 파트 */
  }
  return (
    <>
      <div className={styles.sSearchMainContainer}>
        {/* 검색 창 레이어 */}
        <div className={styles.sSearchInputDiv}>
          <div></div>
        </div>
        {/* 리스트 출력 레이어 */}
        <div className={styles.sSearchTable}>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default SearchSenior;
