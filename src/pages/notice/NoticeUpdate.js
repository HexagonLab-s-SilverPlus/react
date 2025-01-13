// src/pages/notice/noticeDetailView.js
import React,{useState,useEffect,useContext} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
// AuthContext
import {AuthContext} from "../../AuthProvider"
// axios
import {apiSpringBoot} from '../../utils/axios';
// css
import styles from './NoticeUpdate.module.css';
// components
import SideBar from '../../components/common/SideBar';

const NoticeDetail = () => {

    // notice
    const [formData, setFormData] = useState({
        notId:'',
        notTitle:'',
        notContent:'',
        notCreateAt:'',
        notCreateBy:'',
        notUpdateBy:'',
        notReadCount:0,
    });

    // params
    const {notId} = useParams();

    // navigate
    const navigate = useNavigate();

    // origin notice
    const [noticeFiles,setNoticeFiles] = useState([]);
    const [deleteFiles,setDeleteFiles] = useState([]);

    // new files
    const [newFiles, setNewFiles] = useState([]);
    // 토큰정보 가져오기(AuthProvider)
    const {member} = useContext(AuthContext);

    // notice data set
    useEffect(()=>{
        const fetchNoticeDetail = async () => {
            try{
                const response = await apiSpringBoot.get(`/notice/detail/${notId}`);
                console.log(response.data.notice);
                console.log(response.data.noticeFiles);
                setFormData((prev)=>({
                    ...prev,
                    notId:response.data.notice.notId,
                    notTitle:response.data.notice.notTitle,
                    notContent:response.data.notice.notContent,
                    notCreateAt:response.data.notice.notCreateAt,
                    notCreateBy:response.data.notice.notCreateBy,
                    notUpdateBy:member.memUUID,
                    notReadCount:response.data.notice.notReadCount,
                }));
                setNoticeFiles(response.data.noticeFiles);

            } catch(error){
                setError('공지사항 수정페이지 이동에 실패하였습니다.');
                console.error(error);
            }
        };
        // 함수실행
        fetchNoticeDetail();
    },[notId]);

    
    // formData 수정
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prevFormData)=>({
            ...prevFormData,
            [name]:value,
        }));
    }

    // 수정
    const handleUpdateNotice = async (e) => {
        e.preventDefault(); // submit취소
        if(window.confirm("공지사항을 수정하시겠습니까?")){
            // 보낼 폼데이터 객체 생성
            const data = new FormData();

            const noticeJson = JSON.stringify(formData);
            data.append("notice", noticeJson); // "notice" 키 확인
            // notice 풀어서 넣기
            // Object.entries(formData).forEach(([key,value])=>data.append(key,value));
            console.log("notId : ", data.get("notId"));
            // 새로운 파일 추가
            if (newFiles && newFiles.length > 0) {
                newFiles.forEach((file) => {
                    data.append("newFiles", file); // 첨부파일 추가
                });
            }
            console.log("newFiles : ", data.getAll("newFiles"));

            // 삭제된 파일 추가
            if (deleteFiles && deleteFiles.length > 0) {
                // JSON 문자열로 변환
                const deleteFilesJson = JSON.stringify(deleteFiles);
                data.append("deleteFiles", deleteFilesJson); // JSON 문자열 추가
                // deleteFiles.forEach((file) => {
                //     data.append("deleteFiles", file); // 삭제 파일 이름 추가
                // });
            }
            console.log("deleteFiles : ", data.getAll("deleteFiles"));

            for (let [key,value] of data.entries()){
                console.log(`${key}:${value.name||value}`);
            }            
            

            try{
                await apiSpringBoot.post('/notice/update',data,{
                    headers:{
                        'Content-Type':'multipart/form-data',
                    }
                });
                alert('공지사항 수정에 성공하였습니다.');
                navigate(`/notice`)
            } catch(error) {
                console.error('공지글 수정 실패',error);
                alert('공지사항 수정에 오류가 발생하였습니다.');
            }
        }
    }
    
    // 수정취소
    const handleInsertCancel = (e) => {
        e.preventDefault(); // submit 취소
        if(window.confirm("정말로 취소하시겠습니까?")){
            navigate(-1);
        }
    }

    // 첨부파일 입력박스 추가
    const handleFileInsertBox = (e) => {
        e.preventDefault(); // submit 취소
        // 임시 파일 입력 요소 생성
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';

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

    // 기존파일 삭제 처리(리스트에 저장)
    const handleDeleteOriginFile = (file,index) => {
        setNoticeFiles((prev)=>prev.filter((_,i) => i !== index));
        setDeleteFiles((prev)=>[...prev,file]);
    };


    console.log(deleteFiles);
    console.log(newFiles);
    return (
        <div className={styles.memberContainer}>
            <SideBar />
            <div className={styles.memberSubContainer}>
                <div className={styles.MemberNoticeTop}>
                        <span onClick={()=>(navigate("/notice"))}>공지사항</span>
                </div>
                <div className={styles.insertTableDiv}>
                    <form
                        onSubmit={handleUpdateNotice}
                        encType='multipart/form-data'
                    >
                        <table className={styles.insertTable}>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input 
                                            className={styles.notTitleInput}
                                            type='text'
                                            name='notTitle'
                                            value={formData.notTitle}
                                            onChange={handleChange}
                                            placeholder='제목을 입력해 주세요.'
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea
                                            className={styles.notContentInput}
                                            name='notContent'
                                            value={formData.notContent}
                                            onChange={handleChange}
                                            placeholder='내용을 입력해 주세요.'
                                            required
                                        ></textarea>
                                    </td>
                                </tr>
                                <div className={styles.fileDiv}>
                                <tr >
                                    <button
                                        className={styles.noticeButton}
                                        onClick={(e)=>handleFileInsertBox(e)}
                                        >첨부파일추가
                                    </button>
                                </tr>
                                <div>
                                {/* 기존 첨부파일 */}
                                {noticeFiles && noticeFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td colSpan="2">
                                            <span>{file.nfOreginalName}</span>
                                            <input 
                                                type="button"
                                                onClick={()=>handleDeleteOriginFile(file,index)}
                                                value="x"
                                                className={styles.noticeButton}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {/* 신규 첨부파일 */}
                                {newFiles && newFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td colSpan="2">
                                            <span>{file.name}</span>
                                            <input 
                                                type="button"
                                                onClick={()=>handleDeleteFile(index)}
                                                value="x"
                                                className={styles.noticeButton}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </div>
                                </div>
                                <tr>
                                    <td className={styles.buttonDiv}>
                                        <button
                                            className={styles.noticeButton2}
                                            type='submit'
                                        >수정</button> &nbsp;
                                        <button 
                                            className={styles.noticeButton2}
                                            onClick={handleInsertCancel}
                                        >취소</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;