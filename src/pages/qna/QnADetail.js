import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {apiSpringBoot} from '../../utils/axios';
import { AuthContext } from '../../AuthProvider';
import styles from './QnADetail.module.css';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import date from '../../assets/images/date.png'
import member1 from '../../assets/images/member1.png'
import member2 from '../../assets/images/member2.png'

const QnADetail = () => {
    const {qnaUUID} = useParams();
    const [qna, setQna] = useState(null);
    const [qnaMember, setQnaMember] = useState(null);
    const [files, SetFiles] = useState(null);
    const {member} = useContext(AuthContext);   // AuthProvider 에서 데이터 가져오기

    const navigate = useNavigate();         // 이동 훅

    const handleMoveUpdateView = () => {    // 수정 뷰로 이동
        navigate(`/qna/update/${qnaUUID}`);
    };

    const handleMoveAnswerView = () => {    // 답변 뷰로 이동
        navigate(`/qna/answer/${qnaUUID}`);
    };

    const handleQnADetailView = async () => {   // 페이지 불러오기
        const response = await apiSpringBoot.get(`/qna/detail/${qnaUUID}`);
        setQna(response.data.qna);
        setQnaMember(response.data.member);
        SetFiles(response.data.files);
    };

    const handleQnADelete = async () => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            const response = await apiSpringBoot.delete(`/qna/${qnaUUID}`);
            navigate(-1);
        }
    };

    const getFileExtension = (filename) => {
        const match = filename.match(/\.([a-zA-Z0-9]+)$/);  // 확장자를 추출하는 정규 표현식
        return match ? match[0] : null; // '.jpg' 형식으로 반환
    };

    const handleFileDown = async (fileName, index) => {
        const response = await apiSpringBoot.get(`/qna/qfdown`,{
            params: {fileName: fileName},
            responseType:'blob', // 파일 다운로드를 위한 설정
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download',"qna_file_" + index + getFileExtension(fileName));
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    useEffect(() => {
        handleQnADetailView();
    },[]);

    if (!qna || !member) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };
    
    return(
    <div>
        <SideBar />
        <div className={styles.qnaContent}>
            <QNAHeader text="Q&A"/>
            <div className={styles.qnaDetailHeader}>
                <h1>{qna.qnaTitle}</h1>
                <div className={styles.memberData}>
                    <img src={member2} className={styles.qnaDetailTypeImg} /><span>{qnaMember.memType}</span>
                    <img src={member1} className={styles.qnaDetailIdImg} /><span>{qnaMember.memName}</span>
                    <img src={date} className={styles.qnaDetailDateImg} /><span>{qna.qnaWUpdateAt.split("T")[0]}</span>
                </div>
            </div>
            
            <hr />
            <p className={styles.qnaDetailContent}>
                {qna.qnaWContent}
            </p>
            <hr />
            <div className={styles.filesDiv}>
                첨부파일
                <div>
                    {files.map((file, index) =>(
                        <span 
                            className={styles.files}
                            onClick={()=>handleFileDown(file, index)}
                        >
                            qna_file_{index} <br/>
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.qnaDetailBTNDiv}>
                <button className={styles.qnaListViewBTN} onClick={() => {navigate(-1);}} >목 록</button>
                {member.memType === "ADMIN" ? (qna.qnaADCreateBy ?
                <>
                    <button className={styles.qnaUpdateViewBTN} onClick={handleMoveUpdateView}>수 정</button>
                </>
                : 
                <>
                    <button className={styles.qnaAnswerViewBTN} onClick={handleMoveAnswerView}>답변하기</button>
                    <button className={styles.qnaUpdateViewBTN} onClick={handleMoveUpdateView}>수 정</button>
                </>)
                : !qna.qnaADCreateBy &&
                    <button className={styles.qnaUpdateViewBTN} onClick={handleMoveUpdateView}>수 정</button>}
                <button className={styles.qnaDeleteBTN} onClick={handleQnADelete} >삭 제</button>
               
                    
            </div>
        </div>
    </div>);
}

export default QnADetail;