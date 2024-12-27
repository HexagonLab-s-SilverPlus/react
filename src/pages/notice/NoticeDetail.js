// src/pages/notice/noticeDetailView.js
import React,{useState,useEffect,useContext} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
// AuthContext
import {AuthContext} from "../../AuthProvider"
// axios
import {apiSpringBoot} from '../../utils/axios';
// css
import styles from './NoticeDetail.module.css';
// components
import SideBar from '../../components/common/SideBar';
// image
import date from '../../assets/images/date.png'
import write from '../../assets/images/member1.png'
import readCount from '../../assets/images/readcount.png'


const NoticeDetail = () => {
    // params
    const {notId} = useParams(); 
    // navigate
    const navigate = useNavigate();
    // notice
    const [notice, setNotice] = useState(null);
    const [noticeFiles,setNoticeFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [error,setError] = useState(null);
    // 토큰정보 가져오기(AuthProvider)
    const {member,isLoggedIn, role,memId} = useContext(AuthContext);

    // notice data set
    useEffect(()=>{
        const fetchNoticeDetail = async () => {
            try{
                const response = await apiSpringBoot.get(`/notice/detail/${notId}`);
                console.log(response.data.notice);
                console.log(response.data.noticeFiles);
                console.log(response.data.fileList)
                setNotice(response.data.notice);
                setNoticeFiles(response.data.noticeFiles);
                setFiles(response.data.fileList);
                
            } catch(error){
                setError('공지사항 상세조회에 실패하였습니다.');
                console.error(error);
            }
        };
        // 함수실행
        fetchNoticeDetail();
    },[notId]);

    const handleFileDown = async (originalFileName,renameFileName) => {
        try {
            const response = await apiSpringBoot.get('/notice/nfdown',{
                params:{
                    ofile:originalFileName,
                    rfile:renameFileName,
                },
                responseType:'blob', // 파일 다운로드를 위한 설정
            });

            // 파일 다운로드 처리
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download',originalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error){
            console.error('File download error : ', error);
            alert('파일 다운로드에 실패했습니다.')
        }
    };
    
    if (!notice){
        return <div className={styles.loading}>loading...</div>; // 로딩 표시
    }
    if (error){
        return <div>{error}</div>;
    }
    return (
        <div className={styles.memberContainer}>
        <SideBar />
        <div className={styles.memberSubContainer}>
            <div className={styles.MemberNoticeTop}>
                    <p onClick={()=>(navigate("/notice"))}>공지사항</p>
            </div>
            <div className={styles.insertTableDiv}>
                <table className={styles.insertTable}>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className={styles.notTitleLine}>
                                    <div className={styles.notTitle}>{notice.notTitle}</div>
                                    <div className={styles.writeData}>
                                        <span><img className={styles.img} src={write}/> {memId}</span>
                                        <span><img className={styles.img} src={date}/> {notice.notCreateAt.split('T')[0]}</span>
                                        <span><img className={styles.img} src={readCount}/> {notice.notReadCount}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.notContent}>
                                {notice.notContent}
                            </td>
                        </tr>
                            <tr>
                                <td>
                                    {files.map((file) => (
                                        <div key={file.mfId}>
                                            {file.mimeType.startsWith('image/') && (
                                            <img
                                                className={styles.fileview}
                                                src={`data:${file.mimeType};base64,${file.fileContent}`}
                                                alt={file.fileName}
                                            />
                                            )}
                                            {!file.mimeType.startsWith('image/') && (
                                            <></>
                                            )}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        <tr>
                            <td className={styles.filesDiv}>
                            <button className={styles.button}>첨부파일</button>
                            {noticeFiles &&noticeFiles.map((files)=>(
                                <span 
                                    key={files.nfId}
                                    className={styles.file}
                                    onClick={()=>handleFileDown(files.nfOreginalName,files.nfRename)}
                                >
                                    {files.nfOreginalName}
                                </span>
                            ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.buttonDiv}>
                <div className={styles.centerButton}>
                    <button className={styles.button} onClick={()=>{navigate(-1)}}>목록</button>
                </div>
                {role==="ADMIN" && (
                    <div className={styles.rightButtons}>
                        <button className={styles.button}>수정</button>
                        <button className={styles.button2}>삭제</button>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
};

export default NoticeDetail;