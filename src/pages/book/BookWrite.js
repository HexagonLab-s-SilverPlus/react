import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './BookWrite.module.css';
import SideBar from "../../components/common/SideBar";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";


const BookWrite = () => {

    //토큰정보 가져오기(AuthProvider)
    const { member } = useContext(AuthContext);
    const fileInputRef = useRef(null);  //파일 입력 참조
    const imageInputRef = useRef(null);  //파일 입력 참조
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [imageFiles, setImageFiles] = useState(null);   //이미지 파일 상태

    const[imageFileSelect, setImageFileSelect] = useState("파일 없음");
    const[fileSelect, setFileSelect] = useState("파일 없음");
    const[fileContent, setFileContent] = useState(null);

    const navigate = useNavigate();

    //program
    const [formData, setFormData] = useState({
        bookTitle: '',
        bookCreatedBy: member.memUUID,
    });
    
    const initialFormData = ({
        bookTitle: '',
        bookCreatedBy: member.memUUID,
    });
    
    

    //초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setFormData(initialFormData); // formData 초기화
        setFile(null);   //파일 목록 초기화
        setFileSelect("파일 없음");
        setImage(null);
        setImageFiles(null);  //이미지 파일 목록 초기화
        setImageFileSelect("파일 없음");

        //파일 입력 필드 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    //프로그램 등록하기
    const handleInsertProgram = async (e) => {
        e.preventDefault(); //submit 취소
        if(window.confirm('책을 등록하시겠습니까?')) {
            const data = new FormData();

            if (file){
                data.append('bookfile',file); // 첨부파일 추가
            }
            if (imageFiles){
                data.append('bookimage',imageFiles); // 첨부파일 추가
            }
            Object.entries(formData).forEach(([key, value]) => data.append(key, value)); 
            
            try {
                await apiSpringBoot.post('/book', data,{
                    headers: {'Content-Type':'multipart/form-data',
                    }}
                );
                alert('Book 등록 성공');
                // 게시글 등록이 성공되면 공지 목록 페이지로 이동
                navigate('/bookRouter/book');
            } catch (error) {
                console.error('Book 등록 실패', error);
                alert('새 게시글 등록 실패');
            }
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name] : value,}));
    };

    //파일 선택 버튼 클릭 핸들러
    const handleFileBtnClick = (e) => {
        if (fileInputRef.current) {
            fileInputRef.current.click();   //input[type="file"] 트리거
        }
    };

    const handleImageBtnClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();   //input[type="file"] 트리거
        }
    };

    const handleImageChange = (e) => {
        const selectedImageFile = e.target.files[0];
        if(selectedImageFile){
            setImageFiles(selectedImageFile);
            setImageFileSelect(selectedImageFile.name);
            if (selectedImageFile) {
                // 파일을 읽어서 미리보기 이미지 생성
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result); // 파일을 읽어 base64로 변환된 데이터 저장
                };
                reader.readAsDataURL(selectedImageFile);
            }
        }
    };
    
    //이전페이지 이동
    const handleMovePrev = (e) => {
        e.preventDefault(); //submit 취소
        if (window.confirm("등록을 취소하시겠습니까?")) {
            navigate(-1);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileSelect(file.name);
    };

    return(
        <div className={styles.bkContainer}>
            <SideBar />
            <section className={styles.bkRSection}>
                <div className={styles.secTop}>
                    <p>전자책</p>
                </div>
                <div className={styles.secContent}>
                    <div className={styles.bkListTop}>
                        <p className={styles.bkTitle}>전자책 등록</p>
                    </div>
                </div>
                <form onReset={handleReset} onSubmit={handleInsertProgram} encType='multipart/form-data'>
                    <div className={styles.bkBox}>
                        <label>제 목</label>
                        <span className={styles.redTxt}>&#42;</span>
                        <input type="text" name="bookTitle" id="bookTitle" required onChange={handleChange} placeholder="제목을 입력해 주세요"/>
                    </div>
                    {/* 첨부파일 */}
                    <div className={styles.bkFiles}>
                        <div className={styles.bkFilesSelect}>
                            <div className={styles.bkFileWrap}>
                                <div className={styles.bkFileLeft}>
                                    <p className={styles.bkFileListContainer}>사진 이미지 등록</p>
                                    <div >
                                        <button type="button" onClick={handleImageBtnClick} className={styles.fileBtn}>파일 선택</button>               
                                        <p className={styles.bkFileList}>{imageFileSelect}</p>
                                    </div>
                                    <input type="file" ref={imageInputRef} multiple accept="*/*" onChange={handleImageChange} style={{display: "none"}} />
                                </div>{/* .bkFileLeft end */}              
                            </div>{/* .bkFileWrap end */}
                            
                            <div className={styles.bkFileWrap}>
                                <div className={styles.bkFileLeft}>
                                    <p>책정보 파일 등록</p>
                                    <div>
                                        <button type="button" onClick={handleFileBtnClick} className={styles.fileBtn}>파일 선택</button>
                                        <p className={styles.bkFileList}>{fileSelect}</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} multiple accept="*/*" onChange={handleFileChange} style={{display: "none"}} />
                                </div>{/* .bkFileLeft end */}              
                            </div>{/* .bkFileWrap end */}
                        </div>

                        <div className={styles.bkFileRight}>
                            <div className={styles.bkPrevItem}>
                                <img src={image} className={styles.bkPrevImage} />
                            </div>
                        </div>
                    </div>

                    
                    <div className={styles.bkBtnWrap}>
                        <input type="submit" value="등록하기" />
                        <input type="reset" value="초기화" />
                        <input type="button" value="이전 페이지" onClick={handleMovePrev} />
                    </div>{/* bkBtnWrap end */}
                </form>
            </section>
        </div>
    );
};

export default BookWrite;