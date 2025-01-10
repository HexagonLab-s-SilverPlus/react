import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from '../../utils/axios';
import styles from './DashList.module.css';
import dstyles from './FullCalendarCustom.css';
import SideBar from '../../components/common/SideBar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaTrashAlt } from 'react-icons/fa';

//현재 관리중인 어르신 count 뽑아내기
//가족 계정 승인 요청수 url연결하면 끝

const DashList = () => {
    const [seniorCount, setSeniorCount] = useState(0);
    const [approvalCount, setApprovalCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);
    const [todolist, setTodolist] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null); // 현재 수정 중인 taskId
    const [editingContent, setEditingContent] = useState(''); // 수정 중인 내용
    const [editingStatus, setEditingStatus] = useState('N'); // 수정 중인 상태
    const [showForm, setShowForm] = useState(false); //폼 표시상태
    const [formData, setFormData] = useState({
        taskId: '',
        taskContent: '',
        taskStatus: 'N',
        taskDate: new Date().toISOString().split('T')[0],
        memUuid: '',
    });

    const { member, memId } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchSeniorCount = async () => {
        try {
            if (!member?.memUUID) {
                console.error("memUUID가 정의되지 않았습니다.");
                return;
            }
            console.log("Fetching senior count for memUUID:", member?.memUUID);
            const response = await apiSpringBoot.get(`dashboard/Countsnr/${member?.memUUID}`);
            console.log("Senior count response:", response.data);
            setSeniorCount(response.data.count); // 서버로부터 받은 데이터 사용
        } catch (error) {
            console.error("현재 관리중인 어르신 수 가져오기 실패:", error);
        }
    };
    
    
    const fetchDocumentCount = async () => {
        try {
            if (!member?.memUUID) {
                console.error("mgrUUID가 정의되지 않았습니다.");
                return;
            }
            const response = await apiSpringBoot.get(`/dashboard/Count/${member?.memUUID}`);
            console.log("Document count response:", response.data);
            setDocumentCount(response.data.data); // 서버로부터 받은 데이터 사용
        } catch (error) {
            console.error("공문서 카운트 가져오기 실패:", error);
        }
    };
    useEffect(() => {
        fetchDocumentCount(); // 컴포넌트 마운트 시 카운트 가져오기
    }, []);

    const fetchApprovalCount = async () =>{
        try{
            const response = await apiSpringBoot.get(`/member/approvalCount/${member?.memUUID}`);
            setApprovalCount(response.data);
        }catch(error){
            console.error('가족 계정 승인 요청수 가져오기 실패:', error);
        }
    }


    // 목록
    const fetchAllTodos = async () => {
        try {
            const response = await apiSpringBoot.get('/dashboard');
            const todos = response.data.list || [];
            setTodolist(todos);
            setCalendarEvents(
                todos.map((todo) => ({
                    title: todo.taskContent,
                   date: new Date(todo.taskDate).toLocaleDateString('en-CA'),
                }))
            );
            const today = new Date().toISOString().split("T")[0];
            const filtered = todos.filter(
              (todo) => new Date(todo.taskDate).toLocaleDateString("en-CA") === today
            );
            setFilteredTodos(filtered);


        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
            setTodolist([]);
      setCalendarEvents([]);
      setFilteredTodos([]);
        }
    };

    //특정 날짜 선택시 일정 필터링
    const handleDateClick = (info) => {

        console.log("Cliced Date:", info);
        console.log("Clicked Date (String):", info.dateStr);

        const clickedDate = info.dateStr;
        setSelectedDate(clickedDate);
        console.log("Selected Date State:", clickedDate);

        const filtered = todolist.filter((todo) => {
            console.log("Todo Task Date:", new Date(todo.taskDate).toLocaleDateString('en-CA')); // 각 할 일의 날짜 확인
            return new Date(todo.taskDate).toLocaleDateString('en-CA') === clickedDate;

        });
        
        console.log("Filtered Todos:", filtered); 
        setFilteredTodos(filtered); //필터링된 데이터 저장
    };

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };



    //등록
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
            window.location.reload();// 페이지 새로고침
            setShowForm(false);
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
            // alert('새 할일 등록 실패');
        }
    };

    //삭제
    const handleDelete = async (Id) => {
        console.log('삭제 요청 ID:', Id); // 삭제할 ID 확인
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await apiSpringBoot.delete(`/dashboard/${Id}`);
                alert('삭제가 완료되었습니다.');
                window.location.reload();
                // fetchTodos(); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('삭제 실패! 서버와의 통신에 문제가 발생했습니다.');
            }
        }
    };

     // 수정 시작
     const handleEditClick = (task) => {
        setEditingTaskId(task.taskId);
        setEditingContent(task.taskContent); // 현재 내용을 수정 상태로 가져옴
        setEditingStatus(task.taskStatus); // 현재 상태 수정 가능하도록
        setFormData((prev) => ({
            ...prev,
            taskDate: task.taskDate, // 원래 taskDate 설정
        }));

    };

    const handleSaveEdit = async () => {
    if (!editingTaskId) {
        alert('수정할 Task ID가 없습니다.');
        return;
    }

    const updatedTask = {
        taskId: editingTaskId,
        taskContent: editingContent,
        taskStatus: editingStatus,
        taskDate: formData.taskDate, // 원래 시간 유지
        memUuid: formData.memUuid,
    };

    console.log('전송 데이터:', updatedTask);

    try {
        await apiSpringBoot.put(`/dashboard/${editingTaskId}`, updatedTask, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        alert("수정이 완료되었습니다.");
        // 상태 업데이트
        setTodolist((prev) =>
            prev.map((todo) =>
                todo.taskId === editingTaskId
                    ? { ...todo, taskContent: editingContent, taskStatus: editingStatus }
                    : todo
            )
        );
        setFilteredTodos((prev) =>
            prev.map((todo) =>
                todo.taskId === editingTaskId
                    ? { ...todo, taskContent: editingContent, taskStatus: editingStatus }
                    : todo
            )
        );

            setEditingTaskId(null); // 수정 모드 종료
            setEditingContent('');
            setEditingStatus('N');
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditingContent('');
        setEditingStatus('N');
    };
 
    


    useEffect(() => {
        if (member) {
            // formData의 memUuid를 설정
            setFormData((prevFormData) => ({
                ...prevFormData,
                memUuid: member.memUUID,
            }));
    
            // 공문서 요청 수 가져오기
            // fetchDocumentCount();
    
            // 가족 계정 승인 요청 수 가져오기
            if (member.memUUID) {
                fetchSeniorCount();
                fetchApprovalCount();
                fetchDocumentCount();
                
            }
        }
    
        // To-do 목록 가져오기
        fetchAllTodos();
    
        // 오늘 날짜를 선택된 날짜로 설정
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
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
                            onClick={() => navigate('/seniorlist')}
                        >
                            <span>현재 관리중인 어르신 수</span>
                            <strong>{seniorCount}명</strong>
                        </button>
                        <button
                            className={`${styles.button} ${styles.red}`}
                            onClick={() => navigate('/familyaccount')}
                        >
                            <span>가족 계정 승인 요청수</span>
                            <strong>{approvalCount}건</strong>
                        </button>
                        <button
                            className={`${styles.button} ${styles.purple}`}
                            onClick={() => navigate('/docrequest')}
                        >
                            <span>공문서 요청수</span>
                            <strong>{documentCount}건</strong>
                        </button>
                    </div>

                    <div className={styles.calendarbox} style={{ width: "1300px", margin: "0 auto" }}>
                        <FullCalendar
                        // className="custom-calendar"
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                          
                            events={calendarEvents}
                            height="750px"
                            
                            // dateClick={(info) => console.log(`Clicked on: ${info.dateStr}`)}
                            dateClick={handleDateClick}
                        />
                    </div>
                    {showForm &&(

<div className={styles["form-container"]}>
                        <form onSubmit={handleInsertTodo}>
                            <h3> 할 일 작성</h3>
                      
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
                    )}
                    
                    <div className={styles.todobigform}>
                    <h3 className={styles.todoTitle}>
                        {selectedDate} 할 일
                        <button
                            className={styles.addButton}
                            onClick={() => setShowForm(!showForm)}
                        >
                            +
                        </button>
                    </h3>
                                        <ul className={styles.todoList}>
                        {filteredTodos.map((todo) => (
     <li className={styles.todoItem} key={todo.taskId}>
     {editingTaskId === todo.taskId ? (
         // 수정 모드
         <div>
             <input
                 type="text"
                 value={editingContent}
                 onChange={(e) => setEditingContent(e.target.value)}
                 placeholder="할 일 내용을 수정하세요"
             />
             <label>
                 <input
                     type="checkbox"
                     checked={editingStatus === 'Y'}
                     onChange={(e) =>
                         setEditingStatus(e.target.checked ? 'Y' : 'N')
                     }
                 />
                 완료 여부
             </label>
             <button onClick={handleSaveEdit} className={styles.saveButton}>
                 저장
             </button>
             <button onClick={handleCancelEdit} className={styles.cancelButton}>
                 취소
             </button>
         </div>
     ) : (
         // 기본 모드
         <div style={{ display: 'flex', alignItems: 'center' }}>
             <input
                 type="checkbox"
                 className={styles.checkbox}
                 checked={todo.taskStatus === 'Y'}
                 readOnly
             />
             <span
                 className={`${styles.todoText} ${
                     todo.taskStatus === 'Y' ? styles.completed : ''
                 }`}
             >
                 {todo.taskContent}
                 
             </span>
             <button
                 onClick={() => handleEditClick(todo)}
                 className={styles.editButton}
             >
                 수정
             </button>
             <button
                 className={styles.deleteButton}
                 onClick={() => handleDelete(todo.taskId)}
             >
                 <FaTrashAlt />
             </button>
         </div>
     )}
 </li>
))}

</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashList;
