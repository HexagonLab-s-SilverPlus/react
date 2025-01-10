// src/components/emg/Emg.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import styles from './EMGList.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';

function EmgList({ emgSnrUUID }) {
    const [emgs, setEmgs] = useState([]);

    const [pagingInfo, setPagingInfo] = useState({                  // 스프링 부터 search를 보낼때 담을 상태훅
        uuid: "",
        pageNumber: 1,
        action: "all",
        listCount: 1,
        maxPage: 1,
        pageSize: 5,
        startPage: 1,
        endPage: 1,
        keyword: "",
    });

    //--------------------------------------------------
    //데이터 포맷(한국)
    const formatDate = (w) => {
        const date = new Date(w);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;  //월은 0부터 시작하므로 1더해야 함
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        return `${year}년 ${month}월 ${day}일     ${hour}시 ${min}분`;
    };

    const fetchEmg = async (page = 1) => {
        try {
            let response = await apiSpringBoot.get(`/emg`, {
                params: {
                    ...pagingInfo,
                    uuid: emgSnrUUID,
                    pageNumber: page
                },
            });
            console.log('fetchEmg Response : ', response.data);
            setEmgs(response.data.list);
            const { maxPage, startPage, endPage } = PagingCalculate(response.data.search.pageNumber,
                response.data.search.listCount, response.data.search.pageSize);
            setPagingInfo((pre) => ({
                ...pre,
                pageNumber: response.data.search.pageNumber,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
            }));
            // alert(JSON.stringify(pagingInfo))

        } catch (error) {
            console.error('Emg useEffect Error : ', error);
        }
    };

    useEffect(() => {
        fetchEmg();
    }, []);

    const handlePageChange = (page) => {          // 페이지 눌렀을때 뷰 바꾸기
        setPagingInfo((pre) => ({ ...pre, pageNumber: page }));
        fetchEmg(page);
    };

    if (!emgs) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };

    return (
        <div className={styles.emgWrap}>
            <div className={styles.emgTop}>
                <h1>위급 상황 기록</h1>
            </div>{/* emg_top end */}

            <table className={styles.emgTable}>
                <thead>
                    <tr>
                        <th>위급 상황</th>
                        <th>상황 시간</th>
                        <th>취소 유무</th>
                        <th>취소 시간</th>
                    </tr>
                </thead>

                <tbody>
                    {emgs.map((item, index) => (
                        <tr key={index} className={styles.emgItem}>
                            <td><input type="text" name="emgDiagDate" value={item.emgCapPath} disabled /></td>
                            <td><input type="text" name="emgDiseaseName" value={formatDate(item.emgCreatedAt)} disabled /></td>
                            <td>{item.emgCancel === "Y" ?
                                <input type="text" name="emgLastTreatDate" value={"취소 됨"} disabled className={styles.cancel} />
                                : <input type="text" name="emgLastTreatDate" value={"취소 안됨"} disabled className={styles.ncancel} />}</td>
                            {item.emgCancelAt ? <td><input type="text" name="emgLastTreatDate" value={formatDate(item.emgCancelAt)} disabled /></td> : <td></td>}
                        </tr>
                    ))}

                </tbody>
            </table>
            <Paging
                pageNumber={pagingInfo.pageNumber}
                listCount={pagingInfo.listCount}
                maxPage={pagingInfo.maxPage}
                startPage={pagingInfo.startPage}
                endPage={pagingInfo.endPage}
                onPageChange={(page) => handlePageChange(page)}
            />
        </div>//emg_wrap end
    );
};

export default EmgList;