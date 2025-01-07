import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './BookUpdate.module.css';
import SideBar from "../../components/common/SideBar";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";


const BookUpdate = () => {

    const [book, setBook] = useState();
    const [mimeType, setMimeType] = useState();
    const [fileContent, setFileContent] = useState();

    const {bookUUID} = useParams();

    //토큰정보 가져오기(AuthProvider)
    const { member } = useContext(AuthContext);
    const fileInputRef = useRef(null);  //파일 입력 참조
    const imageInputRef = useRef(null);  //파일 입력 참조
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [imageFiles, setImageFiles] = useState(null);   //이미지 파일 상태

    const[imageFileSelect, setImageFileSelect] = useState("파일 없음")
    const[fileSelect, setFileSelect] = useState("파일 없음")

    const navigate = useNavigate();

    //program
    const [formData, setFormData] = useState({
        bookCreateAt: "",
        bookCreatedBy: "",
        bookDetail: "",
        bookImage: "",
        bookNum: "",
        bookTitle: '',
        bookCreatedBy: "",
        bookUpdateAt: "",
        bookUpdatedBy: member.memUUID,
    });

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const response = await apiSpringBoot.get(`/book/${bookUUID}`);
                setBook(response.data.book);
                setMimeType(response.data.mimeType);
                setFileContent(response.data.fileContent);
                setImageFileSelect(response.data.book.bookImage);
                setFileSelect(response.data.book.bookDetail);
                console.log(response.data);
            } catch (error) {
                console.error('handleBookView Error:', error);
            }
            
        };

        loadBooks();
    }, []);

    //프로그램 수정하기
    const handleInsertProgram = async (e) => {
        e.preventDefault(); //submit 취소
        if(window.confirm('책을 수정하시겠습니까?')) {
            const data = new FormData();

            if (file){
                data.append('bookfile',file); // 첨부파일 추가
            }
            if (imageFiles){
                data.append('bookimage',imageFiles); // 첨부파일 추가
            }
            Object.entries(formData).forEach(([key, value]) => data.append(key, value)); 
            
            try {
                await apiSpringBoot.put('/book', data,{
                    headers: {'Content-Type':'multipart/form-data',
                    }}
                );
                alert('Book 수정 성공');
                // 게시글 수정이 성공되면 공지 목록 페이지로 이동
                navigate('/book');
            } catch (error) {
                console.error('Book 수정 실패', error);
                alert('새 게시글 수정 실패');
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
        if (window.confirm("수정을 취소하시겠습니까?")) {
            navigate(-1);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileSelect(e.target.files[0].name);
    };

    if (!book) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
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
                        <p className={styles.bkTitle}>전자책 수정</p>
                    </div>
                </div>
                <form onSubmit={handleInsertProgram} encType='multipart/form-data'>
                    <div className={styles.bkBox}>
                        <label>제 목</label>
                        <span className={styles.redTxt}>&#42;</span>
                        <input type="text" name="bookTitle" id="bookTitle" defaultValue={book.bookTitle} required onChange={handleChange} placeholder="제목을 입력해 주세요"/>
                    </div>
                    {/* 첨부파일 */}
                    <div className={styles.bkFiles}>
                        <div className={styles.bkFilesSelect}>
                            <div className={styles.bkFileWrap}>
                                <div className={styles.bkFileLeft}>
                                    <p className={styles.bkFileListContainer}>사진 이미지 수정</p>
                                    <div >
                                        <button type="button" onClick={handleImageBtnClick} className={styles.fileBtn}>파일 선택</button>               
                                        <p className={styles.bkFileList}>{imageFileSelect}</p>
                                    </div>
                                    <input type="file" ref={imageInputRef} multiple accept="*/*" onChange={handleImageChange} style={{display: "none"}} />
                                </div>{/* .bkFileLeft end */}              
                            </div>{/* .bkFileWrap end */}
                            
                            <div className={styles.bkFileWrap}>
                                <div className={styles.bkFileLeft}>
                                    <p>책정보 파일 수정</p>
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
                                {image ?
                                <img src={image} className={styles.bkPrevImage} />
                                : <img src={`data:${mimeType};base64,${fileContent}`} className={styles.bkPrevImage} />}
                            </div>
                        </div>
                    </div>

                    
                    <div className={styles.bkBtnWrap}>
                        <input type="submit" value="수정하기" />
                        <input type="button" value="이전 페이지" onClick={handleMovePrev} />
                    </div>{/* bkBtnWrap end */}
                </form>
            </section>
        </div>
    );
};

export default BookUpdate;