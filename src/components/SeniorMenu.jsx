import React from "react";
import styles from "./SeniorMenu.module.css";
import chatIcon from "../assets/images/chatIcon.png";
import brainGameIcon from "../assets/images/brainGameIcon.png";
import activityIcon from "../assets/images/activityIcon.png";
import noticeIcon from "../assets/images/noticeIcon.png";
import documentIcon from "../assets/images/documentIcon.png";
import Container from "../pages/ey/chat/Container";
import { useNavigate } from "react-router-dom";

const SeniorMenu = () => {
    const navigate = useNavigate();

    const handleChatButton = () => {
      navigate('/welcome-chat')

    }
    const handleDocButton = () => {
      navigate('/docmain')
    }

  return (
    <Container>
      <div className={styles.menuContainer}>
        {/* 말동무 대화하기 */}
        <div className={`${styles.menuButton} ${styles.div1}`} onClick={handleChatButton}>
          <img src={chatIcon} alt="말동무 대화하기" />
          <p>
            말동무 <br />
            대화하기
          </p>
        </div>

        {/* 두뇌 활성화 게임 */}
        <div className={`${styles.menuButton} ${styles.div2}`}>
          <p>
            두뇌 활성화 <br />
            게임
          </p>
          <img src={brainGameIcon} alt="두뇌 활성화 게임" />
        </div>

        {/* 어르신 맞춤 활동 */}
        <div className={`${styles.menuButton} ${styles.div3}`}>
          <p>
            어르신 <br />
            맞춤 활동
          </p>
          <img src={activityIcon} alt="어르신 맞춤 활동" />
        </div>

        {/* 공지사항 */}
        <div className={`${styles.menuButton} ${styles.div4}`}>
          <p>공지사항</p>
          <img src={noticeIcon} alt="공지사항" />
        </div>

        {/* 공문서 작성 */}
        <div className={`${styles.menuButton} ${styles.div5}`} onClick={handleDocButton}>
          <p>공문서 작성</p>
          <img src={documentIcon} alt="공문서 작성" />
        </div>
      </div>
    </Container>
  );
};

export default SeniorMenu;
