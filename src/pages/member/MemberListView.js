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
  const [actionInfo, setActionInfo] = useState([]);
  const [isDropdown, setIsDropdown] = useState('false');
  const navigate = useNavigate();

  const [pagingInfo, setPagingInfo] = useState({
    // 스프링 부터 search를 보낼때 담을 상태훅
    pageNumber: 1,
    action: 'all',
    listCount: 1,
    maxPage: 1,
    pageSize: 10,
    startPage: 1,
    endPage: 1,
    keyword: '',
  });

  const MemberList = async (page, action) => {
    try {
      if (role === 'ADMIN') {
        const response = await apiSpringBoot.get(`/member/adminList`, {
          params: {
            ...pagingInfo,
            pageNumber: page,
            action: action,
            keywrod: pagingInfo.keyword,
          },
        });
        setMemberList(response.data);
        console.log(response.data);

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
      }
    } catch (error) {
      console.error('리스트 출력 실패 : ', error);
    }
  };

  useEffect(() => {
    MemberList(1, 'all');
  }, []);

  const handleDetailView = () => {
    navigate('/mdetailview');
  };

  const handleToggleDropdown = () => {
    if (!isDropdown) {
      setIsDropdown(true);
    } else {
      setIsDropdown(false);
    }
  };

  const handleChange = (e) => {
    // 검색 데이터 쓰면 paging훅에 저장
    const { value, name } = e.target;
    setPagingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    // select 바뀌면 검색상태 저장
    const { value } = e.target;
    setActionInfo((pre) => ({
      ...pre,
      actionType: value,
    }));
  };

  const handleSearch = () => {
    // 검색 버튼을 눌르면 출력뷰 변경
    handleQnAView(1, actionInfo.actionType);
  };

  return (
    <div className={styles.mlistviewcontainer}>
      <SideBar />
      <div className={styles.mlistviewsubcontainer}>
        <div className={styles.mlistviewheader}>
          {/* 헤더 출력 레이어 */}
          <p>계정 관리</p>
        </div>
        <div className={styles.memlistsearch}>
          {/* 검색옵션 선택 버튼 레이어 */}
          <div
            className={styles.memSearchOption}
            onClick={handleToggleDropdown}
          >
            <img src={isDropdown ? up : down} className={styles.memArrow} />{' '}
            {isDropdown && (
              <div className={styles.memSearchDropdown}>
                <div className={styles.memSearchDropdownOption}> 제목 </div>
                <div className={styles.memSearchDropdownOption}> 내용 </div>
              </div>
            )}
          </div>
          <div memlistSearchdiv>
            <input className={styles.memlistSearchBox} />
            <img className={styles.memlistSearchBtn} src={searchImag} />
          </div>
        </div>
        <div className={styles.mlisttablediv}>
          {/* 리스트 출력 레이어 */}
          <table className={styles.mlisttable}>
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
              {memberList.map((list) => (
                <tr key={list.memName} onClick={handleDetailView}>
                  <td>{list.memName}</td>
                  <td>{list.memId}</td>
                  <td>{list.memType}</td>
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
                  <td>{list.memEnrollDate.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
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

export default MemberListView;
