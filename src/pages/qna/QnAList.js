import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {apiSpringBoot} from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './QnAList.module.css';
import { AuthContext } from '../../AuthProvider';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import searchImag from '../../assets/images/search.png'


const QnAList = () => {
  const { accessToken, role, member} = useContext(AuthContext);   // AuthProvider 에서 가져오기
  const [qnaList, setQnaList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [actionInfo, setActionInfo] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({
    pageNumber: 1,
    action: "all",
    listCount: 1,
    maxPage: 1,
    pageSize: 10,
    startPage: 1,
    endPage: 1,
    keyword: "",
    startDate: "2025-01-01",
    endDate: "2025-01-01",
  });

  const navigate = useNavigate();

  const handleMoveDetailView = () => {
    navigate("/");
  };

  //등록 페이지 이동
  const handleWriteClick = () => {
    navigate('/qna/write'); 
  };

  const handlePageChange = async (page) => {
    handleQnAView(member.memUUID, page, pagingInfo.action);  
  };

  const handleQnAView = async (uuid, page, action) => {

      try{
        let response = null
        if(role === "ADMIN") {
          response = await apiSpringBoot.get(`/qna/mylist`, {
            params: {
              ...pagingInfo,
              pageNumber: page,
              action: action,
              keyword: pagingInfo.keyword,
              startDate: pagingInfo.startDate + " 03:00:00",
              endDate: pagingInfo.endDate + " 03:00:00",
            },
          });
          
        } else {
          response = await apiSpringBoot.get(`/qna/mylist`, {
            params: {
              ...pagingInfo,
              uuid: uuid,
              pageNumber: page,
              action: action,
              keyword: pagingInfo.keyword,
              startDate: pagingInfo.startDate + " 03:00:00",
              endDate: pagingInfo.endDate + " 03:00:00",

            },
          });
        }
        console.log(response.data.search);
        setQnaList(response.data.qna);
        setMemberList(response.data.member);
    
        const {maxPage, startPage, endPage} = PagingCalculate(response.data.search.pageNumber, 
                                              response.data.search.listCount, response.data.search.pageSize);
        setPagingInfo(response.data.search.startDate.toLocaleString());
        
        setPagingInfo((pre) => ({
          ...pre,
          maxPage: maxPage,
          startPage: startPage,
          endPage: endPage,
          startDate: response.data.search.startDate.substring(0, 10),
          endDate: response.data.search.endDate.substring(0, 10),
        }));

      } catch (e){
        console.log("error : {}", e); // 에러 메시지 설정
      }    
  }
  
  const handleSelectChange = (e) => {
    const {value} = e.target
    setActionInfo((pre) => ({
      ...pre,
      actionType: value
    }));

  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPagingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    handleQnAView(member.memUUID, 1, actionInfo.actionType);
  }

  useEffect(() => {
    if(member.memUUID){
      handleQnAView(member.memUUID, pagingInfo.pageNumber, pagingInfo.action);
    }
  }, []);

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
    const year = date.getFullYear().toString().slice(2);  // 연도에서 앞 2자리만 추출
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1 해줍니다.
    const day = String(date.getDate()).padStart(2, '0');
    // const hour = String(date.getHours()).padStart(2, '0');
    // const minute = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };


  const selectClass = () => {
    switch (actionInfo.actionType) {
      case 'all':
        return styles.qnaSearchAllSelect;  // 'title' 선택 시 클래스
      case 'title':
        return styles.qnaSearchTitleSelect;  // 'date' 선택 시 클래스
      case 'date':
        return styles.qnaSearchDateSelect;  // 'date' 선택 시 클래스
      default:
        return styles.qnaSearchAllSelect;
    } 
  }

  const searchView = () => {
    switch (actionInfo.actionType) {
      case 'all':
        return ; 
      case 'title':
        return <div>
                  <input name='keyword' onChange={handleChange} className={styles.qnaTitleInput}/> 
                  <img src={searchImag} onClick={handleSearch} />
                </div>;
      case 'date':
        // 현재 날짜를 가져옵니다.
        return <div>
                  <div className={styles.qnaDateInput}>
                    <input type='date' name='startDate' onChange={handleChange} defaultValue={"2025-01-01"}  className={styles.qnaDate}/> ~ 
                    <input type='date' name='endDate' onChange={handleChange} defaultValue={"2025-01-01"} className={styles.qnaDate} />
                  </div>
                  <img src={searchImag} onClick={handleSearch} />
                </div>
    }
  }

  return (
    <div>
      <SideBar />
      <div className={styles.qnaContent}>
        <QNAHeader />
        <div className={styles.qnaSeachdiv}>
          <select name='actionType' onChange={handleSelectChange} className={`${selectClass()}`}>
            <option value="all" selected >전체</option>
            <option value="title">제목</option>
            <option value="date">날짜</option>
          </select>
          {searchView()}
          <button className={styles.qnaInputBTN} onClick={handleWriteClick}>등 록</button>
        </div>
        <table className={styles.qnaListTable}>
          <tr>
            <th>제목</th>
            <th>이름</th>
            <th className={styles.qnaWCreateAtH}>마지막 수정 날짜</th>
            <th className={styles.qnaStateH}>상태</th>
          </tr>
          
          {qnaList.map((qna, index) => (
          <tr>
            <td><button onClick={handleMoveDetailView}>{qna.qnaTitle}</button></td>
            <td>{memberList[index].memName}</td>
            <td className={styles.qnaWCreateAt}>{formatDate(qna.qnaWUpdateAt)}</td>
            <td className={styles.qnaStateN}>미답변</td>
          </tr>
          ))}
   
        </table>
        <div className={styles.pagingDiv}>
          <Paging 
            currentPag={pagingInfo.currentPage }
            maxPage={pagingInfo.maxPage}
            startPage={pagingInfo.startPage }
            endPage={pagingInfo.endPage}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
        {pagingInfo.startDate}
      </div>
      
    </div>
  );
};

export default QnAList;
