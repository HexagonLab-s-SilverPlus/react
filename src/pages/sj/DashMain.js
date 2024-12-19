import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashMain.module.css'
import SideBar from '../../components/common/SideBar';



const DashMain = () => {

    const navigate = useNavigate();

    return(
        <div>
            <h2>정복규님, 안녕하세요</h2>
           
           <button>현재 관리중인 어르신 수</button>
           <button>가족 계정 승인 요청수</button>
           <button>공문서 요청수</button>
        </div>


    );


};//const DashMain

export default DashMain;