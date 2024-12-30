import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from '../../utils/axios';
import styles from './DashList.module.css';
import SideBar from '../../components/common/SideBar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaTrashAlt } from 'react-icons/fa';

const DashList = () => {
    const [todolist, setTodolist] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [formData, setFormData] = useState({
        taskId: '',
        taskContent: '',
        taskStatus: 'N',
        taskDate: new Date().toISOString().split('T')[0],
        memUuid: '',
    });

    const { member, memId } = useContext(AuthContext);
    const navigate = useNavigate();

    // 모든 데이터 가져오기
    const fetchAllTodos = async () => {
        try {
            const response = await apiSpringBoot.get('/dashboard');
            const todos = response.data.list || [];
            setTodolist(todos);
            setCalendarEvents(
                todos.map((todo) => ({
                    title: todo.taskContent,
                    date: todo.taskDate.split('T')[0],
                }))
            );
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    // 입력 필드 추가
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    //insert
    const handleInsertTodo = async (e) => {
        e.preventDefault();
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
            // setIsFormVisible(false);
            // fetchTodos();
             // 새로 추가된 데이터를 todolist와 calendarEvents에 업데이트
      const newTodo = response.data;
      setTodolist((prev) => [...prev, newTodo]);
      setCalendarEvents((prev) => [
        ...prev,
        {
          id: newTodo.taskId,
          title: newTodo.taskContent,
          date: newTodo.taskDate.split("T")[0],
        },
    ]);

            
            // 게시글 등록이 성공되면 공지 목록 페이지로 이동
            // navigate('/dashlist');
        } catch (error) {
            console.error('할일 등록 실패', error);
            alert('새 할일 등록 실패');
        }
    };

    //삭제
    const handleDelete = async (Id) => {
        console.log('삭제 요청 ID:', Id); // 삭제할 ID 확인
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await apiSpringBoot.delete(`/dashboard/${Id}`);
                alert('삭제가 완료되었습니다.');
                // fetchTodos(); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('삭제 실패! 서버와의 통신에 문제가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        if (member) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                memUuid: member.memUUID, // memUUID를 AuthContext에서 가져옴
            }));
        }
        fetchAllTodos();
    }, [member]);

    return (
        <div>
            <SideBar />
            <div className={styles.container}>
                <div className={styles.rsection}>
                    <div className={styles.buttonContainer}>
                        <h2>{memId}님 안녕하세요!</h2>
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
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            dateClick={(info) => console.log(`Clicked on: ${info.dateStr}`)}
                        />
                    </div>

                    <div className="form-container">
                        <form onSubmit={handleInsertTodo}>
                            
                            <h3 className={styles.todoTitle}>오늘 할일</h3>
                            <div>
                                <label>내용:</label>
                                <input
                                    type="text"
                                    name="taskContent"
                                    value={formData.taskContent}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>날짜:</label>
                                <input
                                    type="date"
                                    name="taskDate"
                                    value={formData.taskDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">저장하기</button>
                        </form>
                    </div>

                    <ul className={styles.todoList}>
                        {todolist.map((todo, index) => (
                            <li className={styles.todoItem} key={todo.taskId || index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="checkbox" className={styles.checkbox} />
                                    <span className={styles.todoText}>{todo.taskContent}</span>
                                </div>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(todo.taskId)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashList;
