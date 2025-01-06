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

    const navigate = useNavigate();

    //program
    const [formData, setFormData] = useState({
        bookTitle: '',
        bookCreatedBy: member.memUUID,
    });
    

    //초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setFormData(initialFormData); // formData 초기화
        setFile([]);   //파일 목록 초기화
        setImageFiles([]);  //이미지 파일 목록 초기화

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
                navigate('/book');
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
    const handleFileBtnClick = () => {
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
        setImageFiles(e.target.files[0]);

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // 파일을 읽어서 미리보기 이미지 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // 파일을 읽어 base64로 변환된 데이터 저장
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
                    <div className={styles.pgBox}>
                        <label>제 목<span className={styles.redTxt}>&#42;</span></label>
                        <input type="text" name="bookTitle" id="bookTitle" value={formData.snrTitle} required onChange={handleChange} placeholder="제목을 입력해 주세요"/>
                    </div>
                    {/* 첨부파일 */}
                    <div className={styles.pgFileWrap}>
                        <div className={styles.pgFileLeft}>
                            <p>사진 이미지 등록</p>
                            <button type="button" onClick={handleImageBtnClick} className={styles.fileBtn}>파일 선택</button>
                            <input type="file" ref={imageInputRef} multiple accept="*/*" onChange={handleImageChange} style={{display: "none"}} />
                        </div>{/* .pgFileLeft end */}              
                        <div className={styles.pgFileRight}>
                            <div className={styles.pgPrevItem}>
                                <img src={image} className={styles.pgPrevImage} />
                            </div>
                        </div>
                    </div>{/* .pgFileWrap end */}

                    <div className={styles.pgFileWrap}>
                        <div className={styles.pgFileLeft}>
                            <p>책정보 파일 등록</p>
                            <button type="button" onClick={handleFileBtnClick} className={styles.fileBtn}>파일 선택</button>
                            <input type="file" ref={fileInputRef} multiple accept="*/*" onChange={handleFileChange} style={{display: "none"}} />
                        </div>{/* .pgFileLeft end */}              
                    </div>{/* .pgFileWrap end */}
                    
                    <div className={styles.pgBtnWrap}>
                        <input type="submit" value="등록하기" />
                        <input type="reset" value="초기화" />
                    </div>{/* pgBtnWrap end */}
                </form>
            </section>
        </div>
    );
};

export default BookWrite;