import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import SideBar from '../../components/common/SideBar';
import dstyles from './DocReqList.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
import { apiSpringBoot } from '../../utils/axios';

const DocRequestList = () => {
    const [docData, setDocData] = useState([]); // 공문서 요청 데이터를 저장할 상태
    const [pagingInfo, setPagingInfo] = useState({
        currentPage: 1,
        maxPage: 1,
        startPage: 1,
        endPage: 1,
    }); // 페이징 정보를 저장할 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { role } = useContext(AuthContext); // 사용자 권한 정보

    // 권한 확인
    useEffect(() => {
        if (role?.toLowerCase() !== 'manager') {
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

    // 문서 데이터 가져오기
    const fetchDocData = async (page) => {
        try {
            setLoading(true);
            
            const response = await apiSpringBoot.get(`/api/document`, {
                params: { pageNumber: page, pageSize: 10 },
            });

            console.log("API Response Data:", response.data);

            const docTypeMap = {
                address: "전입신고서",
                death: "사망신고서",
                basic: "기초연금 신청서",
                medical: "의료급여 신청서",
            };

            const { list, paging } = response.data;
             // 페이징 계산
             console.log("Paging Inputs: ", {
                page,
                listCount: paging.listCount,
                pageSize: paging.pageSize,
            });
            console.log("API Response List Data:", list);

            console.log("Server Paging Data: ", paging);
            console.log("Request Params:", { pageNumber: page, pageSize: 10 });
            
            const { maxPage, startPage, endPage } = PagingCalculate(
                page,
                paging.listCount,
                paging.pageSize
            );


            

            const adjustedData = list.map((document, index) => ({
                rownum: index + 1 + (paging.currentPage - 1) * 10,
                username: document.writtenBy,
                doctype: docTypeMap[document.docType] || document.docType,
                docCompleted: adjustTimeZone(document.docCompletedAt),
            }));
            console.log("Adjusted Data:", adjustedData);

            setDocData(adjustedData); // 문서 데이터 설정
            setPagingInfo({
                currentPage: paging.currentPage,
                maxPage: paging.totalPages,
                startPage: 1, // 필요시 계산
                endPage: paging.totalPages, // 필요시 계산
            }); // 페이징 정보 설정
        } catch (err) {
            console.error("Error fetching document data:", err);
            setError('문서를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchDocData(1); // 첫 페이지 로드
    }, []);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        console.log(`Requesting page: ${page}`);
        fetchDocData(page); // 새 페이지 데이터 가져오기
    };
    
    // const handlePageChange = (page) => {
    //     setPagingInfo((prev) => ({
    //         ...prev,
    //         currentPage: page,
    //     }));
    //     fetchDocData(page); // 새 페이지 데이터 가져오기
    // };

    if (loading) {
        return <div className={dstyles.loading}>로딩 중...</div>;
    }

    if (error) {
        return <div className={dstyles.error}>{error}</div>;
    }

    return (
        <div className={dstyles.dContainer}>
            <SideBar />
            <div className={dstyles.dRsection}>
                <div className={dstyles.dDocTop}>
                    <span className={dstyles.dMenuName}>공문서 요청 수확인</span>
                </div>
                <div className={dstyles.dTableDiv}>
                    <table className={`${dstyles.dDocRequestTable} ${dstyles.dTable}`}>
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
                            {docData.map((document) => (
                                <tr key={document.rownum}>
                                    <td className={dstyles.dTd}>{document.rownum}</td>
                                    <td className={dstyles.dTd}>{document.username}</td>
                                    <td className={dstyles.dTd}>{document.doctype}</td>
                                    <td className={dstyles.dTd}>{document.docCompleted}</td>
                                    <td className={dstyles.dTd}>
                                        <button
                                            onClick={() => navigate(`/document/${document.rownum}`)}
                                            className={dstyles.dViewButton}
                                        >
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Paging
                    currentPage={pagingInfo.currentPage || 1}
                    maxPage={pagingInfo.maxPage || 1}
                    startPage={pagingInfo.startPage || 1}
                    endPage={pagingInfo.endPage || 1}
                    onPageChange={(page) => handlePageChange(page)}
                />
            </div>
        </div>
    );
};

export default DocRequestList;
