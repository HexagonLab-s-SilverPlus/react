import React, { useEffect, useState , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider"
import {apiSpringBoot} from '../../utils/axios';
import styles from './DashList.module.css';
import SideBar from '../../components/common/SideBar';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';

const DashList = () => {

    const {member, accessToken, memName} = useContext(AuthContext);

    const navigate = useNavigate();

    //폼데이터 실시간 반영
    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    useEffect(()=>{
        console.log("uuid : "+ memName);
        setFormData((prevFormData)=>({
            ...prevFormData,
            memUuid:memName,
        }))

    },[memName]);

    //dashboard
    const [formData, setFormData] =useState({
        taskId:'',
        taskContent:'',
        taskStatus: false,
        taskDate: new Date().toISOString().split('T')[0],
        memUuid:'',
    });

    //insert
    const handleInsertTodo = async (e) => {
        e.preventDefault();
        console.log("uuid : "+member.memUuid);
        setFormData((prevFormData) => ({
            ...prevFormData,
            memUuid: member.memUuid

        }));
        try {
            await apiSpringBoot.post('/dashboard', formData,{
                headers: {
                    'Content-Type' : 'multipart/form-data',
                    Authrization: `Bearer ${accessToken},`
                }
            });

            alert('할일 등록 성공');
            // 게시글 등록이 성공되면 공지 목록 페이지로 이동
            navigate('/dashboard');
        } catch (error) {
            console.error('할일 등록 실패', error);
            alert('새 할일 등록 실패');
        }
    };

    

    

    const handleSeniorCountClick = () => {
        navigate = ('/manegedsenior');
    };
    const handFamilyCountClick = () => {
        navigate = ('/familyaccount');
    };
    const docCountClick = () => {
        navigate = ('/docrequest');
    };



   
    return (
        <div>
            <SideBar />
            
            <div className={styles.container}>
            <div className={styles.rsection}>
                <div className={styles.buttonContainer}>
                <h2>정복규님, 안녕하세요!</h2>
                    <button className={`${styles.button} ${styles.blue}`} onClick={ handleSeniorCountClick }>
                        <span >현재 관리중인 어르신 수</span>
                        <strong>15명</strong>
                    </button>
                    <button className={`${styles.button} ${styles.red}`} onClick={ handFamilyCountClick }>
                        <span>가족 계정 승인 요청수</span>
                        <strong>9건</strong>
                    </button>
                    <button className={`${styles.button} ${styles.purple}`} onClick={ docCountClick }>
                        <span>공문서 요청수</span>
                        <strong>10건</strong>
                    </button>
                </div>
                
            
            {/* <div className={styles.calendarbox}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        { title: '이벤트 1', date: '2024-12-20' },
                        { title: '이벤트 2', date: '2024-12-22' }
                    ]}
                />
                </div> */}
                </div>

           <div></div>
                <form onSubmit={handleInsertTodo}>
                    <table>
                        <tbody>
                            <tr>
                                <th>오늘 할일</th>
                                <td>
                                    <textarea
                                        rows='10'
                                        cols='90'
                                        name='taskContent'
                                        value={formData.taskContent}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>

                           <td>
                            <input 
                                type="checkbox"
                                name="taskStatus"
                                value="Y"
                                checked={formData.taskStatus}
                                onChange={(e) => handleChange({ target: { name: 'taskStatus', value: e.target.checked } })}
                                /> {'☆'} 상태
                           </td>
                            <tr>

                            </tr>
                            <tr><th>
                                <input type="submit" value="등록하기" /> &nbsp;
                                <input type="reset" value="작성취소"
                                    onClick={() => setFormData({ ...formData, taskContent: ''})} />{' '} &nbsp;
                                 
                            </th>
                            </tr>
                        </tbody>
                        </table>    
                    
                </form>

       

            
        </div>
        </div>
    
    );
};

export default DashList;

