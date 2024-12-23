// src/components/sm/senior/common/SeniorNavBar.js
import React,{useState, useEffect, useContext} from "react";
import { Link } from 'react-router-dom';

// css
import Styles from "./SeniorNavbar.module.css"

// image
import profile from '../../assets/images/profile.png'; // 로고 이미지 임포트

//authProvider
import { AuthContext } from '../../AuthProvider';

const SeniorNavbar = () => {
    // 모달창 생성
    const [isModalVisible, setModalVisible] = useState(false);

    // 토큰 정보가져오기
    const { isLoggedIn, logout, refreshToken, authInfo } = useContext(AuthContext);

    // 프로필 이미지를 클릭할 때 모달을 열거나 닫음
    const toggleModal = () => setModalVisible((prev) => !prev);
    const closeModal = (e) => {
        if(!e.target.closest(`.${Styles.navbarprofile}`)){
            setModalVisible(false);
        }
    }


    const handleLogout = () => {
        if (isLoggedIn) {
            logout({ refreshToken });
            console.log('로그아웃');
            console.log('authInfo', authInfo);
            alert('로그아웃 성공');
          }
    };


    // 모달 외부 클릭 감지
    useEffect(()=>{
        if (isModalVisible){
            document.addEventListener("click",closeModal);
        } else {
            document.removeEventListener("click",closeModal)
        }
        return() => document.removeEventListener("click",closeModal)
    },[isModalVisible]);

    return (
        <nav className={Styles.navbar}>
            <Link to="/" className={Styles.navbarlogo}>실버플러스</Link>
            <div className={Styles.navbarright}>
                <div className={Styles.navbarmenu}>메뉴</div>
                <img 
                    className={Styles.navbarprofile}
                    src={profile}
                    alt="내정보"
                    onClick={toggleModal}
                />
                {isModalVisible && (
                    <div className={Styles.modal}>
                        <p>내정보 보기</p>
                        <p onClick={handleLogout}>로그아웃</p>
                    </div>
                )}
            </div>
        </nav>
    );

};

export default SeniorNavbar;