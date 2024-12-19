import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './QnAList.module.css'


const QnAList = () => {
  const [test, setTest] = useState({
    qnaTitle: "",
  })
  const [qnaList, setQnaList] = useState({
    qnaTitle: "asd",
    qnaWCreateBy: "",
    qnaADCreateAt: "",
  });

  const navigate = useNavigate();

  const handleMoveDetailView = () => {
    navigate("/");
  };

  //등록 페이지 이동
  const handleWriteClick = () => {
    navigate('/qna/write'); 
  };

  const handleMyQnAView = async (uuid) => {
    try{
      const response = await axios.get(`http://localhost:8080/qna/mylist`,{params: {uuid: uuid}});
      console.info("response : " + response.data);
    } catch{
      console.info('에러러러러러러러'); // 에러 메시지 설정
    }
    
    
  }

  useEffect(() => {
    handleMyQnAView("ai-uuid-1234-5678-90ab-cdef12345678");
  }, []);


 
  
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
            <th className={styles.qnaWCreateAtH}>등록날짜</th>
            <th className={styles.qnaStateH}>상태</th>
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
