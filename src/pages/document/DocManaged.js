import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import styles from './DocManaged.module.css';

const DocManaged = () => {


    const [] = useStatus

    //데이터 가져오기
    // const fetchDocManageData = async (page) => {
    //     const Data = list.map()
         
    // }

    return(
        <div className={styles.dmcontainer}>
            <div className={styles.dmTop}>
                <h1>공문서 확인</h1>
                <dic className={styles.dmline}>
                    <button>공문서 승인 요청</button>
                    <button>공문서 승인 완료</button>
                    <button>공문서 승인 반려</button>
                </dic>
            </div>

            <table className={styles.dmTable}>
                <thead>
                    <tr>
                    <th>작성일자</th>
                    <th>공문서 유형</th>
                    <th>파일 다운로드</th>
                    <th>처리 여부</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className={styles.dmItem}>
                        {/* <td><input type="checkbox"/></td> */}
                        <td>2024-11-07</td>
                        <td>전입신고서</td>
                        <td>다운로드</td>
                        <td><button>확인</button> <button>반려</button></td>
                    </tr>
                </tbody>
            </table>

        </div>

    );

};

export default DocManaged;