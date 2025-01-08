import React, { useState, useEffect, useContext } from 'react';
import styles from './CompletedDocument.module.css';
import { AuthContext } from '../../AuthProvider';
import Container from '../chat/Container';


const CompletedDocument = () => {
    const [documents, setDocuments] = useState([]);
    const { apiSpringBoot, accessToken, member } = useContext(AuthContext);
    const [managerName, setManagerName] = useState('');

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
            const fetchManagerName = async () => {
                try {
                    const response  = await apiSpringBoot.get(`/api/document/mgrName/${member.memUUIDMgr}`);
                    console.log("담당자 멤버 정보: ", response.data.data);
                    setManagerName(response.data?.data.memName|| '담당자 미정');
                } catch (error) {
                    console.error('담당자 이름을 가져오는 중 에러 발생:', error);
                    setManagerName('담당자 미정');
                }
            };
    
            if (member.memUUIDMgr) {
                fetchManagerName();
            }
        }, [apiSpringBoot, member.memUUIDMgr]);

    const handleSubmit = (id) => {
        alert(`문서 ID ${id}가 제출되었습니다.`);
        // 제출 로직 구현
    };

    const handleDownload = (link) => {
        window.location.href = link;
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
                            <td>{doc.document.docType}</td>
                            <td>{doc.document.isApproved}</td>
                            <td>{managerName || '담당자 미정'}</td>
                            <td>{doc.document.approvedAt || '미정'}</td>
                            <td>
                                <button
                                    className={styles.downloadButton}
                                    onClick={() => handleDownload(doc.downloadLink)}
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
