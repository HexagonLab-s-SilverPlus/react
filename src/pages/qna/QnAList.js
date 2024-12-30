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
  const { member} = useContext(AuthContext);   // AuthProvider 에서 데이터 가져오기
  const [qnaList, setQnaList] = useState([]);                     // qnaList 담을 상태훅
  const [memberList, setMemberList] = useState([]);               // member 담을 상태훅(누가 작성한지 담을때 사용)
  const [actionInfo, setActionInfo] = useState([]);               // 검색 데이터 담을 상태훅

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];        // 현재 날짜 가져오기

  const [pagingInfo, setPagingInfo] = useState({                  // 스프링 부터 search를 보낼때 담을 상태훅
    pageNumber: 1,
    action: "all",
    listCount: 1,
    maxPage: 1,
    pageSize: 10,
    startPage: 1,
    endPage: 1,
    keyword: "",
    startDate: formattedDate,
    endDate: formattedDate,
  });

  const navigate = useNavigate();         // 이동 훅

  const handleMoveDetailView = (qnaUUID) => {    // 디테일 뷰로 이동
    navigate(`/qna/detail/${qnaUUID}`);
  };

  const handleWriteClick = () => {        // 등록 뷰로 이동
    navigate('/qna/write'); 
  };

  const handlePageChange = async (page) => {          // 페이지 눌렀을때 뷰 바꾸기
    handleQnAView(member.memUUID, page, pagingInfo.action);  
  };

  const handleQnAView = async (uuid, page, action) => {   // 페이지 불러오기
    console.log("pagingInfo" + JSON.stringify(pagingInfo));
      try{
        let response = null
        if(member.memType === "ADMIN") {
          response = await apiSpringBoot.get(`/qna/mylist`, {
            params: {
              ...pagingInfo,
              pageNumber: page,
              action: action,
              keyword: pagingInfo.keyword,
              startDate: pagingInfo.startDate + " 00:00:00",
              endDate: pagingInfo.endDate + " 00:00:00",
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
              startDate: pagingInfo.startDate + " 00:00:00",
              endDate: pagingInfo.endDate + " 00:00:00",

            },
          });
        }
        setQnaList(response.data.qna);
        setMemberList(response.data.member);

        const {maxPage, startPage, endPage} = PagingCalculate(response.data.search.pageNumber, 
                                              response.data.search.listCount, response.data.search.pageSize);
        setPagingInfo(response.data.search);
        setPagingInfo((pre) => ({
          ...pre,
          maxPage: maxPage,
          startPage: startPage,
          endPage: endPage,
          startDate: formatDate(response.data.search.startDate),
          endDate: formatDate(response.data.search.endDate),
        }));

      } catch (e){
        console.log("error : {}", e); 
      }    
  }
  
  const handleSelectChange =  (e) => {     // select 바뀌면 검색상태 저장
    const {value} = e.target
    setActionInfo((pre) => ({
      ...pre,
      actionType: value
    }));
    if(value === "all"){
      handleQnAView(member.memUUID, 1, "all");
    }
  };

  const handleChange = (e) => {       // 검색 데이터 쓰면 paging훅에 저장
    const { value, name } = e.target;
    setPagingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {        // 검색 버튼을 눌르면 출력뷰 변경
    handleQnAView(member.memUUID, 1, actionInfo.actionType);   
  }

  useEffect(() => {             // 처음 뷰화면 출력
    if(member.memUUID){
      handleQnAView(member.memUUID, pagingInfo.pageNumber, pagingInfo.action);
    }
  }, []);

  const formatDate = (w) => {     // 데이터 포멧(우리나라 시간으로)
    const date = new Date(w);
  
    // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더해야 합니다.
    const day = date.getDate();
  
    return `${year}-${month}-${day}`;
  };

  

  const selectClass = () => {         // select 바 바꿀떄 css 변경
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

        return <div>
                  <div className={styles.qnaDateInput}>
                    <input type='date' name='startDate' onChange={handleChange} defaultValue={formattedDate}  className={styles.qnaDate}/> &nbsp;~ &nbsp;
                    <input type='date' name='endDate' onChange={handleChange} defaultValue={formattedDate} className={styles.qnaDate} />
                  </div>
                  <img src={searchImag} onClick={handleSearch} />
                </div>
    }
  }


  if (!qnaList || !memberList || !member) {
      // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
      return <div>Loading...</div>;
  };

  return (
    <div>
      <SideBar />
      <div className={styles.qnaContent}>
        <QNAHeader text="Q&A"/>
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
            <th className={styles.memberName}>이름</th>
            <th className={styles.qnaWCreateAt}>마지막 수정 날짜</th>
            {member.memType === "ADMIN" && <th className={styles.qnaStateH}>상태</th>}
          </tr>
          
          {qnaList.map((qna, index) => (
          <tr>
            <td><button onClick={() => handleMoveDetailView(qna.qnaId)}>{qna.qnaTitle}</button></td>
            <td className={styles.memberNameTd}>{memberList[index].memName}</td>
            <td className={styles.qnaWCreateAtTd}>{qna.qnaWUpdateAt.split('T')[0]}</td>
            {member.memType === "ADMIN" && (qna.qnaADCreateBy ? <td className={styles.qnaStateY}>답변</td>
                              : <td className={styles.qnaStateN}>미답변</td>)}
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
      </div>
      
    </div>
  );
};

export default QnAList;
