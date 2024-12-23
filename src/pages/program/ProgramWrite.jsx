// src/pages/program/ProgramWrite.jsx
import React, { useRef, useState } from "react";
import styles from './ProgramWrite.module.css';
import SideBar from '../../components/common/SideBar';


const ProgramWrite = () => {
    const [files, setFiles] = useState([]); //전체 파일 상태
    const [imageFiles, setImageFiles] = useState([]);   //이미지 파일 상태
    const fileInputRef = useRef(null);  //파일 입력 참조

    //파일 추가 핸들러
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = files.length + selectedFiles.length;

        //파일 개수 제한 (최대 5개)
        if (totalFiles > 5) {
            alert('최대 5개의 파일만 업로드할 수 있습니다.');
            e.target.value = '';    //input 값 초기화
            return;
        }

        const newFiles = [];
        const newImages = [];

        //파일 분류 (이미지와 나머지)
        selectedFiles.forEach((file) => {
            newFiles.push(file);
            if (file.type.startsWith('image/')) {
                newImages.push(file);
            }
        });

        //파일 추가
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setImageFiles((prevImages) => [...prevImages, ...newImages]);
    };

    //파일 선택 버튼 클릭 핸들러
    const handleFileBtnClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();   //input[type="file"] 트리거
        }
    };

    //파일 삭제 핸들러
    const handleDeleteFile = (index) => {
        const fileToDelete = files[index];
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

        //이미지 파일인 경우, 이미지 리스트에서도 삭제
        if (fileToDelete.type.startsWith('image/')) {
            setImageFiles((prevImages) => prevImages.filter((image) => image.name != fileToDelete.name));
        }
    };

    //초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setFiles([]);   //파일 목록 초기화
        setImageFiles([]);  //이미지 파일 목록 초기화

        //파일 입력 필드 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.pgContainer}>
            <SideBar />
            <section className={styles.pgRSection}>
                <div className={styles.secTop}>
                    <p>어르신 프로그램 등록</p>
                </div>{/* .secTop end */}

                <div className={styles.secContent}>
                    <p className={styles.requiredTxt}>&#42;필수 항목입니다.</p>
                    <form onReset={handleReset}>
                        <div className={styles.pgBox}>
                            <label>기관명<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgName" id="snrOrgName" value={FormData.snrOrgName} required placeholder="기관명을 입력해 주세요"/>
                        </div>

                        <div className={styles.pgBox}>
                            <label>기관 전화번호<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrOrgPhone" id="snrOrgPhone" value={FormData.snrOrgPhone} required placeholder="예) 02-123-4567"/>
                        </div>
                        
                        <div className={styles.pgBox}>
                            <label>기관 이메일<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrOrgEmail" id="snrOrgEmail" value={FormData.snrOrgEmail} required placeholder="예) silverplus2024@hexalab.com"/>
                        </div>
                        
                        <div className={styles.pgBox}>
                            <label>기관 주소<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgAddress" id="snrOrgAddress" value={FormData.snrOrgAddress} required placeholder="예) 서울 서초구 서초대로 77길 41 4층"/>
                        </div>

                        <div className={styles.pgLine}></div>

                        <div className={styles.pgBox}>
                            <label>제 목<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrTitle" id="snrTitle" value={FormData.snrTitle} required placeholder="제목을 입력해 주세요"/>
                        </div>

                        <div className={styles.pgBox}>
                            <label>참여 기간<span className={styles.redTxt}>&#42;</span></label>
                            <div className={styles.pgDateWrap}>
                                <input type="date" name="snrStartedAt" id="snrStartedAt" value={FormData.snrStartedAt} required />
                                <span>~</span>
                                <input type="date" name="snrEndedAt" id="snrEndedAt" value={FormData.snrEndedAt} required />
                            </div>
                        </div>

                        <div className={styles.pgBox}>
                            <label>내 용<span className={styles.redTxt}>&#42;</span></label>
                            <textarea name="snrContent" id="snrContent" value={FormData.snrContent}></textarea>
                        </div>

                        {/* 첨부파일 */}
                        <div className={styles.pgFileWrap}>
                            <div className={styles.pgFileLeft}>
                                <p>첨부파일</p>
                                <button type="button" onClick={handleFileBtnClick} className={styles.fileBtn}>파일 선택</button>
                                <input type="file" ref={fileInputRef} multiple accept="*/*" onChange={handleFileChange} style={{display: "none"}} />

                                {/* 파일 목록 및 삭제 */}
                                <div className={styles.pgFileListContainer}>
                                    <p>목록</p>
                                    <ul className={styles.pgFileList}>
                                        {files.map((file, index) => (
                                            <li key={index} className={styles.pgfileItem}>
                                                <p>{file.name}</p>
                                                <button type="button" className={styles.pgDeleteBtn} onClick={() => handleDeleteFile(index)}>X삭제</button>
                                            </li>
                                        ))}
                                    </ul>{/* .pgFileList end */}
                                </div>
                            </div>{/* .pgFileLeft end */}
                            
                            {/* 사진 미리보기 */}
                            <div className={styles.pgFileRight}>
                                <p>사진 미리보기</p>
                                <div className={styles.pgPreviewContainer}>
                                    {imageFiles.map((file, index) => (
                                        <div key={index} className={styles.pgPrevItem}>
                                            <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className={styles.pgPrevImage} />
                                            <button type="button" className={styles.pgImgDeleteBtn} onClick={() => handleDeleteFile(files.indexOf(file))}>X</button>
                                        </div>
                                    ))}
                                </div>{/* .preImgContainer end */}
                            </div>{/* .pgFileRight end */}
                        </div>{/* .pgFileWrap end */}
                        
                        <div className={styles.pgBtnWrap}>
                            <input type="submit" value="등록하기" />
                            <input type="reset" value="초기화" />
                            <input type="button" value="이전 페이지" />
                        </div>{/* pgBtnWrap end */}
                    </form>
                </div>{/* .secContent end */}
            </section>
        </div>
    );
};

export default ProgramWrite;