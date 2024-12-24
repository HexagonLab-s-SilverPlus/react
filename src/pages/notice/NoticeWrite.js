// src/pages/notice/Notice.js
import React,{useState,useEffect,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../../AuthProvider"
import {apiSpringBoot} from '../../utils/axios';
import SideBar from '../../components/common/SideBar';


const NoticeWrite = () => {

    // 토큰정보 가져오기(AuthProvider)
    const {member, memId} = useContext(AuthContext);

    // notice
    const [formData, setFormData] = useState({
        notTitle:'',
        notWriter:'',
        notContent:'',
        notCreateBy:'',
        notUpdateBy:'',
    });

    // files
    const [newFiles, setNewFiles] = useState([]);

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

    // 첨부파일 입력박스 추가
    const handleFileInsertBox = (e) => {
        e.preventDefault(); // submit 취소
        // 임시 파일 입력 요소 생성
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';

        // 파일 선택 이벤트 처리
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setNewFiles((prevFiles) => [...prevFiles,file]);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };
    
    // 파일 삭제 처리
    const handleDeleteFile = (index) => {
        setNewFiles((prevfiles)=>prevfiles.filter((_,i) => i !== index));
    };


    // 등록
    const handleInsertNotice = async (e) => {
        e.preventDefault(); // submit취소
        if(window.confirm("공지사항을 등록하시겠습니까?")){
            const data = new FormData();
            Object.entries(formData).forEach(([key,value])=>data.append(key,value));
            console.log("notTitle : ", data.get("notTitle"));
            if (newFiles){
                newFiles.forEach((file) => {
                    data.append('newFiles',file); // 첨부파일 추가
                });
            }
            console.log("newFiles : ", data.getAll("newFiles"));

            for (let [key,value] of data.entries()){
                console.log(`${key}:${value.name||value}`);
            }            
            
            try{
                await apiSpringBoot.post('/notice',data,{
                    headers:{
                        'Content-Type':'multipart/form-data',
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
        console.log("userName" + memId + " " + member.memUUID);
        setFormData((prevFormData)=>({
            ...prevFormData,
            notWriter:memId,
            notCreateBy:member.memUUID,
            notUpdateBy:member.memUUID,
        }))
    },[]);

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
                                value={formData.notWriter}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th colSpan='2'>
                            <button
                            onClick={(e)=>handleFileInsertBox(e)}
                                >첨부파일추가
                            </button>
                        </th>
                    </tr>
                    {/* 첨부파일 추가 박스 */}
                    {newFiles.map((file, index) => (
                        <tr key={index}>
                            <td colSpan="2">
                                <span>{file.name}</span>
                                <input 
                                    type="button"
                                    onClick={()=>handleDeleteFile(index)}
                                    value="x"
                                />
                            </td>
                        </tr>
                    ))}
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