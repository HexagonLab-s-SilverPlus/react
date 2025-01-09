import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from './DocManaged.module.css';

const DocManaged = () => {
    const [dmData, setDmData] = useState([]);
    const { apiSpringBoot, member } = useContext(AuthContext);

    const docTypeMap = {
        address: "전입신고서",
        death: "사망신고서",
        basic: "기초연금 신청서",
        medical: "의료급여 신청서",
    };

    // 문서 목록을 가져오는 함수
    const fetchDocManaged = async (status = "대기중") => {
        try {
            const response = await apiSpringBoot.get(`/api/document/${member.memUUID}/request`, {
                params: { status }, // 상태에 따라 필터링
            });
            if (response.data && response.data.data && response.data.data.length > 0) {
                console.log(`${status} 상태의 문서 조회:`, response.data.data);
                setDmData(response.data.data);  // 상태에 맞는 문서만 업데이트
            } else {
                console.log('조회할 문서가 없습니다.');
                setDmData([]);  // 데이터가 없으면 빈 배열로 상태 변경
            }
        } catch (error) {
            console.error('문서 데이터를 가져오는 중 에러 발생:', error);
        }
    };

    // 문서 상태 업데이트 (승인 또는 반려)
    const updateDocumentStatus = async (docId, status) => {
        try {
            // 상태 변경 API 호출
            const response = await apiSpringBoot.put(`/api/document/${docId}/approve`, null, {
                params: { status }, // 상태 업데이트 (승인 또는 반려)
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
    useEffect(() => {
        fetchDocManaged(); // 기본적으로 대기중 상태의 문서만 가져옴
    }, [apiSpringBoot, member.memUUID]);

    // 파일 다운로드 함수
    const handleDownload = async (fileName) => {
        try {
            const response = await apiSpringBoot.get(`/api/doc-files/download/${fileName}`, {
                responseType: 'blob', // 파일 다운로드를 위한 Blob 설정
            });

            if (response.status !== 200) {
                throw new Error('파일 다운로드 실패');
            }

            const blob = new Blob([response.data]);
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(downloadUrl);
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
                                    onClick={() => handleDownload(doc.file.dfRename)}
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
        </div>
    );
};

export default DocManaged;
