// src/pages/notice/Notice.js
import React,{useState,useEffect,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../../AuthProvider"
import apiClient from '../../utils/axios';
//import axios from 'axios';

const NoticeWrite = () => {

    // 토큰정보 가져오기(AuthProvider)
    const {member, accessToken, memName} = useContext(AuthContext);

    // notice
    const [formData, setFormData] = useState({
        notTitle:'',
        notWrite:'',
        notContent:'',
        notCreateBy:'',
        notUpdateBy:'',
    });

    // files
    const [newFiles, setFiles] = useState([]);

    // navigate
    const navigate = useNavigate();

    // formData 수정
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prevFormData)=>({
            ...prevFormData,
            [name]:value,
        }));
    }

    // 등록
    const handleInsertNotice = async (e) => {
        e.preventDefault(); // submit취소
        if(window.confirm("공지사항을 등록하시겠습니까?")){
            const data = new FormData();
            Object.entries(formData).forEach(([k,v])  => data.append(k,v));
            console.log("data"+data);

            try{
                await apiClient.post('/notice',data,{
                    headers:{
                        'Content-Type':'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                alert('공지사항 등록에 성공하였습니다.');
                navigate('/notice')
            } catch(error) {
                console.error('공지글 등록 실패',error);
                alert('공지사항 등록에 오류가 발생하였습니다.');
            }
        }
    }

    // 등록취소
    const handleInsertCancel = (e) => {
        e.preventDefault(); // submit 취소
        if(window.confirm("정말로 취소하시겠습니까?")){
            navigate(-1);
        }
    }


    //페이지 로딩시 memId 작성자에 넣기기
    useEffect(()=>{
        setFormData((prevFormData)=>({
            ...prevFormData,
            notCreateBy:memName,
            notUpdateBy:memName,
        }))

    },[memName]);


    

    return (
        <form
            onSubmit={handleInsertNotice}
            encType='multipart/form-data'
        >
            <table>
                <thead></thead>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input 
                                type='text'
                                name='notTitle'
                                value={formData.notTitle}
                                onChange={handleChange}
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>
                            <input 
                                type='text'
                                name='notWriter'
                                value={formData.notCreateBy}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <textarea
                                rows='10'
                                cols='100'
                                name='notContent'
                                value={formData.notContent}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </td>
                    </tr>
                    <tr>
                        <input
                            type='submit'
                            value='등록'/>
                        <button onClick={handleInsertCancel}>취소</button>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default NoticeWrite;