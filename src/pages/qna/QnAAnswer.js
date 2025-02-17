import React, {useState, useContext, useEffect} from 'react';
import {apiSpringBoot} from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './QnAAnswer.module.css'

const QnAAnswer = () => {
    const navigate = useNavigate();
    const {qnaUUID} = useParams();
    const {member} = useContext(AuthContext);   // AuthProvider 에서 데이터 가져오기

    // files
    const [newFiles, setNewFiles] = useState([]);
    const [qna, setQna] = useState();


    // 첨부파일 입력박스 추가
    const handleFileInsertBox = (e) => {
        e.preventDefault(); // submit 취소
        // 임시 파일 입력 요소 생성
        const input = document.createElement('input');
        input.type = 'file';

        // 파일 선택 이벤트 처리
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setNewFiles((prevFiles) => [...prevFiles,file]);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };
    
    // 파일 삭제 처리
    const handleDeleteFile = (index) => {
        setNewFiles((prevfiles)=>prevfiles.filter((_,i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value} = e.target;
        setQna((prev) => ({
            ...prev,
            [name]: value,

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)
    
        const data = new FormData();
       
        if (newFiles){
            newFiles.forEach((file) => {
                data.append('newFiles',file); // 첨부파일 추가
                console.log(JSON.stringify(file));
            });
        }
        
        Object.entries(qna).forEach(([key, value]) => data.append(key, value));
        try {
            await apiSpringBoot.put(`/qna/${member.memType}`, data, {
                headers: {'Content-Type':'multipart/form-data',
                }}
            );
            alert('QnA 수정 성공');
            // 게시글 등록이 성공되면 공지 목록 페이지로 이동
            navigate(-1);
        } catch (error) {
            console.error('게시글 등록 실패', error);
            alert('새 게시글 등록 실패');
        }
    };

    const handleUpdateQnA = async () => {
        const response = await apiSpringBoot.get(`/qna/detail/${qnaUUID}`);

        if(response.data.qna.qnaWCreateAt) response.data.qna.qnaWCreateAt = response.data.qna.qnaWCreateAt.split("T")[0] + " " + response.data.qna.qnaWCreateAt.split("T")[1].split(".")[0];
        if(response.data.qna.qnaWUpdateAt) response.data.qna.qnaWUpdateAt = response.data.qna.qnaWUpdateAt.split("T")[0] + " " + response.data.qna.qnaWUpdateAt.split("T")[1].split(".")[0];
        if(response.data.qna.qnaADCreateAt) response.data.qna.qnaADCreateAt = response.data.qna.qnaADCreateAt.split("T")[0] + " " + response.data.qna.qnaADCreateAt.split("T")[1].split(".")[0];
        if(response.data.qna.qnaADUpdateAt) response.data.qna.qnaADUpdateAt = response.data.qna.qnaADUpdateAt.split("T")[0] + " " + response.data.qna.qnaADUpdateAt.split("T")[1].split(".")[0];

        setQna(Object.fromEntries(
            Object.entries(response.data.qna).filter(([key, value]) => value !== null)),
        );
        if(member.memType === "ADMIN"){
            setQna((pre) =>({
                ...pre,
                qnaADUpdateBy: member.memUUID,
            }));
        }
    };

    useEffect(() => {
        handleUpdateQnA();
        
    }, []);

    if (!qna || !member) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };

    return (
        <div className={styles.bodyDiv}>
            <SideBar />
            <div className={styles.qnaContent}>
                <QNAHeader text="Q&A 답변"/>
                <form 
                    onSubmit={handleSubmit} 
                    encType="multipart/form-data">
   
                    <div className={styles.qnaAnswerTitleDiv}>
                        <h1 className={styles.qnaAnswerTitle}>제 목</h1>
                        <input type="text" name="qnaTitle" onChange={handleChange} className={styles.qnaAnswerTitleTxt} defaultValue={qna.qnaTitle}readOnly />
                    </div>
                    <hr/>
                    <div className={styles.qnaAnswerContentDiv}>
                        <h1 className={styles.qnaAnswerContent}>질문내용</h1>
                        <textarea type="text" name="qnaWContent" onChange={handleChange} className={styles.qnaAnswerContentTxt} defaultValue={qna.qnaWContent} readOnly></textarea>
                    </div>
                    {newFiles.map((file, index) => (
                        <tr key={index}>
                            <td colSpan="2">
                                <span>{file.name}</span>
                                <input 
                                    type="button"
                                    onClick={()=>handleDeleteFile(index)}
                                    value="x"
                                />
                            </td>
                        </tr>
                    ))}
                    <hr/>
                    <div className={styles.qnaAnswerContentDiv}>
                        <h1 className={styles.qnaAnswerContent}>답변내용</h1>
                        <textarea name="qnaADContent" onChange={handleChange} className={styles.qnaAnswerContentTxt} defaultValue={qna.qnaADContent} />                        
                    </div>
                 

                    <div className={styles.qnaAnswerBTN}>
                        <input type='submit' value="답 변" />
                        <button onClick={(event) => {navigate(-1); event.preventDefault();}}>취 소</button>
                    </div>
                    <div className={styles.marginBotton} />
                </form>    
               
            </div>       
            
        </div>
    );
}
export default QnAAnswer;


