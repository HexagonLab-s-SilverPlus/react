import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider";
import SideBar from '../../components/common/SideBar';
import dstyles from './DocReqList.module.css';
import { apiSpringBoot } from '../../utils/axios';

const DocRequestList = () => {
    const [docountdata, setdocountdata] = useState([]); // 공문서 요청 데이터를 관리하는 상태
    const navigate = useNavigate();
    const { role, memId } = useContext(AuthContext); // 사용자 권한 정보

    // 권한 확인
    useEffect(() => {
        console.log("User role:", role); // 디버깅 로그

        if (role?.toLowerCase() !== 'manager') { // role 값 검증
            alert('접근 권한이 없습니다.');
            navigate('/'); // 홈 페이지로 리다이렉트
        }
    }, [role, navigate]);

    // 날짜시간 보정 함수
    const adjustTimeZone = (timestamp) => {
        if (!timestamp) {
            console.error("Timestamp is null or undefined");
            return "유효하지 않은 날짜";
        }

        try {
            console.log("Raw timestamp:", timestamp);

            const utcDate = new Date(timestamp);

            if (isNaN(utcDate.getTime())) {
                console.error("Invalid date format detected:", timestamp);
                throw new Error("Invalid date format");
            }

            const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

            return kstDate.toISOString().split("T")[0];
        } catch (error) {
            console.error("Error in adjustTimeZone function:", timestamp, error);
            return "유효하지 않은 날짜";
        }
    };

    // 데이터 fetch 및 상태 업데이트
    useEffect(() => {
        const fetchDocCount = async () => {
            try {
                console.log("Fetching document data...");
    
                const response = await apiSpringBoot.get('/api/document');
                console.log("Raw response data:", response.data);
    
                const docTypeMap = {
                    address: "전입신고서",
                };
    
                const dataWithIndex = response.data.list.map((document, index) => {
                    console.log("Processing document:", document);
    
                    const rowData = {
                        rownum: index + 1,
                        username: document.writtenBy,
                        doctype: docTypeMap[document.docType] || document.docType,
                        docCompleted: adjustTimeZone(document.createAt),
                    };
    
                    console.log("Processed row data:", rowData);
                    return rowData;
                });
    
                setdocountdata(dataWithIndex);
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
                                        <td>{document.rownum}</td>
                                        <td>{memId}</td>
                                        <td>{document.doctype}</td>
                                        <td>{document.docCompleted}</td>
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
