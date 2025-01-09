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
                console.log("대기중 상태의 문서 조회:", response.data.data);
                setDmData(response.data.data);
            } else {
                console.log('조회할 대기중 문서가 없습니다.');
                setDmData([]);
            }
        } catch (error) {
            console.error('문서 데이터를 가져오는 중 에러 발생:', error);
        }
    };

    // 문서 상태 업데이트 (승인 또는 반려)
    const updateDocumentStatus = async (docId, status) => {
        try {
            const response = await apiSpringBoot.put(`/api/document/${docId}/approve`, null, {
                params: { status }, // 상태 업데이트 (승인 또는 반려)
            });
            if (response.data.success) {
                console.log("문서 상태 업데이트 성공");
                fetchDocManaged(); // 상태 업데이트 후 다시 대기중 문서 목록 가져오기
            }
        } catch (error) {
            console.error('문서 상태 업데이트 중 에러 발생:', error);
        }
    };

    // 컴포넌트 로드 시 대기중 상태 문서 가져오기
    useEffect(() => {
        fetchDocManaged(); // 대기중 상태의 문서만 가져옴
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
                        <th>상태 변경</th>
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
                            <td>
                                {doc.document.isApproved === "대기중" && (
                                    <>
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
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocManaged;
