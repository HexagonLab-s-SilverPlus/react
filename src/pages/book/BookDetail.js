import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BookDetail.module.css';
import SideBar from "../../components/common/SideBar";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";


const BookDetail = () => {

    const [book, setBook] = useState();
    const [fileName, setFileName] = useState();
    const [mimeType, setMimeType] = useState();
    const [fileContent, setFileContent] = useState();

    const [image, setImage] = useState(null);
    const {bookUUID} = useParams();

    const navigate = useNavigate();
    useEffect(() => {
        const loadBooks = async () => {
            try {
                const response = await apiSpringBoot.get(`/book/${bookUUID}`);
                setBook(response.data.book);
                console.log(response.data);
            } catch (error) {
                console.error('handleBookView Error:', error);
            }
            
        };

        loadBooks();
    }, []);

    return(
        <div className={styles.bkContainer}>
            <SideBar />
            <section className={styles.bkRSection}>
                <div className={styles.secTop}>
                    <p>전자책</p>
                </div>
    
                
                <div className={styles.bkBox}>
                    <label>제 목</label>
                    <span className={styles.redTxt}>뭐라카노~</span>
                </div>
                {/* 첨부파일 */}
                <div className={styles.bkFiles}>
                    <div className={styles.bkFilesSelect}>
                        <div className={styles.bkFileWrap}>
                            <div className={styles.bkFileLeft}>
                                <p className={styles.bkFileListContainer}>사진 이미지</p>
                                <div >
                                    {/* <p className={styles.bkFileList}>{book.bookImage}</p> */}
                                    <p className={styles.bkFileList}></p>
                                </div>
                            </div>{/* .bkFileLeft end */}              
                        </div>{/* .bkFileWrap end */}
                        
                        <div className={styles.bkFileWrap}>
                            <div className={styles.bkFileLeft}>
                                <p>책정보 파일</p>
                                <div>
                                    {/* <p className={styles.bkFileList}>{book.bookDetail}</p> */}
                                    <p className={styles.bkFileList}></p>
                                </div>
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
                    <input type="button" value="수 정" />
                    <input type="button" value="삭 제" />
                    <input type="button" value="이전 페이지" onClick={() => navigate(-1)} />
                </div>{/* bkBtnWrap end */}
            
            </section>
        </div>
    );
};

export default BookDetail;