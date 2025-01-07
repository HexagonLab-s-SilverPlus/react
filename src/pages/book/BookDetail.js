import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BookDetail.module.css';
import SideBar from "../../components/common/SideBar";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";


const BookDetail = () => {

    const [book, setBook] = useState();
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
                setMimeType(response.data.mimeType);
                setFileContent(response.data.fileContent);
                console.log(response.data);
            } catch (error) {
                console.error('handleBookView Error:', error);
            }
            
        };

        loadBooks();
    }, []);

    const handleDelete = async () => {
        if(window.confirm('책을 삭제하시겠습니까?')) {
            await apiSpringBoot.delete(`/book/${bookUUID}`);
            navigate(-1)
        }
    }

    const handleMoveUpdateView = (bookUUId) => {
        navigate(`/book/update/${bookUUId}`);
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
    
                
                <div className={styles.bkBox}>
                    <label>제 목</label>
                    <span className={styles.redTxt}>{book.bookTitle}</span>
                </div>
                {/* 첨부파일 */}
                <div className={styles.bkFiles}>
                    <div className={styles.bkFilesSelect}>
                        <div className={styles.bkFileWrap}>
                            <div className={styles.bkFileLeft}>
                                <p className={styles.bkFileListContainer}>사진 이미지</p>
                                <div >
                                    <p className={styles.bkFileList}>{book.bookImage}</p>
                                </div>
                            </div>{/* .bkFileLeft end */}              
                        </div>{/* .bkFileWrap end */}
                        
                        <div className={styles.bkFileWrap}>
                            <div className={styles.bkFileLeft}>
                                <p>책정보 파일</p>
                                <div>
                                    <p className={styles.bkFileList}>{book.bookDetail}</p>
                                </div>
                            </div>{/* .bkFileLeft end */}              
                        </div>{/* .bkFileWrap end */}
                    </div>

                    <div className={styles.bkFileRight}>
                        <div className={styles.bkPrevItem}>
                            <img src={`data:${mimeType};base64,${fileContent}`} className={styles.bkPrevImage} />
                        </div>
                    </div>
                </div>

                
                <div className={styles.bkBtnWrap}>
                    <input type="button" value="수 정" onClick={() => handleMoveUpdateView(bookUUID)} />
                    <input type="button" value="삭 제" onClick={handleDelete} />
                    <input type="button" value="이전 페이지" onClick={() => navigate(-1)} />
                </div>{/* bkBtnWrap end */}
            
            </section>
        </div>
    );
};

export default BookDetail;