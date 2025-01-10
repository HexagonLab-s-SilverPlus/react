import React, { useState, useEffect, useContext, useRef } from 'react';
import { apiSpringBoot } from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './FAQList.module.css';
import { AuthContext } from '../../AuthProvider';
import SeniorNavbar from '../../components/common/SeniorNavbar';
import SeniorFooter from '../../components/common/SeniorFooter';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';

const FAQList = () => {
    const { member, role } = useContext(AuthContext); // AuthProvider 에서 데이터 가져오기
    const [faqList, setFAQList] = useState([]);
    const [openFAQ, setOpenFAQ] = useState(null); // 각 FAQ 항목의 열림 상태 관리 (각 항목에 대해 열림/닫힘을 관리)
    const [updateFAQ, setUpdateFAQ] = useState(null); 
    const [faq, setFAQ] = useState({
        faqTitle: "",
        faqContent: "",
    }); // 동적으로 입력 필드 관리
    const [isInsertPage, setIsInsertPage] = useState(false);
    const [isUpdatePage, setIsUpdatePage] = useState(false);
    const [isInsert, setIsInsert] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [readContent, setReadContent] =useState(null);

    const listRef = useRef(null);   // 스크롤 이동용
        const [pagingInfo, setPagingInfo] = useState({
            pageNumber:1,
            pageSize:10,
            maxPage:1,
            startPage:1,
            endPage:1,
            listCount:1,
        });

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
        
        return `${year}년 ${month}월 ${day}일`;
    };
    
      
      // FAQ 항목 클릭 시 해당 항목 열기/닫기 처리
    const toggleFAQ = (index, faqContent) => {
        setReadContent(() => (openFAQ === index ? null :faqContent));
        setOpenFAQ((prev) => (isInsertPage || isUpdatePage ? null :(prev === index ? null : index))); // 이미 열려있으면 닫고, 아니면 열기
    };

    const handleUpdateFAQ = (index, title, content) => {
        setUpdateFAQ(index);
        setIsUpdatePage(true);
        setFAQ((pre) => ({
            ...pre,
            faqTitle: title,
            faqContent: content
        }));
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
                headers: { 'Content-Type': 'application/json' },
            });
        alert('FAQ 등록 성공');
        handleFAQView(pagingInfo.pageNumber);
        } catch (error) {
        console.error('FAQ 등록 실패', error);
        alert('FAQ 등록 실패');
        } finally{
            setIsInsertPage(false);
            setIsInsert(false)
        }
    };


    const handleFAQView = async (page = 1) => {
        try {
            const response = await apiSpringBoot.get('/faq',{
                headers: { 'Content-Type': 'application/json' },
                params: {
                    ...pagingInfo,
                    pageNumber: page
                }
            });
            setFAQList(response.data.list);
            const {maxPage, startPage, endPage} = PagingCalculate(response.data.search.pageNumber, 
                                                            response.data.search.listCount, response.data.search.pageSize);
            setPagingInfo((pre) => ({
                ...pre,
                pageNumber: response.data.search.pageNumber,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
            }));

            console.log(JSON.stringify(response.data.list));
        } catch {
            console.error('qna 뷰 불러오기 실패', error);
        }
    };

    const handlePageChange = (page) => {          // 페이지 눌렀을때 뷰 바꾸기
        setPagingInfo((pre) => ({...pre, pageNumber: page}));  
        setOpenFAQ(null);
        setIsInsertPage(false);
        setOpenFAQ(null)
        handleFAQView(page);
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCreateFAQ = () => {
        setIsInsertPage(true);
        setOpenFAQ(null);
    };
    useEffect (() => {
        if (listRef.current && isInsertPage) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        }
    },[isInsertPage]);

    const handleFAQCancel = () => {
        if(window.confirm('정말 취소하시겠습니까?')){
            setIsInsertPage(false);
        }
    };

    const handleUpdateDataSet = (faqId) => {
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
            handleFAQView(pagingInfo.pageNumber);
        } catch {
            alert("FAQ 수정 실패");
            console.error('FAQ 삭제 실패', error);
        }finally{
            setIsUpdate(false);
            setIsUpdatePage(false);
        }
    };

    const handleFAQUpdateCancel = () => {
        if(window.confirm('정말 취소하시겠습니까?')){
            setIsUpdatePage(false);
            setUpdateFAQ(null);
        }
    };

    const handleDelete = async (uuid) => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            try{
                await apiSpringBoot.delete(`/faq/${uuid}`);
                alert("FAQ 삭제 성공");
                setOpenFAQ(null);
                handleFAQView(pagingInfo.pageNumber);
            } catch {
                alert("FAQ 삭제 실패");
                console.error('FAQ 삭제 실패', error);
            }
        }
    };

    useEffect (() => {
        handleFAQView(pagingInfo.pageNumber );
        if(isInsert){
            handleFAQInsert();
        }
        if(isUpdate){
            handleFAQUpdate();
        }
    },[isInsertPage, faq]);


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
                            <>
                                <div>
                                    <div className={styles.object} onClick={() => toggleFAQ(index, faqOne.faqContent)}>
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
                                </div>
                                <div className={`${styles.objectAnswer} ${openFAQ === index ? styles.open : ''}`}>
                                        {faqOne.faqContent}  
                                </div>
                            </>
                            ))}
                            <div id="read" style={{display: "none"}}>{readContent}</div>
                            <Paging 
                                pageNumber={pagingInfo.pageNumber }
                                listCount={pagingInfo.listCount}
                                maxPage={pagingInfo.maxPage}
                                startPage={pagingInfo.startPage }
                                endPage={pagingInfo.endPage}
                                onPageChange={(page) => handlePageChange(page)}
                            />
                            <div className={styles.marginBottom}></div> 
                        </div>

                    </div>
                </section>    
                {/*Footer*/}
                <SeniorFooter />
            </div>
        );
    } else {
        return (
            <div className={styles.all} ref={listRef}>
                <div >
                <SideBar />
                <div className={styles.faqContent}>
                    <QNAHeader text="FAQ" />
                    {role === "ADMIN" ? <button className={styles.faqInputBTN} onClick={handleCreateFAQ}>등 록</button>: <div className={styles.faqNAInputBTN} />}
                    {faqList.map((faqOne, index) => (
                    <div key={index}  >
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
                            {role==="ADMIN" && <>
                            <button className={styles.faqUpdateBTN} onClick={() => handleUpdateFAQ(index, faqOne.faqTitle, faqOne.faqContent)}>수 정</button>
                            <button className={styles.faqDeleteBTN} onClick={() => handleDelete(faqOne.faqId)}>삭 제</button></>}
                        </div>
                        </> 
                        : <div className={styles.faqDiv}>
                            <p>[질문]</p>
                            <textarea name="faqTitle" defaultValue={faqOne.faqTitle} onChange={handleChange} />
                            <p>[답변]</p>
                            <textarea name="faqContent" defaultValue={faqOne.faqContent} onChange={handleChange} />
                            <button className={styles.faqInsertBTN} onClick={() => handleUpdateDataSet(faqOne.faqId)}>수 정</button>
                            <button className={styles.faqInsertCancelBTN} onClick={handleFAQUpdateCancel}>취 소 </button>
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
                        <button className={styles.faqInsertCancelBTN} onClick={handleFAQCancel}>
                        취 소
                        </button>
                    </div>
                    )}
                    <div className={styles.marginBottom}></div> 
                    <Paging 
                        pageNumber={pagingInfo.pageNumber }
                        listCount={pagingInfo.listCount}
                        maxPage={pagingInfo.maxPage}
                        startPage={pagingInfo.startPage }
                        endPage={pagingInfo.endPage}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                    <div className={styles.marginBottom}></div> 
                </div>
                </div>
            </div>
        );
    }
};

export default FAQList;
