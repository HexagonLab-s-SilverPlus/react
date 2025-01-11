import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import SideBar from '../../components/common/SideBar';
import dstyles from './DocReqList.module.css';
import { apiSpringBoot } from '../../utils/axios';
import Paging from '../../components/common/Paging';

const DocRequestList = () => {
    const [docData, setDocData] = useState([]); // 공문서 요청 데이터를 저장할 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seniorNames, setSeniorNames] = useState({}); // seniorUUID와 이름 매핑
    const [pagingInfo, setPagingInfo] = useState({ // 페이징 정보 상태
        currentPage: 1,
        totalPages: 1,
        totalElements: 0,
        pageSize: 10,
        startPage: 1,
        endPage: 1,
    });

    const navigate = useNavigate();
    const { role, member } = useContext(AuthContext); // 사용자 권한 정보

    // 권한 확인
    useEffect(() => {
        if (role !== 'MANAGER') {
            alert('접근 권한이 없습니다.');
            navigate('/'); // 홈 페이지로 리다이렉트
        }
    }, [role, navigate]);

    // 날짜시간 보정 함수
    const adjustTimeZone = (timestamp) => {
        if (!timestamp) return '유효하지 않은 날짜';
        try {
            const utcDate = new Date(timestamp);
            if (isNaN(utcDate.getTime())) throw new Error('Invalid date format');
            const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
            return kstDate.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error in adjustTimeZone:', error);
            return '유효하지 않은 날짜';
        }
    };

    const fetchDocData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await apiSpringBoot.get('/api/document/pending', {
                params: { page: page - 1, size: pagingInfo.pageSize, mgrUUID: member.memUUID },
            });

            console.log('Response Data:', response.data);

            const docTypeMap = {
                address: '전입신고서',
                death: '사망신고서',
                basic: '기초연금 신청서',
                medical: '의료급여 신청서',
            };

            const { content: list, totalPages, totalElements } = response.data?.data || {};

            if (!list || list.length === 0) {
                setError('문서를 불러오는 데 실패했습니다.');
                return;
            }

            const adjustedData = list.map((document, index) => ({
                rownum: (page - 1) * pagingInfo.pageSize + index + 1,
                seniorUUID: document.writtenBy,
                doctype: docTypeMap[document.docType] || document.docType,
                docCompleted: adjustTimeZone(document.docCompletedAt),
            }));

            setDocData(adjustedData);
            setPagingInfo((prev) => ({
                ...prev,
                currentPage: page,
                totalPages,
                totalElements,
                startPage: Math.floor((page - 1) / 10) * 10 + 1,
                endPage: Math.min(Math.floor((page - 1) / 10) * 10 + 10, totalPages),
            }));

            // seniorUUID에 해당하는 이름 가져오기
            const seniorUUIDs = adjustedData.map((doc) => doc.seniorUUID);
            fetchSeniorNames(seniorUUIDs);
        } catch (err) {
            console.error('Error fetching document data:', err);
            setError('문서를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSeniorNames = async (seniorUUIDs) => {
        try {
            const namesMap = { ...seniorNames };
            for (const uuid of seniorUUIDs) {
                if (!namesMap[uuid]) { // 이미 가져온 이름은 제외
                    const response = await apiSpringBoot.get(`/api/document/mgrName/${uuid}`);
                    namesMap[uuid] = response.data?.data?.memName || '담당자 미정';
                }
            }
            setSeniorNames(namesMap);
        } catch (error) {
            console.error('담당자 이름을 가져오는 중 에러 발생:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchDocData(page);
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchDocData(pagingInfo.currentPage);
    }, []);

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
                    <span className={dstyles.dMenuName}>공문서 요청 확인</span>
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
                                    <td className={dstyles.dTd}>{seniorNames[document.seniorUUID] || '로딩 중...'}</td>
                                    <td className={dstyles.dTd}>{document.doctype}</td>
                                    <td className={dstyles.dTd}>{document.docCompleted}</td>
                                    <td className={dstyles.dTd}>
                                        <button
                                            onClick={() => navigate(`/seniorlist/sdetailview/${document.seniorUUID}?scrollTo=DocManaged`)}
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
                    pageNumber={pagingInfo.currentPage}
                    listCount={pagingInfo.totalElements}
                    pageSize={pagingInfo.pageSize}
                    maxPage={pagingInfo.totalPages}
                    startPage={pagingInfo.startPage}
                    endPage={pagingInfo.endPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default DocRequestList;
