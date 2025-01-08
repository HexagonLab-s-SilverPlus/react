import React, { useState, useEffect, useContext } from 'react';
import styles from './CompletedDocument.module.css';
import { AuthContext } from '../../AuthProvider';
import Container from '../chat/Container';


// 문서 유형 매핑 테이블
const documentTypeMap = {
    address: '전입신고서',
    death: '사망신고서',
    medical: '의료급여 신청서',
    basic: '기초연금 신청서',
};

const CompletedDocument = () => {
    const [documents, setDocuments] = useState([]);
    const { apiSpringBoot, accessToken, member } = useContext(AuthContext);
    const [managerName, setManagerName] = useState('');
    const [managerPhone, setManagerPhone] = useState('');


    // 데이터 가져오기
    useEffect(() => {
        // 예시 데이터
        const fetchDocuments = async () => {
            try {
                // 비동기 요청에서 응답 대기
                const response = await apiSpringBoot.get(`/api/document/${member.memUUID}/with-files`);
                if (response.data && response.data.data && response.data.data.length > 0) {
                    console.log("조회한 문서와 파일 데이터: ", response.data.data);
                    setDocuments(response.data.data);
                }
                else {
                    console.log('조회할 문서와 파일이 없습니다.');
                    setDocuments([]);
                }
            } catch (error) {
                console.error('문서 데이터를 가져오는 중 에러 발생:', error);
            }
        };

        fetchDocuments();
    }, [apiSpringBoot, member.memUUID]);



    // 담당자 이름 가져오기
    useEffect(() => {
        const fetchManager = async () => {
            try {
                const response = await apiSpringBoot.get(`/api/document/mgrName/${member.memUUIDMgr}`);
                console.log("담당자 멤버 정보: ", response.data.data);
                setManagerName(response.data?.data.memName || '미제공');
                setManagerPhone(response.data?.data?.memCellphone || '미제공')
            } catch (error) {
                console.error('담당자 이름을 가져오는 중 에러 발생:', error);
                setManagerName('담당자 미정');
            }
        };

        if (member.memUUIDMgr) {
            fetchManager();
        }
    }, [apiSpringBoot, member.memUUIDMgr]);

    const handleSubmit = (id) => {
        alert(`문서 ID ${id}가 제출되었습니다.`);
        // 제출 로직 구현
    };




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
        <div className={styles.container}>
            <h2 className={styles.title}>완료된 공문서</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>작성일자</th>
                        <th>공문서 타입</th>
                        <th>처리여부</th>
                        <th>담당자 이름</th>
                        <th>담당자 전화번호</th>
                        <th>승인날짜</th>
                        <th>파일 다운로드</th>
                        <th>제출</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.document.docId}>
                            <td>{new Date(doc.document.docCompletedAt).toLocaleString('ko-KR', {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit'
                            })}</td>
                            <td>{documentTypeMap[doc.document.docType]}</td>
                            <td>{doc.document.isApproved}</td>
                            <td>{managerName || '담당자 미정'}</td>
                            <td>{managerPhone || '담당자 미정'}</td>
                            <td>{doc.document.approvedAt || '미정'}</td>
                            <td>
                                <button
                                    className={styles.downloadButton}
                                    onClick={() => handleDownload(doc.file.dfRename)}
                                >
                                    다운로드
                                </button>
                            </td>
                            <td>
                                
                                <button
                                    className={styles.submitButton}
                                    onClick={() => handleSubmit(doc.id)}
                                >
                                    제출
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompletedDocument;
