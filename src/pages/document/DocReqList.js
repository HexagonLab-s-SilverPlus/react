import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider";
import SideBar from '../../components/common/SideBar';
import dstyles from './DocReqList.module.css';
import { apiSpringBoot } from '../../utils/axios';

const DocRequestList = () => {
    const [docountdata, setdocountdata] = useState([]); // 공문서 요청 데이터를 관리하는 상태
    const navigate = useNavigate();
    const { member, memId} = useContext(AuthContext); // 사용자 권한 정보

   // 날짜시간 보정 함수
   const adjustTimeZone = (timestamp) => {
    if (!timestamp) {
        return "유효하지 않은 날짜"; // null 또는 undefined 처리
    }

    try {
        console.log("Raw timestamp:", timestamp);

        // "25/01/07 00:54:29.487000000" 형식을 파싱
        const [shortYear, month, dayAndTime] = timestamp.split("/");
        const [day, time] = dayAndTime.split(" ");
        const fullYear = `20${shortYear}`; // '25' → '2025'

        console.log("Parsed date components:", {
            shortYear,
            month,
            day,
            time,
            fullYear,
        });

        // JavaScript의 Date 객체는 0-based month 사용하므로 month에서 1을 뺌
        const parsedMonth = parseInt(month, 10) - 1;

        // 초 단위까지만 처리 (밀리초 이하 제거)
        const timeWithoutMs = time.split(".")[0];

        // UTC 시간으로 Date 객체 생성
        const utcDate = new Date(
            Date.UTC(fullYear, parsedMonth, day, ...timeWithoutMs.split(":").map(Number))
        );

        // UTC+9로 시간 보정
        const correctedDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

        // 최종 결과 반환 (YYYY-MM-DD 형식)
        return correctedDate.toISOString().split("T")[0];
    } catch (error) {
        console.error("Invalid date value or parsing error:", timestamp, error);
        return "유효하지 않은 날짜"; // 유효하지 않은 값 처리
    }
};


    // 데이터 fetch 및 상태 업데이트
    useEffect(() => {
        const fetchDocCount = async () => {
            try {
                console.log("Fetching document data...");
    
                const response = await apiSpringBoot.get('/api/document');
                console.log("Raw response data:", response.data);
    
                // 문서 타입 매핑 객체
                const docTypeMap = {
                    address: "전입신고서",
                };
    
                // 데이터 가공 및 번호(rownum) 부여
                const dataWithIndex = response.data.list.map((document, index) => {
                    console.log("Processing document:", document);
    
                    const rowData = {
                        rownum: index + 1, // 번호 부여 (1부터 시작)
                        username: document.writtenBy, // 작성자
                        doctype: docTypeMap[document.docType] || document.docType, // 문서 타입 변환
                        docCompleted: adjustTimeZone(document.docCompleted), // 생성 날짜 (시간 보정 포함)
                    };
    
                    console.log("Processed row data:", rowData);
                    return rowData;
                });
    
                setdocountdata(dataWithIndex); // 상태 업데이트
                console.log("Final processed data:", dataWithIndex);
            } catch (error) {
                console.error("Error fetching document data:", error);
                alert("공문서 요청확인 목록을 불러오지 못하였습니다.");
            }
        };
        fetchDocCount();
    }, []);
    

    return (
        <div>
            <div className={dstyles.container}>
                <SideBar />
                <div className={dstyles.rsection}>
                    <div className={dstyles.docTop}>
                        <span>공문서 요청수확인</span>
                    </div>

                    <div className={dstyles.tableDiv}>
                        <table className={dstyles.DocRequestTable}>
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>성명</th>
                                    <th>공문서 종류</th>
                                    <th>요청 날짜</th>
                                    <th>바로가기</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docountdata.map((document) => (
                                    <tr key={document.rownum}>
                                        <td>{document.rownum}</td> {/* 번호 */}
                                        <td>{memId}</td> {/* 작성자 */}
                                        <td>{document.doctype}</td> {/* 문서 타입 */}
                                        <td>{document.docCompleted}</td> {/* 생성 날짜 */}
                                        <td>
                                            <button 
                                                onClick={() => navigate(`/document/${document.rownum}`)} 
                                                className={dstyles.viewButton}
                                            >
                                                상세보기
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocRequestList;
