// src/components/common/PagingDiv8.js
import React from "react";
import styles from './PagingDiv8.module.css';

const PagingDiv8 = ({
    pageNumber,
    listCount,
    pageSize,
    maxPage,
    startPage,
    endPage,
    onPageChange,
    }) => {
        const groupSize = 8;
        
        //현재 페이지가 속한 페이지그룹
        const currentGroup = Math.ceil(pageNumber / groupSize); 

        //현재 페이지 그룹의 페이지 번호 리스트 생성
        const pages = Array.from(
            {length: endPage - startPage + 1},
            (_, i) => startPage + i
    );

    return (
        <div className={styles.pagingContainer1}>
            {/* 1페이지로 이동 버튼 */}
            <button disabled={pageNumber === 1} onClick={() => onPageChange(1)}>&lt;&lt;</button>

            {/* 이전 페이지 그룹 이동 버튼 */}
            <button disabled={startPage === 1} onClick={() => onPageChange(startPage - 1)}>&lt;</button>

            {/* 현재 페이지 그룹 페이지 숫자들 */}
            {pages.map((page) => (
                <button key={page} onClick={() => onPageChange(page)}
                    //className={Number(pageNumber) === page ? styles.activePage1 : ''}
                    className={`${styles.pagingButton} ${Number(pageNumber) === page ? styles.activePage1 : ''}`}
                >{page}</button>
            ))}

            {/* 다음 페이지 그룹 이동 버튼 */}
            <button disabled={endPage === maxPage} onClick={() => onPageChange(endPage + 1)}>&gt;</button>

            {/* 끝페이지로 이동 버튼 */}
            <button disabled={pageNumber === maxPage} onClick={() => onPageChange(maxPage)}>&gt;&gt;</button>
        </div>
    );
};

export default PagingDiv8;