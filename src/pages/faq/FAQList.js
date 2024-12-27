import React, { useState, useEffect, useContext } from 'react';
import { apiSpringBoot } from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './FAQList.module.css';
import { AuthContext } from '../../AuthProvider';

const FAQList = () => {
    const { member } = useContext(AuthContext); // AuthProvider 에서 데이터 가져오기
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

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFAQ((prev) => ({
            ...prev,
            [name]: value
        }));
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

    if (!member) {
        return <div>Loading...</div>; // 로그인 정보가 없으면 로딩 화면
    };

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
};

export default FAQList;
