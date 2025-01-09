// src/components/common/PagingView.js
import React, { useContext } from 'react';
import styles from './Paging.module.css';
// AuthContext
import { AuthContext } from "../../AuthProvider"

const Paging = ({
  pageNumber,
  listCount,
  pageSize,
  maxPage,
  startPage,
  endPage,
  onPageChange
}) => {
  const groupSize = 10;  //페이지 그룹 크기 (한 그룹에 페이지 숫자 10개)
  const currentGroup = Math.ceil(pageNumber / groupSize);  //현재 페이지가 속한 페이지그룹
  //만약, 페이지그룹의 시작과 끝숫자를 서버에서 받지 않는다면(현재페이지, 총페이지수만 받은 경우) 직접 계산함 
  //const startPage = (currentGroup - 1) * groupSize + 1; //현재 그룹의 시작 페이지
  //const endPage = Math.min(currentGroup * groupSize, maxPage);  // 현재 그룹의 끝페이지

  //현재 페이지 그룹의 페이지 번호 리스트 생성
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // 토큰정보 가져오기(AuthProvider)
  const { role } = useContext(AuthContext);  // 롤정보    

  return (
    <div className={styles.pagingContainer}>
      {/* 1페이지로 이동 버튼 */}
      <button
        className={role === "SENIOR" ? styles.adminbutton : styles.pageButton}
        disabled={pageNumber === 1}
        onClick={() => onPageChange(1)}>&lt;&lt;</button>
      {/* 이전 페이지 그룹 이동 버튼 */}
      <button
        className={role === "SENIOR" ? styles.adminbutton : styles.pageButton}
        disabled={startPage === 1}
        onClick={() => onPageChange(startPage - 1)}>&lt;</button>
      {/* 현재 페이지 그룹 페이지 숫자들 */}
      {pages.map((page) => (
        <button
          key={page}
          className={`${role === "SENIOR" ? styles.adminbutton : styles.pageButton} ${
            Number(pageNumber) === page ? styles.activebutton : styles.adminbutton
          }`}
          onClick={() => onPageChange(page)}>{page}</button>
      ))}
      {/* 다음 페이지 그룹 이동 버튼 */}
      <button
        className={role === "SENIOR" ? styles.adminbutton : styles.pageButton}
        disabled={endPage === maxPage}
        onClick={() => onPageChange(endPage + 1)}>&gt;</button>
      {/* 끝페이지로 이동 버튼 */}
      <button
        className={role === "SENIOR" ? styles.adminbutton : styles.pageButton}
        disabled={pageNumber === maxPage}
        onClick={() => onPageChange(maxPage)}>&gt;&gt;</button>
    </div>
  );
};



export default Paging;