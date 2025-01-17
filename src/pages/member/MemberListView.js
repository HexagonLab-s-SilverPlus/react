// src/pages/member/MemberListView.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';
import styles from './MemberListView.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import SideBar from '../../components/common/SideBar';
import searchImag from '../../assets/images/search.png';
import up from '../../assets/images/keyboard_arrow_up.png';
import down from '../../assets/images/keyboard_arrow_down.png';

const MemberListView = () => {
  const { role } = useContext(AuthContext);

  const [memberList, setMemberList] = useState([]);
  const [isDropdown, setIsDropdown] = useState('false');
  // 키워드 저장
  const [tempKeyword, setTempKeyword] = useState('');
  const [search, setSearch] = useState({
    action: '아이디',
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
    console.log(pagingInfo);
    const MemberList = async () => {
      try {
        if (role === 'ADMIN') {
          const response = await apiSpringBoot.get(`/member/adminList`);
          console.log('search 값 확인 : ', response.data.search);
          const { maxPage, startPage, endPage } = PagingCalculate(
            response.data.search.pageNumber,
            response.data.search.listCount,
            response.data.search.pageSize
          );

          setPagingInfo(response.data.search);
          console.log(
            '계산한 값들 maxPage, startPage, endPage : ',
            maxPage,
            startPage,
            endPage
          );

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
          setMemberList(updateList);
          console.log(response.data.list);
          console.log(updateList);
          console.log('업데이트된 pagingInfo:', {
            ...response.data.search,
            maxPage,
            startPage,
            endPage,
          });
        }
      } catch (error) {
        console.error('리스트 출력 실패 : ', error);
      }
    };

    MemberList();
  }, []);

  // 검색으로 인한 페이지 변경 시
  const handleUpdateView = async (page, updatedSearch = search) => {
    console.log('검색 기능 작동확인');
    console.log(page);
    console.log(search);
    console.log(pagingInfo);
    try {
      const response = await apiSpringBoot.get(`/member/adminList`, {
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
      const updateList = response.data.list.map((member) => ({
        ...member,
        memEnrollDate: formatDate(member.memEnrollDate),
      }));
      setMemberList(updateList);
      console.log('업데이트 리스트 확인 : ', updateList);
    } catch (error) {
      console.error('업데이트된 리스트 출력 실패 : ', error);
    }
  };

  const handleDetailView = (memUUID) => {
    navigate(`/memRouter/mlistview/mdetailview/${memUUID}`);
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
    setMemberList([]); // 멤버 리스트 초기화
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

  const handleReturnList = (e) => {
    e.preventDefault();
    console.log('목록버튼 작동 확인');
    window.location.reload();
  };

  return (
    <div className={styles.mlistContainer}>
      <SideBar />
      <div className={styles.mlistSubContainer}>
        <div className={styles.mlistviewHeader}>
          {/* 헤더 출력 레이어 */}
          <p onClick={resetToDefaultView}>계정 관리</p>
        </div>
        <div className={styles.mlistrSubLine}>
          <div className={styles.mlistReturnListBtnDiv}>
            <button onClick={handleReturnList}>목 록</button>
          </div>
          <div className={styles.mlistSearchbox}>
            {/* 검색옵션 선택 버튼 레이어 */}
            <div
              className={styles.mlistSearchOptions}
              onClick={handleToggleDropdown}
            >
              &nbsp; {search.action} &nbsp;
              <img
                src={isDropdown ? down : up}
                className={styles.mlistArrow}
              />{' '}
              {!isDropdown && (
                <div className={styles.mlistDropdown}>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('아이디')}
                  >
                    &nbsp; 아이디 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('이름')}
                  >
                    &nbsp; 이름 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('계정상태')}
                  >
                    &nbsp; 계정상태 &nbsp;
                  </div>
                  <div
                    className={styles.mlistDropdownOption}
                    onClick={() => handleSelectOption('계정타입')}
                  >
                    &nbsp; 계정타입 &nbsp;
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
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
                <th className={styles.nameCol}>이름</th>
                <th className={styles.idCol}>아이디</th>
                <th className={styles.typeCol}>계정타입</th>
                <th className={styles.statusCol}>계정상태</th>
                <th className={styles.emailCol}>이메일</th>
                <th className={styles.phoneCol}>연락처</th>
                <th className={styles.dateCol}>가입일자</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((list) => (
                <tr
                  key={list.memUUID}
                  onClick={() => handleDetailView(list.memUUID)}
                >
                  <td className={styles.nameCol}>{list.memName}</td>
                  <td className={styles.idCol}>{list.memId}</td>
                  <td className={styles.typeCol}>
                    {list.memType === 'MANAGER'
                      ? '담당자'
                      : list.memType === 'FAMILY'
                        ? '가족'
                        : list.memType === 'SENIOR'
                          ? '어르신'
                          : '오류'}
                  </td>
                  <td className={styles.statusCol}>
                    {list.memStatus === 'ACTIVE'
                      ? '활동'
                      : list.memStatus === 'BLOCKED'
                        ? '정지'
                        : list.memStatus === 'INACTIVE'
                          ? '휴면'
                          : '정지'}
                  </td>
                  <td className={styles.emailCol}>{list.memEmail}</td>
                  <td className={styles.phoneCol}>
                    {/^\d{11}$/.test(list.memCellphone)
                      ? list.memCellphone.replace(
                          /(\d{3})(\d{4})(\d{4})/,
                          '$1-$2-$3'
                        )
                      : list.memCellphone || ''}
                  </td>

                  <td className={styles.dateCol}>
                    {list.memEnrollDate.split(' ')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.mlistPaging}>
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

export default MemberListView;
