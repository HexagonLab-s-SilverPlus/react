// src/pages/program/ProgramWrite.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramUpdate.module.css';
import SideBar from '../../components/common/SideBar';

const ProgramUpdate = () => {
    //토큰정보 가져오기(AuthProvider)
    const { member, memId } = useContext(AuthContext);
    const { snrProgramId } = useParams();
    //navigate
    const navigate = useNavigate();

    //program
    const [formData, setFormData] = useState({
        snrOrgName: '',
        snrOrgPhone: '',
        snrMgrEmail: '',
        snrOrgAddress: '',
        snrTitle: '',
        snrStartedAt: '',
        snrEndedAt: '',
        snrContent: '',
        snrMgrName: '',
        snrCreatedBy: '',
        snrUpdatedBy: '',
    });
    const [files, setFiles] = useState([]); //전체 파일 상태
    const [newFiles, setNewFiles] = useState([]); // 새로 추가된 파일 상태
    const [deleteFileIds, setDeleteFileIds] = useState([]); // 삭제할 파일 ID
    const [imageFiles, setImageFiles] = useState([]);   //이미지 파일 상태

    const [originalFormData, setOriginalFormData] = useState(null); //초기 데이터 상태
    const [originalFiles, setOriginalFiles] = useState([]); //초기 파일 상태
    const fileInputRef = useRef(null);  //파일 입력 참조

    const formatDate = (w) => {     // 데이터 포멧(우리나라 시간으로)
        const date = new Date(w);
      
        // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
        const year = date.getFullYear();
        const month = date.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더해야 합니다.
        const day = date.getDate();
      
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchProgramData = async () => {
            try {
                const response = await apiSpringBoot.get(`/program/detail/${snrProgramId}`);
                const programData = response.data.program;
                // const loadedFiles = response.data.files || [];
                const loadedFiles = response.data.files?.map((file) => ({
                    ...file,
                    fileId: file.fileId || null, // fileId가 없으면 null로 설정
                })) || [];
                
                const loadedFormData = {
                    snrOrgName: programData.snrOrgName || '',
                    snrOrgPhone: programData.snrOrgPhone || '',
                    snrMgrEmail: programData.snrMgrEmail || '',
                    snrOrgAddress: programData.snrOrgAddress || '',
                    snrTitle: programData.snrTitle || '',
                    snrStartedAt: formatDate(programData.snrStartedAt),
                    snrEndedAt: formatDate(programData.snrEndedAt),
                    snrContent: programData.snrContent || '',
                    snrMgrName: programData.snrMgrName || '',
                    snrCreatedBy: member.memUUID,
                    snrUpdatedBy: member.memUUID,
                };
    
                
                // 상태 업데이트
                setFormData(loadedFormData);
                setFiles(loadedFiles);
    
                // 초기 상태 저장
                setOriginalFormData(loadedFormData);
                setOriginalFiles(loadedFiles);
            } catch (error) {
                console.error('fetchProgramData Error : ', error);
                alert('데이터를 불러오는 데 실패했습니다.');
            }
        };
    
        fetchProgramData();
    }, [snrProgramId, member.memUUID]);

    // files 상태 변경 시 imageFiles 업데이트
    useEffect(() => {
        const updatedImageFiles = files.filter(file =>
            file.type?.startsWith("image/") || file.mimeType?.startsWith("image/")
        );
        setImageFiles(updatedImageFiles);
    }, [files]);

    //input 값 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name] : value,}));
    };

    //파일 추가 핸들러
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
            alert('최대 5개의 파일만 업로드할 수 있습니다.');
            e.target.value = '';
            return;
        }

        setFiles((prev) => {
            const updatedFiles = [...prev, ...selectedFiles];
            console.log("Updated files after addition:", updatedFiles);
            return updatedFiles;
        });
    
        setNewFiles((prev) => {
            const updatedNewFiles = [...prev, ...selectedFiles];
            console.log("Updated newFiles after addition:", updatedNewFiles);
            return updatedNewFiles;
        });
    };

    // 파일 삭제 핸들러
    const handleFileDelete = (index) => {
        console.log("Files state before deletion:", files); // 삭제 전 파일 상태
        console.log("Delete index:", index); // 삭제하려는 파일의 인덱스
    
        const fileToDelete = files[index];
        console.log("File to delete:", fileToDelete); // 삭제하려는 파일 데이터
    
        if (fileToDelete?.fileId) {
            // 기존 파일 삭제
            console.log("Deleting existing file:", fileToDelete.fileId);
            setDeleteFileIds((prev) => [...prev, fileToDelete.fileId]);
        } else if (fileToDelete instanceof File) {
            // 새로 추가된 파일 삭제
            console.log("Deleting newly added file:", fileToDelete.name);
            setNewFiles((prev) => prev.filter((file) => file !== fileToDelete));
        } else {
            console.error("Unknown file structure:", fileToDelete);
        }
    
        // `files` 상태에서 삭제
        setFiles((prev) => prev.filter((_, i) => i !== index));
    
        console.log("Files state after deletion:", files);
    };
    
    //초기화 버튼 클릭 핸들러
    const handleReset = () => {
        if (originalFormData && originalFiles) {
            setFormData(originalFormData);
            setFiles(originalFiles);
            setImageFiles(originalFiles.filter(file =>
                file.mimeType?.startsWith('image/')
            ));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    //이전페이지 이동
    const handleMovePrev = (e) => {
        e.preventDefault(); //submit 취소
        if (window.confirm("수정을 취소하시겠습니까?")) {
            navigate(-1);
        }
    };

    //프로그램 수정하기
    const handleSubmit = async (e) => {
        e.preventDefault(); //submit 취소
        if (window.confirm('프로그램을 수정하시겠습니까?')) {
            const data = new FormData();
            const convertToTimestamp = (dateString) => {
                // '2024-12-24' 형식을 '2024-12-24 00:00:00'으로 변환
                return `${dateString} 12:00:00`;
            };
            
            // FormData에 입력값 추가
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'snrStartedAt' || key === 'snrEndedAt') {
                    data.append(key, convertToTimestamp(value)); // 'yyyy-MM-dd HH:mm:ss' 형식으로 변환
                } else {
                    data.append(key, value);
                }
            }); 
            
            deleteFileIds.forEach(fileId => data.append('deleteFileIds', fileId));
            newFiles.forEach(file => data.append('files', file));

            console.log('FormData Entries:', Array.from(data.entries()));

            try {
                await apiSpringBoot.put(`/program/${snrProgramId}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('프로그램 수정에 성공하였습니다.');
                navigate(-1);
            } catch (error) {
                console.error('프로그램 수정 실패 : ', error);
                alert('프로그램 수정에 실패하였습니다. 관리자에게 문의하세요.');
            }
        }
    };
    
    return (
        <div className={styles.pgContainer}>
            <SideBar />
            <section className={styles.pgRSection}>
                <div className={styles.secTop}>
                    <p>어르신 프로그램 수정</p>
                </div>{/* .secTop end */}

                <div className={styles.secContent}>
                    <p className={styles.requiredTxt}>&#42;필수 항목입니다.</p>
                    <form onReset={handleReset} onSubmit={handleSubmit} encType='multipart/form-data'>
                        <div className={styles.pgBox}>
                            <label>기관명<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgName" id="snrOrgName" value={formData.snrOrgName} required onChange={handleChange} placeholder="기관명을 입력해 주세요"/>
                        </div>

                        <div className={styles.pgBox}>
                            <label>기관 전화번호<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrOrgPhone" id="snrOrgPhone" value={formData.snrOrgPhone} required onChange={handleChange} placeholder="예) 02-123-4567"/>
                        </div>
                        
                        <div className={styles.pgBox}>
                            <label>기관 주소<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgAddress" id="snrOrgAddress" value={formData.snrOrgAddress} required onChange={handleChange} placeholder="예) 서울 서초구 서초대로 77길 41 4층"/>
                        </div>

                        <div className={styles.pgBox}>
                            <label>담당자명<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrMgrName" id="snrMgrName" value={formData.snrMgrName} required onChange={handleChange} placeholder="프로그램 담당자명을 입력해 주세요"/>
                        </div>
                        
                        <div className={styles.pgBox}>
                            <label>담당자 이메일<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrMgrEmail" id="snrMgrEmail" value={formData.snrMgrEmail} required onChange={handleChange} placeholder="예) silverplus2024@hexalab.com"/>
                        </div>

                        <div className={styles.pgLine}></div>

                        <div className={styles.pgBox}>
                            <label>제 목<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrTitle" id="snrTitle" value={formData.snrTitle} required onChange={handleChange} placeholder="제목을 입력해 주세요"/>
                        </div>

                        <div className={styles.pgBox}>
                            <label>참여 기간<span className={styles.redTxt}>&#42;</span></label>
                            <div className={styles.pgDateWrap}>
                                <input type="date" name="snrStartedAt" id="snrStartedAt" value={formData.snrStartedAt} required onChange={handleChange} />
                                <span>~</span>
                                <input type="date" name="snrEndedAt" id="snrEndedAt" value={formData.snrEndedAt} required onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.pgBox}>
                            <label>내 용<span className={styles.redTxt}>&#42;</span></label>
                            <textarea name="snrContent" id="snrContent" value={formData.snrContent} onChange={handleChange}></textarea>
                        </div>

                        {/* 첨부파일 */}
                        <div className={styles.pgFileWrap}>
                            <div className={styles.pgFileLeft}>
                                <p>첨부파일</p>
                                <button type="button" onClick={() => fileInputRef.current.click()} className={styles.fileBtn}>파일 선택</button>
                                <input type="file" ref={fileInputRef} multiple accept="*/*" onChange={handleFileChange} style={{display: "none"}} />

                                {/* 파일 목록 및 삭제 */}
                                <div className={styles.pgFileListContainer}>
                                    <p>목록</p>
                                    <ul className={styles.pgFileList}>
                                        {files.map((file, index) => (
                                            <li key={index} className={styles.pgfileItem}>
                                                <p>{file.fileName || file.name}</p>
                                                <button type="button" className={styles.pgDeleteBtn} onClick={() => handleFileDelete(index)}>X삭제</button>
                                            </li>
                                        ))}
                                    </ul>{/* .pgFileList end */}
                                </div>
                            </div>{/* .pgFileLeft end */}
                            
                            {/* 사진 미리보기 */}
                            <div className={styles.pgFileRight}>
                                <p>사진 미리보기</p>
                                <div className={styles.pgPreviewContainer}>
                                    {imageFiles.map((file, index) => {
                                        // 파일 URL 생성
                                        const fileUrl = file instanceof File
                                            ? URL.createObjectURL(file) // 새로 추가된 파일
                                            : `data:${file.mimeType};base64,${file.fileContent}`; // 기존 업로드된 파일
                                        
                                        return (
                                            <div key={index} className={styles.pgPrevItem}>
                                                <img src={fileUrl} alt={`preview-${index}`} className={styles.pgPrevImage} />
                                                <button
                                                    type="button"
                                                    className={styles.pgImgDeleteBtn}
                                                    onClick={() => handleFileDelete(files.indexOf(file))}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>{/* .preImgContainer end */}
                            </div>{/* .pgFileRight end */}
                        </div>{/* .pgFileWrap end */}
                        
                        <div className={styles.pgBtnWrap}>
                            <input type="submit" value="수정하기" />
                            <input type="reset" value="초기화" />
                            <input type="button" value="이전 페이지" onClick={handleMovePrev} />
                        </div>{/* pgBtnWrap end */}
                    </form>
                </div>{/* .secContent end */}
            </section>
        </div>
    );
};

export default ProgramUpdate;