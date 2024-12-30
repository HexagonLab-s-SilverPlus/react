// src/pages/program/ProgamDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramDetail.module.css';
import SideBar from "../../components/common/SideBar";

const ProgramDetail = () => {
    const [program, setProgram] = useState({
        snrStartedAt: '',
        snrEndedAt: '',
    });
    const [files, setFiles] = useState([]);
    const { snrProgramId } = useParams();   //URL 파라미터에서 ID 가져오기

    //이동
    const navigate = useNavigate();

    //목록 페이지로 이동
    const handleMoveProgram = () => {
        navigate(`/program`);
    };

    //디테일 페이지 불러오기
    const handleProgramDetailView = async () => {
        try {
            const response = await apiSpringBoot.get(`/program/detail/${snrProgramId}`);
            console.log('API Response:', response.data);
            setProgram(response.data.program);
            setFiles(response.data.files || []);
        } catch {
            console.error('handleProgramDetailView Error:', error);
        }
    };

    // 이미지 렌더링
    const renderImages = () => {
        return files
            .filter(file => file.mimeType.startsWith('image/')) // 이미지 파일 필터링
            .map((file, index) => (
                <div key={index}>
                    <img
                        src={`data:${file.mimeType};base64,${file.fileContent}`}
                        alt={file.fileName}
                        className={styles.pgDetailImage}
                    />
                </div>
            ));
    };

    // 첨부파일 렌더링 (다운로드 링크)
    const renderAttachments = () => {
        return files.map((file, index) => (
            <li key={index}>
                <a
                    href={`data:${file.mimeType};base64,${file.fileContent}`}
                    download={file.fileName}
                >
                    {file.fileName}
                </a>
            </li>
        ));
    };

    useEffect(() => {
        handleProgramDetailView();
    }, []);
    
    return (
        <div className={styles.pgContainer}>
            <SideBar />
            <section className={styles.pgRSection}>
                <div className={styles.secTop}>
                    <p>어르신 프로그램</p>
                </div>{/* .secTop end */}

                <div className={styles.secContent}>
                    <div className={styles.pgDetailTop}>
                        <h1 className={styles.pgDTitle}>{program.snrTitle}</h1>
                        
                        <ul className={styles.pgDList}>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">home</span>
                                <span>기관명</span>
                                <span>{program.snrOrgName}</span>
                            </li>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">call</span>
                                <span>기관 전화번호</span>
                                <span>{program.snrOrgPhone}</span>
                            </li>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">pin_drop</span>
                                <span>기관 주소</span>
                                <span>{program.snrOrgAddress}</span>
                            </li>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">manage_accounts</span>
                                <span>담당자명</span>
                                <span>{program.snrMgrName}</span>
                            </li>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">mail</span>
                                <span>담당자 이메일</span>
                                <span>{program.snrMgrEmail}</span>
                            </li>
                            <li className={styles.pgDItem}>
                                <span className="material-symbols-outlined">calendar_month</span>
                                <span>참여기간</span>
                                <span>{program.snrStartedAt.split('T')[0]} ~ {program.snrEndedAt.split('T')[0]}</span>
                            </li>
                        </ul>

                        <div className={styles.pgDContent}>
                            <div className={styles.pgDTxt}>{program.snrContent}</div>
                            <div className={styles.pgImages}>{renderImages()}</div>
                        </div>

                        <div className={styles.pgAttach}>
                            <span className={styles.pgAttachIcon}>첨부파일</span>
                            <ul className={styles.pgAttachList}>{renderAttachments()}</ul>{/* pgAttachList end */}
                        </div>{/* pgAttach end */}
                    </div>{/* .pgDetailTop end */}

                    <div className={styles.pgDetailBottom}>
                        <button onClick={handleMoveProgram}>목록</button>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>{/* .pgDetailBottom end */}
                </div>{/* .secContent end */}
            </section>{/* .pgRSection end */}
        </div>
    );
};

export default ProgramDetail;