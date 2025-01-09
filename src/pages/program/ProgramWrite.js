// src/pages/program/ProgramWrite.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramWrite.module.css';
import SideBar from '../../components/common/SideBar';


const ProgramWrite = () => {
    //토큰정보 가져오기(AuthProvider)
    const { member, memId } = useContext(AuthContext);

    const [files, setFiles] = useState([]); //전체 파일 상태
    const [imageFiles, setImageFiles] = useState([]);   //이미지 파일 상태
    const fileInputRef = useRef(null);  //파일 입력 참조

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
    });


    //페이지 로딩시 memId 등록자에 넣기
    useEffect(() => {
        // console.log('userName : ' + memId + ', memUUID : ' + member.memUUID);
        setFormData((prevFormData) => ({
            ...prevFormData,
            snrCreatedBy: member.memUUID,
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value, }));
    };

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

    //초기 상태 정의
    const initialFormData = {
        snrOrgName: '',
        snrOrgPhone: '',
        snrMgrEmail: '',
        snrOrgAddress: '',
        snrTitle: '',
        snrStartedAt: '',
        snrEndedAt: '',
        snrContent: '',
        snrMgrName: '',
        snrCreatedBy: member.memUUID, // 초기값 유지
    };

    //초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setFormData(initialFormData); // formData 초기화
        setFiles([]);   //파일 목록 초기화
        setImageFiles([]);  //이미지 파일 목록 초기화

        //파일 입력 필드 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    //이전페이지 이동
    const handleMovePrev = (e) => {
        e.preventDefault(); //submit 취소
        if (window.confirm("등록을 취소하시겠습니까?")) {
            navigate(-1);
        }
    };

    //프로그램 등록하기
    const handleInsertProgram = async (e) => {
        e.preventDefault(); //submit 취소
        if (window.confirm('프로그램을 등록하시겠습니까?')) {
            const data = new FormData();
            const convertToTimestamp = (dateString) => {
                // '2024-12-24' 형식을 '2024-12-24 00:00:00'으로 변환
                return `${dateString} 00:00:00`;
            };

            // FormData에 입력값 추가
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'snrStartedAt' || key === 'snrEndedAt') {
                    data.append(key, convertToTimestamp(value)); // 'yyyy-MM-dd HH:mm:ss' 형식으로 변환
                } else {
                    data.append(key, value);
                }
            });

            // console.log('snrTitle : ', data.get('snrTitle'));

            if (files) {
                files.forEach((file) => {
                    data.append('files', file);  //첨부파일 추가
                });
            }
            // console.log('files : ', data.getAll('files'));

            //data 확인용
            // for (let [key, value] of data.entries()) {
            //     console.log(`${key} : ${value.name||value}`);
            // }

            try {
                await apiSpringBoot.post('/program', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                alert('프로그램 등록에 성공하였습니다.');
                navigate('/program');
            } catch (error) {
                // console.error('프로그램 등록 실패 : ', error);
                alert('프로그램 등록에 실패하였습니다. 관리자에게 문의하세요.')
            }
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
                    <form onReset={handleReset} onSubmit={handleInsertProgram} encType='multipart/form-data'>
                        <div className={styles.pgBox}>
                            <label>기관명<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgName" id="snrOrgName" value={FormData.snrOrgName} required onChange={handleChange} placeholder="기관명을 입력해 주세요" />
                        </div>

                        <div className={styles.pgBox}>
                            <label>기관 전화번호<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrOrgPhone" id="snrOrgPhone" value={formData.snrOrgPhone} required onChange={handleChange} placeholder="예) 02-123-4567" />
                        </div>

                        <div className={styles.pgBox}>
                            <label>기관 주소<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrOrgAddress" id="snrOrgAddress" value={formData.snrOrgAddress} required onChange={handleChange} placeholder="예) 서울 서초구 서초대로 77길 41 4층" />
                        </div>

                        <div className={styles.pgBox}>
                            <label>담당자명<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrMgrName" id="snrMgrName" value={formData.snrMgrName} required onChange={handleChange} placeholder="프로그램 담당자명을 입력해 주세요" />
                        </div>

                        <div className={styles.pgBox}>
                            <label>담당자 이메일<span className={styles.redTxt}>&#42;</span></label>
                            <input type="tel" name="snrMgrEmail" id="snrMgrEmail" value={formData.snrMgrEmail} required onChange={handleChange} placeholder="예) silverplus2024@hexalab.com" />
                        </div>

                        <div className={styles.pgLine}></div>

                        <div className={styles.pgBox}>
                            <label>제 목<span className={styles.redTxt}>&#42;</span></label>
                            <input type="text" name="snrTitle" id="snrTitle" value={formData.snrTitle} required onChange={handleChange} placeholder="제목을 입력해 주세요" />
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
                            <textarea name="snrContent" id="snrContent" value={FormData.snrContent} onChange={handleChange}></textarea>
                        </div>

                        {/* 첨부파일 */}
                        <div className={styles.pgFileWrap}>
                            <div className={styles.pgFileLeft}>
                                <p>첨부파일</p>
                                <button type="button" onClick={handleFileBtnClick} className={styles.fileBtn}>파일 선택</button>
                                <input type="file" ref={fileInputRef} multiple accept="*/*" onChange={handleFileChange} style={{ display: "none" }} />

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
                            <input type="button" value="이전 페이지" onClick={handleMovePrev} />
                        </div>{/* pgBtnWrap end */}
                    </form>
                </div>{/* .secContent end */}
            </section>
        </div>
    );
};

export default ProgramWrite;