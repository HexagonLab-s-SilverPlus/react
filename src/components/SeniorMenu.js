import React from "react";
import styles from "./SeniorMenu.module.css";
import chatIcon from "../assets/images/chatIcon.png";
//import brainGameIcon from "../assets/images/brainGameIcon.png";
import game from "../assets/images/game.png";
import activityIcon from "../assets/images/activityIcon.png";
import noticeIcon from "../assets/images/noticeIcon.png";
import faqIcon from "../assets/images/question.png"
import bookIcon from "../assets/images/book.png"
import documentIcon from "../assets/images/documentIcon.png";
import { useNavigate } from "react-router-dom";

import SeniorNavbar from './common/SeniorNavbar';
import SeniorFooter from './common/SeniorFooter';

const SeniorMenu = () => {
  const navigate = useNavigate();

  const handleChatButton = () => {
    navigate('/eyRouter/welcome-chat')

  }
  const handleDocButton = () => {
    navigate('/docmain')
  }

  const handleNoticeButton = () => {
    navigate('/notice')
  }

  const handleProgramButton = () => {
    navigate('/program');
  };

  const handleFAQButton = () => {
    navigate('/qna/faq');
  };

  const handleBookButton = () => {
    navigate('/book');
  };

  return (
    <div>
      <SeniorNavbar />
      <div className={styles.menuContainer}>

        {/* 말동무 대화하기 */}
        <div className={`${styles.menuButton} ${styles.div1}`} onClick={handleChatButton}>
          <img src={chatIcon} alt="말동무 대화하기" />
          <p>
            말동무 <br />
            대화하기
          </p>
        </div>

        <div className={styles.menuWrap}>
          {/* 공문서 작성 */}
          <div className={`${styles.menuButton} ${styles.div2}`} onClick={handleDocButton}>
            <p>공문서 작성</p>
            <img src={documentIcon} alt="공문서 작성" />
          </div>

          {/* 어르신 맞춤 활동 */}
          <div className={`${styles.menuButton} ${styles.div3}`} onClick={handleProgramButton}>
            <p>
              어르신 <br />
              프로그램
            </p>
            <img src={activityIcon} alt="어르신 프로그램" />
          </div>

          {/* FAQ */}
          <div className={`${styles.menuButton} ${styles.div4}`} onClick={handleFAQButton}>
            <p>
              자주 <br />
              하는 질문
            </p>
            <img src={faqIcon} alt="FAQ" />
          </div>

          {/* 공지사항 */}
          <div className={`${styles.menuButton} ${styles.div5}`} onClick={handleNoticeButton}>
            <p>공지사항</p>
            <img src={noticeIcon} alt="공지사항" />
          </div>

          {/* 두뇌 활성화 게임 */}
          <div className={`${styles.menuButton} ${styles.div6}`} onClick={() => (navigate('/game'))}>
            <p>
              게임 : <br />
              카드 맞추기
            </p>
            <img src={game} alt="맞고" style={{ width: "100px" }} />
          </div>

          {/* 공문서 작성 */}
          <div className={`${styles.menuButton} ${styles.div7}`} onClick={handleBookButton}>
            <p>책 읽기</p>
            <img src={bookIcon} alt="책 읽기" />
          </div>


        </div>{/* menuWrap end */}
      </div>{/* menuContainer end */}
      <SeniorFooter className={styles.snrft} />
    </div >
  );
};

export default SeniorMenu;
