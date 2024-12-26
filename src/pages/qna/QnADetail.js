import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {apiSpringBoot} from '../../utils/axios';
import styles from './QnADetail.module.css';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import date from '../../assets/images/date.png'
import member1 from '../../assets/images/member1.png'
import member2 from '../../assets/images/member2.png'

const QnADetail = () => {
    const {qnaUUID} = useParams();
    const [qna, setQna] = useState(null);
    const [member, setMember] = useState(null);

    const navigate = useNavigate();         // 이동 훅

    const handleMoveUpdateView = () => {    // 수정 뷰로 이동
        navigate(`/qna/update/${qnaUUID}`);
    };

    const handleMoveAnswerView = () => {    // 답변 뷰로 이동
        navigate(`/qna/answer/${qnaUUID}`);
    };

    const handleQnADetailView = async () => {   // 페이지 불러오기
        const respone = await apiSpringBoot.get(`/qna/detail/${qnaUUID}`);
        setQna(respone.data.qna);
        setMember(respone.data.member);
    };

    const handleQnADelete = async () => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            const respone = await apiSpringBoot.delete(`/qna/${qnaUUID}`);
            navigate(-1);
        }
    };

    useEffect(() => {
        handleQnADetailView();
    },[]);

    if (!qna) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };
    
    return(
    <div>
        <SideBar />
        <div className={styles.qnaContent}>
            <QNAHeader text="QnA"/>
            <div className={styles.qnaDetailHeader}>
                <h1>{qna.qnaTitle}</h1>
                <div className={styles.memberData}>
                    <img src={member2} className={styles.qnaDetailTypeImg} /><span>{member.memType}</span>
                    <img src={member1} className={styles.qnaDetailIdImg} /><span>{member.memName}</span>
                    <img src={date} className={styles.qnaDetailDateImg} /><span>{qna.qnaWUpdateAt.split("T")[0]}</span>
                </div>
            </div>
            
            <hr />
            <p className={styles.qnaDetailContent}>
                {qna.qnaWContent}
            </p>
            <hr />
            <div className={styles.qnaDetailBTNDiv}>
                <button className={styles.qnaListViewBTN} onClick={() => {navigate(-1);}} >목 록</button>
                <button className={styles.qnaAnswerViewBTN} onClick={handleMoveAnswerView}>답변하기</button>
                <button className={styles.qnaUpdateViewBTN} onClick={handleMoveUpdateView}>수 정</button>
                <button className={styles.qnaDeleteBTN} onClick={handleQnADelete} >삭 제</button>
            </div>
        </div>
    </div>
);
}

export default QnADetail;