import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from './DocManaged.module.css';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';


const DocManaged = ({ UUID }) => {
    const [dmData, setDmData] = useState([]);
    const { apiSpringBoot, member } = useContext(AuthContext);
    // const memUuid = 'CECE02F57F344658B7482F5F59F7F998';
    const memUuid = member.memUUID;
    const snrUuid = UUID;

    //페이징 

    const [pagingInfo, setPagingInfo] = useState({
        memUuid: memUuid,
        pageNumber: 1,
        action: '대기중',
        listCount: 0,
        maxPage: 1,
        pageSize: 5,
        startPage: 1,
        endPage: 1,
        keyword: '',
    });

    const docTypeMap = {
        address: "전입신고서",
        death: "사망신고서",
        basic: "기초연금 신청서",
        medical: "의료급여 신청서",
    };

    // 문서 목록을 가져오는 함수
    const fetchDocManaged = async (status) => {
        // console.log("Sending request with pageNumber:", pagingInfo.pageNumber);  // pageNumber 확인
        try {

            // console.log('action 이라구 : ', status);
            const action = status === undefined ? '대기중' : status;

            const response = await apiSpringBoot.get(`/api/document/${snrUuid}/request`, {
                params: {
                    action: action,
                    pageNumber: pagingInfo.pageNumber,
                    pageSize: pagingInfo.pageSize,
                    listCount: pagingInfo.listCount,  // 기본값 설정
                    keyword: pagingInfo.keyword,
                },
            });

            console.log('listcount',response.data.data);

            // console.log('API Response : ', response.data.data);
            // console.log('action : ', response.data.data.action);

            if (response.data && response.data.data) {
                setDmData(response.data.data.documents || []);
            } else {
                setDmData([]);
            }

            // 페이징 관련 정보 업데이트
            if (response.data.data) {
                const { maxPage, startPage, endPage } = PagingCalculate(
                    response.data.data.pageNumber,
                    response.data.data.listCount,
                    response.data.data.pageSize
                );

                setPagingInfo((prev) => ({
                    ...prev,
                    action: response.data.data.action,
                    listCount:response.data.data.listCount,
                    pageNumber: response.data.data.pageNumber || 1,
                    maxPage,
                    startPage,
                    endPage,
                }));
            } else {
                setPagingInfo((prev) => ({
                    ...prev,
                    action: response.data.data.action,
                    listCount:response.data.data.listCount,
                    pageNumber: 1,
                    maxPage: 1,
                    startPage: 1,
                    endPage: 1,
                }));
            }
        } catch (error) {
            console.error('문서 데이터를 가져오는 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        console.log('Member - uuid : ', member.memUUID);
        // 페이지 번호나 UUID가 변경될 때 데이터를 가져오고 상태 초기화
        fetchDocManaged();
    }, [apiSpringBoot, member.memUUID, pagingInfo.pageNumber]);

    const handlePageChange = (page) => {
        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: page,
        }));
    };

    // 문서 상태 업데이트 (승인 또는 반려)
    // const updateDocumentStatus = async (docId, status) => {
    //     try {
    //         // 상태 변경 API 호출
    //         const response = await apiSpringBoot.put(`/api/document/${docId}/approve`, null, {
    //             params: { status }, // 상태 업데이트 (승인 또는 반려)
    //         });

    //         // 백엔드에서 성공적으로 처리된 경우
    //         if (response.data.success) {
    //             console.log("문서 상태 업데이트 성공");
    //             // 문서 목록을 갱신하여 상태 변경을 반영
    //             fetchDocManaged(status); // 상태 업데이트 후 해당 상태의 문서만 가져오기
    //             window.location.reload();  // 페이지 새로고침
    //         }
    //     } catch (error) {
    //         console.error('문서 상태 업데이트 중 에러 발생:', error);
    //     }
    // };

    const updateDocumentStatus = async (docId, status) => {
        try {
            // 승인자 UUID와 승인 시각 설정
            const approvedBy = member.memUUID;  // 현재 로그인한 사용자의 UUID
            const approvedAt = new Date().toISOString();  // 현재 시간

            // 상태 변경 API 호출
            const response = await apiSpringBoot.put(`/api/document/${docId}/approve`, null, {
                params: {
                    status,
                    approvedBy,  // 승인자 UUID
                    approvedAt   // 승인 시각
                },
            });

            // 백엔드에서 성공적으로 처리된 경우
            if (response.data.success) {
                console.log("문서 상태 업데이트 성공");
                // 문서 목록을 갱신하여 상태 변경을 반영
                fetchDocManaged(status); // 상태 업데이트 후 해당 상태의 문서만 가져오기
                window.location.reload();  // 페이지 새로고침
            }
        } catch (error) {
            console.error('문서 상태 업데이트 중 에러 발생:', error);
        }
    };

    // 컴포넌트 로드 시 대기중 상태 문서 가져오기
    // useEffect(() => {
    //     fetchDocManaged(); // 기본적으로 대기중 상태의 문서만 가져옴
    // }, [apiSpringBoot, member.memUUID]);

    // 파일 다운로드 함수
    const handleDownload = async (fileName) => {
        try {
            // 파일 다운로드 요청 (Blob 형식으로 반환)
            const response = await apiSpringBoot.get(`/api/doc-files/download/${fileName}`, {
                responseType: 'blob', // 파일 다운로드를 위한 Blob 설정
            });

            if (response.status !== 200) {
                throw new Error('파일 다운로드 실패');
            }

            // Blob 데이터를 다운로드 링크로 변환하여 파일 다운로드 처리
            const blob = new Blob([response.data]);
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName; // 다운로드할 파일 이름 지정
            document.body.appendChild(link);
            link.click(); // 링크 클릭하여 다운로드 시작
            link.remove(); // 다운로드 후 링크 제거
            URL.revokeObjectURL(downloadUrl); // URL 객체 메모리 해제
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
        }
    };

    // 상태 변경 버튼 보이기 여부 결정
    const isStatusChangeVisible = (status) => {
        return status === "대기중"; // "대기중" 상태에서만 상태 변경 버튼이 보이게 함
    };

    return (
        <div className={styles.dmcontainer}>
            <div className={styles.dmTop}>
                <h1>공문서 확인</h1>
                <div className={styles.dmline}>
                    <button onClick={() => fetchDocManaged("대기중")}>공문서 승인 요청</button>
                    <button onClick={() => fetchDocManaged("승인")}>공문서 승인 완료</button>
                    <button onClick={() => fetchDocManaged("반려")}>공문서 승인 반려</button>
                </div>
            </div>

            <table className={styles.dmTable}>
                <thead>
                    <tr>
                        <th>작성일자</th>
                        <th>공문서 유형</th>
                        <th>처리 여부</th>
                        <th>파일 다운로드</th>
                        {/* 상태 변경 열을 동적으로 표시 */}
                        {isStatusChangeVisible(dmData[0]?.document?.isApproved) && <th>상태 변경</th>}
                    </tr>
                </thead>

                <tbody>
                    {dmData.map((doc) => (
                        <tr className={styles.dmItem} key={doc.document.docId}>
                            <td>{new Date(doc.document.docCompletedAt).toLocaleString('ko-KR', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            })}</td>
                            <td>{docTypeMap[doc.document.docType]}</td>
                            <td>{doc.document.isApproved}</td>
                            <td>
                                <button
                                    className={styles.downloadButton}
                                    onClick={() => handleDownload(doc.file.dfRename)} // 파일 다운로드
                                >
                                    다운로드
                                </button>
                            </td>
                            {/* 상태 변경 버튼을 "대기중"일 경우에만 보이도록 설정 */}
                            {doc.document.isApproved === "대기중" && (
                                <td>
                                    <button
                                        className={styles.approveButton}
                                        onClick={() => updateDocumentStatus(doc.document.docId, "승인")}
                                    >
                                        승인
                                    </button>
                                    <button
                                        className={styles.rejectButton}
                                        onClick={() => updateDocumentStatus(doc.document.docId, "반려")}
                                    >
                                        반려
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {pagingInfo && pagingInfo.listCount != 0 && (<Paging
                pageNumber={pagingInfo.pageNumber}
                listCount={pagingInfo.listCount}
                maxPage={pagingInfo.maxPage}
                startPage={pagingInfo.startPage}
                endPage={pagingInfo.endPage}
                onPageChange={(page) => handlePageChange(page)}
            />
            )}
        </div>
    );
};

export default DocManaged;
