    import React, {useState, useContext} from 'react';
    import {apiSpringBoot} from '../../utils/axios';
    import { useNavigate } from 'react-router-dom';
    import { AuthContext } from '../../AuthProvider';
    import SideBar from '../../components/common/SideBar';
    import QNAHeader from '../../components/qna/QNAHeader';
    import styles from './QnAWrite.module.css'

    const QnAWrite = () => {
        const navigate = useNavigate();
        const { member} = useContext(AuthContext);   // AuthProvider 에서 가져오기
        // files
        const [newFiles, setNewFiles] = useState([]);

        const [formData, setFormData] = useState({
            qnaTitle: "",       // 제목
            qnaWCreateBy: member.memUUID,   // 질문자 
            qnaWContent: "",    // 질문내용
            qnaADContent: "",    // 답변내용
            qnaADCreateBy: "",  // 답변자
            qnaADUpdateBy: "",  // 답변자(수정)
        });

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
            setFormData((prevFormData) => ({
                ...prevFormData,
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
            
            Object.entries(formData).forEach(([key, value]) => data.append(key, value));

            try {
                await apiSpringBoot.post('/qna', data,{
                    headers: {'Content-Type':'multipart/form-data',
                    }}
                );
                alert('QnA 등록 성공');
                // 게시글 등록이 성공되면 공지 목록 페이지로 이동
                navigate('/qna');
            } catch (error) {
                console.error('게시글 등록 실패', error);
                alert('새 게시글 등록 실패');
            }
        };
        if (!formData || !member) {
            // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
            return <div>Loading...</div>;
        };

        return (
            <div>
                <SideBar />
                <div className={styles.qnaContent}>
                    <QNAHeader text="Q&A 등록"/>
                    <form 
                    onSubmit={handleSubmit} 
                    encType="multipart/form-data">
                    <div className={styles.qnaWriteTitleDiv}>
                        <h1 className={styles.qnaWriteTitle}>제 목</h1>
                        <input type="text" name="qnaTitle" onChange={handleChange} className={styles.qnaWriteTitleTxt}/>
                    </div>
                    <hr/>
                    <div className={styles.memberIdDiv}>
                        <h1 className={styles.memberId}>ID</h1>
                        <input type="text" onChange={handleChange} className={styles.memberIdTxt} value={member.memId} readOnly/>
                    </div>
                    <div className={styles.qnaWriteContentDiv}>
                        <h1 className={styles.qnaWriteContent}>질문내용</h1>
                        <textarea type="text" name="qnaWContent" onChange={handleChange} className={styles.qnaWriteContentTxt}></textarea>
                    </div>
                    <button
                    onClick={(e)=>handleFileInsertBox(e)}
                        >첨부파일추가
                    </button>
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
                    <div className={styles.qnaWriteBTN}>
                        <input type='submit' value="등 록"/>
                        <button onClick={(event) => {navigate(-1); event.preventDefault();}}>취 소</button>
                    </div>
                    </form>    
                </div>        
            </div>
        );
    }
    export default QnAWrite;


