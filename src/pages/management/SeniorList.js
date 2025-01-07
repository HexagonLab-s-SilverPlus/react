// src/pages/management/SeniorList.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeniorList.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import SideBar from '../../components/common/SideBar';
import searchImag from '../../assets/images/search.png';
import up from '../../assets/images/keyboard_arrow_up.png';
import down from '../../assets/images/keyboard_arrow_down.png';
import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';

const SeniorList = () => {
  const { role } = useContext(AuthContext);

  const [seniorList, setSeniorList] = useState([]);
  const [isDropdown, setIsDropdown] = useState('false');
  // 키워드 저장
  const [tempKeyword, setTempKeyword] = useState('');
  const [search, setSearch] = useState({
    action: '이름',
    keyword: '',
  });
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

  const formatDate = (w) => {
    // 데이터 포맷 (한국 표준시로 변환)
    const isoDate = w.replace(' ', 'T');
    const date = new Date(isoDate);

    // 한국 표준시 (UTC+9)로 변환
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    // 포맷팅 (yyyy-MM-dd)
    const year = kstDate.getFullYear();
    const month = String(kstDate.getMonth() + 1).padStart(2, '0');
    const day = String(kstDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const SeniorList = async () => {
      try {
        if (role === 'MANAGER') {
          const response = await apiSpringBoot.get(`/member/seniorList`);
          console.log('search 값 확인 : ', response.data.search);
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
          const updateList = response.data.list.map((member) => ({
            ...member,
            memEnrollDate: formatDate(member.memEnrollDate),
          }));
          setSeniorList(updateList);
          console.log(response.data.list);
          console.log(updateList);
        }
      } catch (error) {
        console.error('리스트 출력 실패 : ', error);
      }
    };

    SeniorList(1, 'all');
  }, []);

  const handleDetailView = (memUUID) => {
    navigate(`/mdetailview/${memUUID}`);
  };

  // 검색 옵션 드롭다운 함수
  const handleToggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  // 검색 옵션 선택 함수
  const handleSelectOption = (option) => {
    setSearch((prev) => ({
      ...prev,
      action: option,
    }));
    setIsDropdown(false);
  };

  const handleChangeKeyword = (e) => {
    setTempKeyword(e.target.value);
  };

  // 키워드 검색
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
    handleUpdateView(1, updatedSearch);
  };

  const resetToDefaultView = () => {
    setSeniorList([]); // 멤버 리스트 초기화
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
    setSearch({
      action: '아이디',
      keyword: '',
    }); // 검색 상태 초기화
    setTempKeyword(''); // 검색 키워드 초기화

    // 초기 데이터 다시 로드
    handleUpdateView(1, { action: '', keyword: '' });
  };

  return (
    <div className={styles.mlistContainer}>
      <SideBar />
      <div className={styles.mlistSubContainer}>
        <div className={styles.mlistviewHeader}>
          {/* 헤더 출력 레이어 */}
          <p onClick={resetToDefaultView}>어르신 관리</p>
        </div>
        <div className={styles.mlistrSubLine}>
          <div className={styles.mlistSearchbox}>
            {/* 검색옵션 선택 버튼 레이어 */}
            <div
              className={styles.mlistSearchOptions}
              onClick={handleToggleDropdown}
            >
              &nbsp; {search.action} &nbsp;
              <img
                src={isDropdown ? up : down}
                className={styles.mlistArrow}
              />{' '}
              {!isDropdown && (
                <div className={styles.mlistDropdown}>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('이름')}
                  >
                    &nbsp; 이름 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('성별')}
                  >
                    &nbsp; 성별 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('나이')}
                  >
                    &nbsp; 나이 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('주소')}
                  >
                    &nbsp; 주소 &nbsp;
                  </div>
                </div>
              )}
            </div>
            {/* 검색키워드 입력 레이어 */}
            <div mlistSearchKeyword>
              <input
                className={styles.mlistSearchKeywordBox}
                placeholder="검색어를 입력하세요."
                onChange={handleChangeKeyword}
                value={tempKeyword}
              />
            </div>
            <img
              className={styles.mlistSearch}
              src={searchImag}
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className={styles.mlisttableDiv}>
          {/* 리스트 출력 레이어 */}
          <table className={styles.mlistTable}>
            <thead>
              <tr style={{ cursor: 'auto' }}>
                <th>이름</th>
                <th>아이디</th>
                <th>계정타입</th>
                <th>계정상태</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>가입일자</th>
              </tr>
            </thead>
            <tbody>
              {seniorList.map((list) => (
                <tr
                  key={list.memUUID}
                  onClick={() => handleDetailView(list.memUUID)}
                >
                  <td>{list.memName}</td>
                  <td>{list.memId}</td>
                  <td>
                    {list.memType === 'MANAGER'
                      ? '담당자'
                      : list.memType === 'FAMILY'
                        ? '가족'
                        : list.memType === 'SENIOR'
                          ? '어르신'
                          : '오류'}
                  </td>
                  <td>
                    {list.memStatus === 'ACTIVE'
                      ? '활동'
                      : list.memStatus === 'BLOCKED'
                        ? '정지'
                        : list.memStatus === 'INACTIVE'
                          ? '휴면'
                          : '정지'}
                  </td>
                  <td>{list.memEmail}</td>
                  <td>{list.memCellphone}</td>
                  <td>{list.memEnrollDate.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.mlistPaging}>
            <Paging
              currentPage={pagingInfo.currentPage}
              maxPage={pagingInfo.maxPage}
              startPage={pagingInfo.startPage}
              endPage={pagingInfo.endPage}
              onPageChange={(page) => handlePageChange(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorList;
