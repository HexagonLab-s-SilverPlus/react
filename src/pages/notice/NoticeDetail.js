// src/pages/notice/noticeDetail.js
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
import SeniorNavbar from '../../components/common/SeniorNavbar';
import SeniorFooter from '../../components/common/SeniorFooter';
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
    const {role,memId,memName,member} = useContext(AuthContext);

    // 날짜시간 보정
    const adjustTimeZone = (timestamp) => {
        // 서버에서 받은 Timestamp를 UTC로 간주하고 보정하지 않음
        const originalDate = new Date(timestamp);
        const correctedDate = new Date(originalDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 보정
        return correctedDate.toISOString(); // ISO 8601 형식 반환
    };

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

    const handleDelete = async () => {
        if(window.confirm("공지사항을 삭제하시겠습니까?")){
            try{
                console.log(notice.notId);
                console.log(member.memUUID);
                console.log(notice.notCreateAt);
                await apiSpringBoot.post(`/notice/delete/${notice.notId}`,{
                    params:{
                        ...notice,
                        memUUID:member.memUUID,
                    },
                });
                alert("삭제가 완료되었습니다.");
                navigate('/notice');
            } catch(error){
                console.error('delete error : ', error);
                alert('공지사항 삭제에 실패하였습니다.');
            }
        }
    };
    
    if (!notice){
        return <div className={styles.loading}>loading...</div>; // 로딩 표시
    }
    if (error){
        return <div>{error}</div>;
    }
    if (role ==="SENIOR"){
    return (
        <div className={styles.noticeList}>
            {/* 헤더 */}
            
            <SeniorNavbar />
            <div className={styles.seniorMainDiv}>
            <table className={styles.seniorDetailTable}>
                <thead>
                    <tr className={styles.seniorTopButton}>
                        <button 
                            className={styles.seniorInnerButton} 
                            onClick={()=>(navigate(-1))}
                        >
                            <span class="material-symbols-outlined">arrow_back</span> 뒤로가기</button>
                        <button
                            className={styles.seniorButton} 
                            onClick={() =>(navigate('/notice'))}
                        >목록</button>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.seniorTitle}>{notice.notTitle}</td>
                    </tr>
                    <tr>
                        <td className={styles.seniorSubBar}>조회수 {notice.notReadCount} &nbsp;&nbsp;&nbsp;&nbsp; 등록일 {adjustTimeZone(notice.notCreateAt).split('T')[0]}</td>
                    </tr>
                    <tr>
                        <td>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.seniorContent}>
                            {notice.notContent}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {files.map((file) => (
                                <div key={file.fileName}>
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
                        <td>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.noticeSeniorFiles}>
                        <button className={styles.seniorFakeButton}>첨부파일을 클릭하여 확인해 보세요</button>
                        <div>
                        {noticeFiles &&noticeFiles.map((files)=>(
                            <div 
                                key={files.nfId}
                                onClick={()=>handleFileDown(files.nfOreginalName,files.nfRename)}
                                className={styles.seniorFiles}
                            >
                                {files.nfOreginalName}
                            </div>
                        ))}
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
                <div className={styles.seniorBottomBar}>
                    <div className={styles.seniorUpButton}>
                    <button 
                        className={styles.seniorInnerButton2} 
                        onClick={()=>(window.scrollTo(
                            { top:0,
                                behavior:'smooth',
                            }
                        ))}
                    >
                        <span class="material-symbols-outlined">arrow_upward</span> 위로이동</button>
                    </div>
                    <div className={styles.seniorCenterButton}>                        
                        <button
                            className={styles.seniorButton} 
                            onClick={() =>(navigate('/notice'))}
                        >목록</button>
                    </div>
                </div>
            {/*Footer*/}
            <SeniorFooter />
        </div>
    );
    } else {
        return (
            <div className={styles.memberContainer}>
            <SideBar />
            <div className={styles.memberSubContainer}>
                <div className={styles.MemberNoticeTop}>
                        <span onClick={()=>(navigate("/notice"))}>공지사항</span>
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
                                            <span><img className={styles.img} src={date}/> {adjustTimeZone(notice.notCreateAt).split('T')[0]}</span>
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
                                            <div key={file.fileName}>
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
                                <button className={styles.noticeFakeButton}>첨부파일</button>
                                <div>
                                {noticeFiles &&noticeFiles.map((files)=>(
                                    <div 
                                        key={files.nfId}
                                        className={styles.file}
                                        onClick={()=>handleFileDown(files.nfOreginalName,files.nfRename)}
                                    >
                                        {files.nfOreginalName}
                                    </div>
                                ))}
                                </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.buttonDiv}>
                    <div className={styles.centerButton}>
                        <button className={styles.noticebutton} onClick={()=>{navigate(-1)}}>목록</button>
                    </div>
                    {role==="ADMIN" && (
                        <div className={styles.rightButtons}>
                            <button className={styles.noticebutton} onClick={()=>{navigate(`/noticeupdate/${notice.notId}`)}}>수정</button>
                            <button
                                className={styles.noticebutton}
                                onClick={handleDelete}
                            >삭제</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        );
    }
};

export default NoticeDetail;