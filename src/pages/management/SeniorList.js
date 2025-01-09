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
    action: '전체',
    keyword: '',
  });
  // 성별 선택 저장 상태변수
  const [genderData, setGenderData] = useState('남성');
  // 나이 선택 저장 상태변수
  const [age, setAge] = useState('60');

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

  // 주민등록번호로 성별과 생년월일 파싱 함수
  const parseResidentNumber = (residentNumber) => {
    if (
      !residentNumber ||
      residentNumber.length !== 14 ||
      residentNumber[6] !== '-'
    ) {
      console.error('Invalid resident number format:', residentNumber);
      return null;
    }

    const birthYearPrefix =
      residentNumber[7] === '1' || residentNumber[7] === '2' ? '19' : '20';
    const year = birthYearPrefix + residentNumber.substring(0, 2);
    const month = residentNumber.substring(2, 4);
    const day = residentNumber.substring(4, 6);

    const gender =
      residentNumber[7] === '1' || residentNumber[7] === '3' ? '남성' : '여성';

    return {
      birthDate: `${year}/${month}/${day}`,
      gender: gender,
    };
  };

  // 최초 페이지 로딩 시 전체 리스트 출력
  useEffect(() => {
    const SeniorList = async () => {
      try {
        if (role === 'MANAGER' || role === 'FAMILY') {
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
          const updatedList = response.data.list.map((member) => {
            const parseAge = calculateAge(member.memRnn);
            const parsedData = parseResidentNumber(member.memRnn);
            return {
              ...member,
              birthDate: parsedData
                ? `${parsedData.birthDate} (${parseAge}세)`
                : '정보 없음',
              gender: parsedData ? parsedData.gender : '정보 없음',
            };
          });
          setSeniorList(updatedList);
          console.log(response.data.list);
          console.log(updatedList);
        }
      } catch (error) {
        console.error('리스트 출력 실패 : ', error);
      }
    };

    SeniorList(1, 'all');
  }, []);

  // 어르신 상세보기 이동 핸들러
  const handleDetailView = (UUID) => {
    navigate(`/seniorlist/sdetailview/${UUID}`);
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

  // 키워드 입력시 저장되는 함수
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

  // 성별 선택 작동함수(검색용)
  const selectGender = (e) => {
    setGenderData(e.target.value);
    const genderD = e.target.value;
    console.log('밸류값 저장 확인 : ', genderD);
    setTempKeyword(genderD);
    console.log('성별 키워드 저장되는지 확인 : ', tempKeyword);
  };

  // 나이 선택 작동함수(검색용)
  const selectAge = (e) => {
    setAge(e.target.value);
    const ageD = e.target.value;
    setTempKeyword(ageD);
  };

  // 주민등록번호 정보를 이용한 나이 계산함수
  const calculateAge = (ssn) => {
    // if (!ssn || ssn.length !== 13) {
    //   alert('주민등록번호를 정확히 입력해주세요.');
    //   return;
    // }

    const today = new Date();
    const currentYear = today.getFullYear();
    const yearPrefix = parseInt(ssn[7], 10) < 3 ? 1900 : 2000; // 1, 2는 1900년대, 3, 4는 2000년대
    const birthYear = yearPrefix + parseInt(ssn.slice(0, 2), 10);
    const birthMonth = parseInt(ssn.slice(2, 4), 10);
    const birthDay = parseInt(ssn.slice(4, 6), 10);

    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let calculatedAge = currentYear - birthYear;

    // 생일이 지났는지 확인
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      calculatedAge -= 1;
    }

    return calculatedAge;
  };

  // 어르신관리 클릭 시 전체 리스트로 초기화 시키는 함수
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
      action: '전체',
      keyword: '',
    }); // 검색 상태 초기화
    setTempKeyword(''); // 검색 키워드 초기화

    // 초기 데이터 다시 로드
    handleUpdateView(1, { action: '', keyword: '' });
  };

  // 검색으로 인한 페이지 변경 시
  const handleUpdateView = async (page, updatedSearch) => {
    console.log('검색 기능 작동확인');
    try {
      const response = await apiSpringBoot.get(`/member/seniorList`, {
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
      const updatedList = response.data.list.map((member) => {
        const parseAge = calculateAge(member.memRnn);
        const parsedData = parseResidentNumber(member.memRnn);
        return {
          ...member,
          birthDate: parsedData
            ? `${parsedData.birthDate} (${parseAge}세)`
            : '정보 없음',
          gender: parsedData ? parsedData.gender : '정보 없음',
        };
      });
      setSeniorList(updatedList);
      console.log('업데이트 리스트 확인 : ', updatedList);
    } catch (error) {
      console.error('업데이트된 리스트 출력 실패 : ', error);
    }
  };

  return (
    <div className={styles.slistContainer}>
      <SideBar />
      <div className={styles.slistSubContainer}>
        <div className={styles.slistviewHeader}>
          {/* 헤더 출력 레이어 */}
          <p onClick={resetToDefaultView}>어르신 관리</p>
        </div>
        <div className={styles.slistrSubLine}>
          <div className={styles.slistSearchbox}>
            {/* 검색옵션 선택 버튼 레이어 */}
            <div
              className={styles.slistSearchOptions}
              onClick={handleToggleDropdown}
            >
              &nbsp; {search.action} &nbsp;
              <img
                src={isDropdown ? up : down}
                className={styles.slistArrow}
              />{' '}
              {!isDropdown && (
                <div className={styles.slistDropdown}>
                  <div
                    className={styles.slistDropdownOption}
                    onClick={() => {
                      handleSelectOption('전체');
                      resetToDefaultView();
                    }}
                  >
                    &nbsp; 전체 &nbsp;
                  </div>
                  <div
                    className={styles.slistDropdownOption}
                    onClick={() => {
                      handleSelectOption('이름');
                      setTempKeyword('');
                    }}
                  >
                    &nbsp; 이름 &nbsp;
                  </div>
                  <div
                    className={styles.slistDropdownOption}
                    onClick={() => {
                      handleSelectOption('성별');
                      setTempKeyword('남성');
                    }}
                  >
                    &nbsp; 성별 &nbsp;
                  </div>
                  <div
                    className={styles.slistDropdownOption}
                    onClick={() => {
                      handleSelectOption('나이');
                      setTempKeyword('60');
                    }}
                  >
                    &nbsp; 나이 &nbsp;
                  </div>
                  <div
                    className={styles.slistDropdownOption}
                    onClick={() => {
                      handleSelectOption('주소');
                      setTempKeyword('');
                    }}
                  >
                    &nbsp; 주소 &nbsp;
                  </div>
                </div>
              )}
            </div>
            {/* 검색키워드 입력 레이어 */}
            {search.action === '이름' ||
            search.action === '주소' ||
            search.action === '전체' ? (
              <div slistSearchKeyword>
                <input
                  className={styles.slistSearchKeywordBox}
                  placeholder="검색어를 입력하세요."
                  onChange={handleChangeKeyword}
                  value={tempKeyword}
                />
              </div>
            ) : search.action === '성별' ? (
              <div className={styles.slistGenderSelectContainer}>
                <div className={styles.slistGenderSelectDiv}>
                  <lable className={styles.slistGenderSelectLabel}>
                    <input
                      type="radio"
                      value="남성"
                      checked={genderData === '남성'}
                      onClick={selectGender}
                    />
                    남성
                  </lable>
                </div>
                <div className={styles.slistGenderSelectDiv}>
                  <lable className={styles.slistGenderSelectLabel}>
                    <input
                      type="radio"
                      value="여성"
                      checked={genderData === '여성'}
                      onClick={selectGender}
                    />
                    여성
                  </lable>
                </div>
              </div>
            ) : (
              <div className={styles.slistAgeSelectContainer}>
                <div className={styles.slistAgeSelectDiv}>
                  <label className={styles.slistAgeSelectLabel}>
                    <input
                      type="radio"
                      value="60"
                      checked={age === '60'}
                      onClick={selectAge}
                    />
                    60대
                  </label>
                  <label className={styles.slistAgeSelectLabel}>
                    <input
                      type="radio"
                      value="70"
                      checked={age === '70'}
                      onClick={selectAge}
                    />
                    70대
                  </label>
                  <label className={styles.slistAgeSelectLabel}>
                    <input
                      type="radio"
                      value="80"
                      checked={age === '80'}
                      onClick={selectAge}
                    />
                    80대
                  </label>
                  <label className={styles.slistAgeSelectLabel}>
                    <input
                      type="radio"
                      value="90"
                      checked={age === '90'}
                      onClick={selectAge}
                    />
                    90대
                  </label>
                  <label className={styles.slistAgeSelectLabel}>
                    <input
                      type="radio"
                      value="100"
                      checked={age === '100'}
                      onClick={selectAge}
                    />
                    100세 이상
                  </label>
                </div>
              </div>
            )}

            <img
              className={styles.slistSearch}
              src={searchImag}
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className={styles.slisttableDiv}>
          {/* 리스트 출력 레이어 */}
          <table className={styles.slistTable}>
            <thead>
              <tr style={{ cursor: 'auto' }}>
                <th className={styles.nameColumn}>이름</th>
                <th className={styles.birthColumn}>생년월일</th>
                <th className={styles.genderColumn}>성별</th>
                <th className={styles.addressColumn}>주소</th>
                <th className={styles.phoneColumn}>연락처</th>
              </tr>
            </thead>
            <tbody>
              {seniorList.map((list) => (
                <tr
                  key={list.memUUID}
                  onClick={() => handleDetailView(list.memUUID)}
                >
                  <td className={styles.nameColumn}>{list.memName}</td>
                  {/*생년월일*/}
                  <td className={styles.birthColumn}>{list.birthDate}</td>
                  {/*성별*/}
                  <td className={styles.genderColumn}>{list.gender}</td>
                  <td className={styles.addressColumn}>{list.memAddress}</td>
                  <td className={styles.phoneColumn}>
                    {list.memCellphone && /^\d{11}$/.test(list.memCellphone)
                      ? list.memCellphone.replace(
                          /(\d{3})(\d{4})(\d{4})/,
                          '$1-$2-$3'
                        )
                      : list.memCellphone || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.slistPaging}>
            <Paging
              currentPage={pagingInfo.currentPage}
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

export default SeniorList;
