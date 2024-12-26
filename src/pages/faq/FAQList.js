import React,{ useState, useEffect, useContext } from 'react';
import {apiSpringBoot} from '../../utils/axios';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './FAQList.module.css';
import { AuthContext } from '../../AuthProvider';
import Paging from '../../components/common/Paging';


const FAQList = () => {
    const { member} = useContext(AuthContext);   // AuthProvider 에서 데이터 가져오기
    const [faqList, setFaqList] = useState({});                     // faqList 담을 상태훅
    const [inputs, setInputs] = useState([]);
    const [isInsert, setIsInsert] = useState(false);

    // const handleFAQView = async () => {   // 페이지 불러오기
    //     try{
    //         const response = await apiSpringBoot.get(`/faq/mylist`);
    //         setFaqList(response.data.faq);

    //     } catch (e){
    //         console.log("error : {}", e); 
    //     }    
    // }
    useEffect(() => {
        if (faqList.faqTitle) {
            console.info(faqList.faqTitle); // faqList.faqTitle의 최신 값
        }
    }, [faqList]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        
        setFaqList((prev) => ({
            ...prev,
            [name]: value
        }));
        // console.info(faqList.faqTitle);
    };

    const handleFAQInsert = async (e) => {
        console.info(faqList.faqTitle);
        try {
            await apiSpringBoot.post('/faq', faqList,{
                headers: {'Content-Type':'multipart/form-data',
                }}
            );
            alert('FAQ 등록 성공');
        } catch (error) {
            console.error('게시글 등록 실패', error);
            alert('새 게시글 등록 실패');
        }
    };
    const handleCreateFAQ = () => {
        
        setInputs((prev) => [
            ...prev,
            <div className={styles.faqDiv}>
                <p>[질문]</p>
                <textarea name="faqTitle" onChange={handleChange} />
                <p>[답변]</p>
                <textarea name='faqContent' onChange={handleChange} />
                <button className={styles.faqInsertBTN} onClick={handleFAQInsert}>추 가</button>
            </div>
        ]);
    };


    // useEffect(() => {             // 처음 뷰화면 출력
    //     if(member.memUUID){
    //         handleFAQView();
    //     }
    // }, []);

    if (!faqList || !member) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };

    return (
        <div>
        <SideBar />
            <div className={styles.faqContent}>
                <QNAHeader text="FAQ"/>
                <div className={styles.faqInsertdiv}>
                    <button className={styles.faqInputBTN} onClick={handleCreateFAQ}>등 록</button>
                </div>
                {/* 여러 개의 input 태그 렌더링 */}
                {inputs.map((input, index) => (
                <div key={index}>{input}</div>
                ))}
                
            </div>
        </div>
    );
};

export default FAQList;
