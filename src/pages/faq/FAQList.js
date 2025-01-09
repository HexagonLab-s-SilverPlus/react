import React, { useState, useEffect, useContext, useRef } from 'react';
import { apiSpringBoot } from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './FAQList.module.css';
import { AuthContext } from '../../AuthProvider';
import SeniorNavbar from '../../components/common/SeniorNavbar';
import SeniorFooter from '../../components/common/SeniorFooter';

const FAQList = () => {
    const { member, role } = useContext(AuthContext); // AuthProvider 에서 데이터 가져오기
    const [faqList, setFAQList] = useState([]);
    const [openFAQ, setOpenFAQ] = useState(null); // 각 FAQ 항목의 열림 상태 관리 (각 항목에 대해 열림/닫힘을 관리)
    const [updateFAQ, setUpdateFAQ] = useState(null); 
    const [faq, setFAQ] = useState({
        faqTitle: "",
        faqContent: "",
    }); // 동적으로 입력 필드 관리
    const [isInsertPage, setIsInsertPage] = useState(false)
    const [isInsert, setIsInsert] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const listRef = useRef(null);   // 스크롤 이동용
    const textareaRefs = useRef([]);  // 각 FAQ에 대해 ref 배열을 관리

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFAQ((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const formatDate = (oDate) => {     // 데이터 포멧(우리나라 시간으로)
        const date = new Date(oDate);
        
        // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
        const year = date.getFullYear();
        const month = date.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더해야 합니다.
        const day = date.getDate();
        
        return `${year}-${month}-${day}`;
    };
    
      
      // FAQ 항목 클릭 시 해당 항목 열기/닫기 처리
    const toggleFAQ = (index) => {
        setOpenFAQ((prev) => (isInsertPage ? null :(prev === index ? null : index))); // 이미 열려있으면 닫고, 아니면 열기
        console.log(openFAQ);
    };

    const toggleUpdateFAQ = (index) => {
        setUpdateFAQ(index);
        console.log(updateFAQ);
    };

    const handleFAQInsertDateSet = () => {
        setFAQ((pre) => ({
            ...pre,
            faqCreatedBy: member.memUUID,
            faqUpdatedBy: member.memUUID
        }));
        setIsInsert(true)
    };

    const handleFAQInsert = async () => {
        console.info("faqInser : " + JSON.stringify(faq));
        try {
            await apiSpringBoot.post('/faq', faq, {
                headers: { 'Content-Type': 'application/json' }
            });
        alert('FAQ 등록 성공');
        handleFAQView();
        } catch (error) {
        console.error('게시글 등록 실패', error);
        alert('새 게시글 등록 실패');
        } finally{
            setIsInsertPage(false);
            setIsInsert(false)
        }
    };


    const handleFAQView = async () => {
        try {
            const response = await apiSpringBoot.get('/faq',{
                headers: { 'Content-Type': 'application/json' }
            });
            setFAQList(response.data);
            console.log(JSON.stringify(response.data));
        } catch {
            console.error('qna 뷰 불러오기 실패', error);
        }
    };

    const handleCreateFAQ = () => {
        setIsInsertPage(true);
        setOpenFAQ(null);
    };

    const handleFAQCancel = () => {
        setIsInsertPage(false);
    };

    const handleUpdateDateSet = (faqId) => {
        setFAQ((pre) => ({
            ...pre,
            faqId: faqId,
            faqUpdatedBy: member.memUUID
        }));
        setIsUpdate(true);
    };

    const handleFAQUpdate = async () => {
        try{
            await apiSpringBoot.put(`/faq`, faq, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert("FAQ 수정 성공");
            setOpenFAQ(null);
            setUpdateFAQ(null);
            handleFAQView();
        } catch {
            alert("FAQ 수정 실패");
            console.error('FAQ 삭제 실패', error);
        }finally{
            setIsUpdate(false);
        }
    };

    const handleFAQUpdateCancel = () => {
        setUpdateFAQ(null);
    };

    const handleDelete = async (uuid) => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            try{
                await apiSpringBoot.delete(`/faq/${uuid}`);
                alert("FAQ 삭제 성공");
                setOpenFAQ(null);
                handleFAQView();
            } catch {
                alert("FAQ 삭제 실패");
                console.error('FAQ 삭제 실패', error);
            }
        }
    };

    useEffect (() => {
        handleFAQView();
        if(isInsert){
            handleFAQInsert();
        }
        if(isUpdate){
            handleFAQUpdate();
        }
    },[isInsertPage, faq]);

    // 최초 렌더링 시 자동 크기 조정
    useEffect(() => {
        // FAQ 내용이 있을 때 자동 크기 조정
        textareaRefs.current.forEach((textarea, index) => {
            if (textarea && openFAQ === index) {
                autoResize(textarea);
            }
        });
    }, [faqList]); // faqList가 변경될 때마다 실행

    // 자동 크기 조정 함수
    const autoResize = (textarea) => {
        textarea.style.height = 'auto';  // 크기 초기화
        textarea.style.height = `${textarea.scrollHeight}px`;  // scrollHeight에 맞게 높이 조정
    };

    if (!member) {
        return <div>Loading...</div>; // 로그인 정보가 없으면 로딩 화면
        
    };
    if(role ==="SENIOR"){

        return (
            <div className={styles.faqList}>
                {/* 헤더 */}
                <SeniorNavbar/>
                <section className={styles.faqListBody}>
                    <div className={styles.faqLeftMenu}>
                        <div className={styles.menuName} >FAQ</div>
                    </div>
                    <div className={styles.faqRightMenu}>
                        {/* 리스트 출력 */}
                        <div className={styles.list} ref={listRef}>
                        {faqList.map((faqOne, index) =>(
                            <div>
                                <div className={styles.object} onClick={() => toggleFAQ(index)}>
                                    <div className={styles.title}>
                                        {faqOne.faqTitle}
                                    </div>
                                    <div className={styles.message}>
                                        <div className={styles.messagement}>
                                            내용이 궁금하면 클릭해보세요!
                                        </div>
                                        <div className={styles.message}>
                                            <div className={styles.date}>
                                                등록일 &nbsp; {formatDate(faqOne.faqUpdatedAt)}
                                            </div> &nbsp;&nbsp;&nbsp;
                                        </div>
                                    </div>
                                </div>
                              
                                <textarea 
                                ref={(el) => (textareaRefs.current[index] = el)} // 각 FAQ에 고유한 ref 할당
                                onInput={(e) => autoResize(e.target)} // 입력 시 크기 조정
                                defaultValue={faqOne.faqContent} 
                                className={`${styles.objectAnswer} ${openFAQ === index ? styles.open : ''}`} 
                                readOnly 
                                disabled
                                id="read"/> 
                         
                            </div>
                            ))}
                        {/* <div className={styles.faqPaging}>
                                <Paging 
                                    currentPag={pagingInfo.pageNumber || 1}
                                    maxPage={pagingInfo.maxPage || 1}
                                    startPage={pagingInfo.startPage || 1}
                                    endPage={pagingInfo.endPage || 1}
                                    onPageChange={(page) => handleUpdateView(page)}
                                />
                        </div> */}
                        </div>

                    </div>
                </section>    
                {/*Footer*/}
                <SeniorFooter />
            </div>
        );
    } else {
        return (
            <div>
                <SideBar />
                <div className={styles.faqContent}>
                    <QNAHeader text="FAQ" />
                    <button className={styles.faqInputBTN} onClick={handleCreateFAQ}>등 록</button>
                    {faqList.map((faqOne, index) => (
                    <div key={index}>
                        {!(updateFAQ === index) ?
                        <><div
                            className={styles.faqRequest}
                            onClick={() => toggleFAQ(index)} // 클릭 시 열리도록 토글
                            >
                            <p>[질문]</p>
                            <p>{faqOne.faqTitle}</p>
                        </div>

                        <div
                            className={`${styles.faqAnswer} ${openFAQ === index ? styles.open : ''}`}
                            >
                            <p>[답변]</p>
                            <p className={styles.faqAnswerP}>{faqOne.faqContent}</p>
                            <button className={styles.faqUpdateBTN} onClick={() => toggleUpdateFAQ(index)}>수 정</button>
                            <button className={styles.faqDeleteBTN} onClick={() => handleDelete(faqOne.faqId)}>삭 제</button>
                        </div></> 
                        : <div className={styles.faqDiv}>
                            <p>[질문]</p>
                            <textarea name="faqTitle" defaultValue={faqOne.faqTitle} onChange={handleChange} />
                            <p>[답변]</p>
                            <textarea name="faqContent" defaultValue={faqOne.faqContent} onChange={handleChange} />
                            <button className={styles.faqInsertBTN} onClick={() => handleUpdateDateSet(faqOne.faqId)}>수 정</button>
                            <button className={styles.faqInsertBTN} onClick={handleFAQUpdateCancel}>취 소 </button>
                        </div>
                        }
                    </div>
                    ))}

                    {isInsertPage && (
                    <div className={styles.faqDiv}>
                        <p>[질문]</p>
                        <textarea name="faqTitle" onChange={handleChange} />
                        <p>[답변]</p>
                        <textarea name="faqContent" onChange={handleChange} />
                        <button className={styles.faqInsertBTN} onClick={handleFAQInsertDateSet}>
                        추 가
                        </button>
                        <button className={styles.faqInsertBTN} onClick={handleFAQCancel}>
                        취 소
                        </button>
                    </div>
                    )}
                </div>
            </div>
        );
    }
};

export default FAQList;
