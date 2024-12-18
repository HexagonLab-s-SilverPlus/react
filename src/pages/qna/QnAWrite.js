import React, {useState, use} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QnAWrite = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        qnaTitle: null,       // 제목
        qnaWCreateBy: "ai-uuid-1234-5678-90ab-cdef12345678",   // 질문자 
        qnaWContent: null,    // 질문내용
        qnaADContent: null,    // 답변내용
        qnaADCreateBy: null,  // 답변자
        qnaADUpdateBy: null,  // 답변자(수정)
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)
    
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        // if(file){
        //     data.append('ofile', file); // 첨부파일 추가
        // }
        
        try {
            await axios.post('http://localhost:8080/qna', data);
            alert('QnA 등록 성공');
            // 게시글 등록이 성공되면 공지 목록 페이지로 이동
            navigate('/qna');
        } catch (error) {
            console.error('게시글 등록 실패', error);
            alert('새 게시글 등록 실패');
        }
    };

    return (
        <div>
            <form 
            onSubmit={handleSubmit} 
            encType="multipart/form-data">
                <table>
                    <tr>
                        <th>제 목</th>
                        <input type="text" name="qnaTitle" onChange={handleChange}></input>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <input type="text" name="qnaWCreateBy" value={formData.qnaWCreateBy} onChange={handleChange}></input>
                    </tr>
                    <tr>
                        <th>질문내용</th>
                        <input type="text" name="qnaWContent" onChange={handleChange}></input>
                    </tr>
                    <input type='submit' value="등록하기" />
                </table>
            </form>            
        </div>
    );
}
export default QnAWrite;


