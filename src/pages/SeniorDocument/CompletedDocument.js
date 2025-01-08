import React, { useState, useEffect } from 'react';
import styles from './CompletedDocument.module.css';

const CompletedDocument = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // 예시 데이터
    const fetchDocuments = async () => {
      const exampleData = [
        {
          id: 1,
          documentType: '전입신고서',
          submissionDate: '2025-01-05',
          status: '승인',
          officerName: '김담당',
          approvalDate: '2025-01-06',
          downloadLink: '/files/sample1.csv',
        },
        {
          id: 2,
          documentType: '사망신고서',
          submissionDate: '2025-01-03',
          status: '반려',
          officerName: '박담당',
          approvalDate: '',
          downloadLink: '/files/sample2.csv',
        },
      ];
      setDocuments(exampleData);
    };

    fetchDocuments();
  }, []);

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
            <tr key={doc.id}>
              <td>{doc.submissionDate}</td>
              <td>{doc.documentType}</td>
              <td>{doc.status}</td>
              <td>{doc.officerName}</td>
              <td>{doc.approvalDate || '미정'}</td>
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
