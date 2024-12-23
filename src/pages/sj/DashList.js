import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashList.module.css';
import SideBar from '../../components/common/SideBar';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';




const DashList = () => {
    const navigate = useNavigate();

    

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
        <div className={styles.rsection}>
            <SideBar />
            <div className={styles.container}>
                <h2>정복규님, 안녕하세요!</h2>
                <div className={styles.buttonContainer}>
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
            </div>
            <div className={styles.calendarbox}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        { title: '이벤트 1', date: '2024-12-20' },
                        { title: '이벤트 2', date: '2024-12-22' }
                    ]}
                />
            </div>
        </div>
    );
};

export default DashList;