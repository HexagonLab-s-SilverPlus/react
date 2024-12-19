// src/pages/notice/Notice.js
import React,{useState} from 'react';

const NoticeWrite = () => {

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

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData((pre)=>({
            ...pre,
            [name]:value,
        }));
    }

    return (
        <form>
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
                        <th>작성자자</th>
                        <td>
                            <input 
                                type='text'
                                value={formData.notCreateBy}
                                onChange={handleChange}
                                required
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default NoticeWrite;