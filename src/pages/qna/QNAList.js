import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './QnAList.module.css';
import { AuthContext } from '../../AuthProvider';


const QnAList = () => {
  const { accessToken, authInfo} = useContext(AuthContext);   // AuthProvider 에서 가져오기
  const [qnaList, setQnaList] = useState([]);

  const navigate = useNavigate();

  const handleMoveDetailView = () => {
    navigate("/");
  };

  //등록 페이지 이동
  const handleWriteClick = () => {
    navigate('/qna/write'); 
  };

  useEffect(() => {
    const handleMyQnAView = async (uuid) => {
      try{
        const response = await apiClient.get(`/qna/mylist?uuid=${uuid}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`
        }
      });
      setQnaList(response.data.list);
      console.info("response QnA : " + JSON.stringify(response.data.list));
      console.info("response paging : " +  JSON.stringify(response.data.paging));
      console.info(response.data.list);
  
      } catch (e){
        console.log("error : {}", e); // 에러 메시지 설정
      }
    }

    handleMyQnAView("5e74da53-b1ff-4806-a15c-6c98c1508e0d");
  }, [accessToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
    const year = date.getFullYear().toString().slice(2);  // 연도에서 앞 2자리만 추출
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1 해줍니다.
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}/${month}/${day} ${hour}:${minute}`;
  };


 
  
  return (
    <div>
      <SideBar />
      <div className={styles.qnaContent}>
        <QNAHeader />
        <div className={styles.qnaSeachdiv}>
          <select className={styles.qnaSeachselect}>
              <option value="title" selected>제목</option>
              <option value="writer">작성자</option>
              <option value="date">날짜</option>
          </select>
          <input className={styles.qnaInput}></input>
          <button className={styles.qnaInputBTN} onClick={handleWriteClick}>등 록</button>
        </div>
        <table className={styles.qnaListTable}>
          <tr>
            <th className={styles.qnaTitleH}>제목</th>
            <th className={styles.qnaWCreateByH}>작성자</th>
            <th className={styles.qnaWCreateAtH}>마지막 수정 날짜</th>
            <th className={styles.qnaStateH}>상태</th>
          </tr>
          
          {qnaList.map((test) => (
          <tr>
            <td>{test.qna_title}</td>
            <td>{test.qna_wcreate_by}</td>
            <td>{formatDate(test.qna_wupdate_at)}</td>
          </tr>
          ))}
           
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateN}>미답변</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateN}>미답변</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateN}>미답변</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          <tr>
            <td ><button onClick={handleMoveDetailView}>아이디를 까먹었어요</button></td>
            <td className={styles.qnaWCreateBy}>작성자</td>
            <td className={styles.qnaWCreateAt}>2024/12/15</td>
            <td className={styles.qnaStateY}>답변완료</td>
          </tr>
          
        </table>
      </div>
    </div>
  );
};

export default QnAList;
