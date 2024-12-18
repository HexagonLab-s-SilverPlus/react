// src/pages/notice/NoticeList.js

import React,{useState} from "react";
import SeniorNavbar from '../../components/common/SeniorNavbar';
import SeniorFooter from '../../components/common/SeniorFooter';
import styles from './NoticeList.module.css'
import search from '../../assets/images/search.png'
import up from '../../assets/images/keyboard_arrow_up.png'
import down from '../../assets/images/keyboard_arrow_down.png'


function NoticeList() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태
    const [selectOption, setSelectOption] = useState("제목") ; // 선택된 옵션

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);  // 드롭다운 열기 / 닫기
    };

    const handleSelectOption = (option) => {
        setSelectOption(option); // 선택된 옵션 업데이트
        setIsDropdownOpen(false); // 드롭다운 닫기
    };
    return (
        <div className={styles.noticeList}>
            {/* 헤더 */}
            <SeniorNavbar/>
            <div className={styles.top}>
                <div className={styles.menuname}>공지사항</div>
                {/* 검색창 */}
                <div className={styles.searchbox}>
                    {/* 검색옵션 */}
                    <div 
                        className={styles.searchOptions}
                        onClick={toggleDropdown}
                    >
                        &nbsp; {selectOption} &nbsp;
                        <img
                            className={styles.arrow}
                            src={isDropdownOpen ? up:down}
                            alt={isDropdownOpen ? "올리기":"내리기"}
                        />&nbsp;
                    </div>
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <div
                                className={styles.dropdownOption}
                                onClick={()=>handleSelectOption("제목")}
                            >
                                &nbsp; 제목 &nbsp;
                            </div>
                            <div
                                className={styles.dropdownOption}
                                onClick={()=>handleSelectOption("내용")}
                            >
                                &nbsp; 내용 &nbsp;
                            </div>
                        </div>
                    )}
                    {/* 검색키워드입력창 */}
                    <div className={styles.searchKeyword}>
                        &nbsp;
                        <input
                        className={styles.searchKeywordBox}
                        placeholder="검색어를 입력하세요."
                        />
                        &nbsp;
                        <img
                            className={styles.search}
                            src={search}
                            alt="검색"
                        />
                        &nbsp;
                    </div>
                </div>
            </div>

            {/* 리스트 출력 */}
            <div className={styles.list}>
                <div
                    className={styles.object}
                >
                    <div className={styles.title}>
                        TEST 공지사항입니다.
                    </div>
                    <div className={styles.message}>
                        <div >
                            내용이 궁금하면 클릭해보세요!
                        </div>
                        <div className={styles.date}>
                            2024/12/01
                        </div>
                    </div>
                </div>
            </div>
            {/*Footer*/}
            <SeniorFooter />
        </div>

    );
}
export default NoticeList;