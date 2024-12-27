import React, { useEffect, useState , useContext} from 'react';
import {  useParams,useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider";
import {apiSpringBoot} from '../../utils/axios';
import styles from './DashList.module.css';
import SideBar from '../../components/common/SideBar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const DashList = () => {
    const { Id } = useParams();
    const [todolist, setTodolist] = useState([]);
      const [loading, setLoading] = useState(true);
      const [isFormVisible, setIsFormVisible] = useState(true);

    const fetchTodos = async () => {
        try {
            const response = await apiSpringBoot.get('/dashboard');
        // 응답 데이터에서 list 추출
        const todos = response.data.list || [];
        setTodolist(todos);
        } catch (error) {
            console.error('할 일 목록 조회 실패:', error);
            setTodolist([]); // API 호출 실패 시 빈 배열로 설정
        } finally{
            setLoading(false);
        }
    }

    const handleDelete = async (Id) => {
        console.log('삭제 요청 ID:', Id); // 삭제할 ID 확인
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await apiSpringBoot.delete(`/dashboard/${Id}`);
                alert('삭제가 완료되었습니다.');
                fetchTodos(); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('삭제 실패! 서버와의 통신에 문제가 발생했습니다.');
            }
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


    const {member, memId} = useContext(AuthContext);

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
        fetchTodos();
        console.log("uuid : "+ memId+ ', memUUID : ' + member.memUUID);
        setFormData((prevFormData)=>({
            ...prevFormData,
            memUuid:member.memUUID,
        }))

    },[member, memId]);

    //dashboard
    const [formData, setFormData] =useState({
        taskId:'',
        taskContent:'',
        taskStatus: '',
        taskDate: new Date().toISOString().split('T')[0],
        memUuid:'',
    });

    //insert
    const handleInsertTodo = async (e) => {
        e.preventDefault();
        // console.log("uuid : "+member.memUuid);
        // setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     memUuid: member.memUuid

        // }));
        const data =new FormData();

        const convertToTimestamp = (dateString) => {
            return `${dateString} 00:00:00`; // ISO 8601 형식 (yyyy-MM-ddTHH:mm:ss.sssZ)
        };


        // FormData에 입력값 추가
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'taskDate' ) {
                data.append(key, convertToTimestamp(value)); // 'yyyy-MM-dd HH:mm:ss' 형식으로 변환
            } else {
                data.append(key, value);
            }
        }); 
            
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            await apiSpringBoot.post('/dashboard', data,{
                headers: {
                    'Content-Type' : 'multipart/form-data',
                },
            });

            alert('할일 등록 성공');
            setIsFormVisible(false);
            fetchTodos();
            // 게시글 등록이 성공되면 공지 목록 페이지로 이동
            // navigate('/dashlist');
        } catch (error) {
            console.error('할일 등록 실패', error);
            alert('새 할일 등록 실패');
        }
    };
   
    return (
        <div>
            <SideBar />
            <div className={styles.container}>
                <div className={styles.rsection}>
                   
                            <div className={styles.buttonContainer}>
                                <h2>정복규님, 안녕하세요!</h2>
                                <button
                                    className={`${styles.button} ${styles.blue}`}
                                    onClick={() => navigate('/manegedsenior')}
                                >
                                    <span>현재 관리중인 어르신 수</span>
                                    <strong>15명</strong>
                                </button>
                                <button
                                    className={`${styles.button} ${styles.red}`}
                                    onClick={() => navigate('/familyaccount')}
                                >
                                    <span>가족 계정 승인 요청수</span>
                                    <strong>9건</strong>
                                </button>
                                <button
                                    className={`${styles.button} ${styles.purple}`}
                                    onClick={() => navigate('/docrequest')}
                                >
                                    <span>공문서 요청수</span>
                                    <strong>10건</strong>
                                </button>
                            </div>

                            <div className={styles.calendarbox}>
                                <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    events={[
                                        { title: '이벤트 1', date: '2024-12-20' },
                                        { title: '이벤트 2', date: '2024-12-22' },
                                    ]}
                                />
                            </div>
                            {isFormVisible ? (
                        <>

                            <div className="form-container">
                                <form onSubmit={handleInsertTodo}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>오늘 할일</th>
                                                <td>
                                                    <textarea
                                                        rows="10"
                                                        cols="100"
                                                        name="taskContent"
                                                        value={formData.taskContent}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="taskStatus"
                                                        value="Y"
                                                        checked={formData.taskStatus}
                                                        onChange={(e) =>
                                                            handleChange({
                                                                target: {
                                                                    name: 'taskStatus',
                                                                    value: e.target.checked ? 'Y' : 'N',
                                                                },
                                                            })
                                                        }
                                                    />
                                                    {' '}☆ 상태
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="submit" value="등록하기" />
                                                    <input
                                                        type="reset"
                                                        value="작성취소"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                taskContent: '',
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>할 일 목록</h2>
                            <table border="1" style={{ width: '100%', textAlign: 'center' }}>
                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>할 일 내용</th>
                                        <th>날짜</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todolist.length > 0 ? (
                                        todolist.map((todo, index) => (
                                            <tr key={todo.taskId || index}>
                                                <td>{index + 1}</td>
                                                <td>{todo.taskContent}</td>
                                                <td>{todo.taskDate}</td>
                                                <td>{todo.taskStatus === 'Y' ? '완료' : '미완료'}</td>
                                                <td>
                    <button
                        style={{
                            backgroundColor: 'red',
                            color:' white',
                            border:'none',
                            padding: '5px 10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleDelete(todo.taskId)}
                    >
                        삭제
                    </button>
                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">작성된 할일이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button onClick={() => setIsFormVisible(true)}>할 일 추가</button>
                            {/* <button onClick={() => handleDelete(formData.taskId)}>삭제</button> */}
                            
                        </>
                    )}
                </div>
                </div>

       

            
        </div>
       
    
    );
};

export default DashList;

