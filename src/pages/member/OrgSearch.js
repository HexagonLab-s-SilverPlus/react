// src/pages/member/OrgSearch.js
import React, { useState } from 'react';
import styles from './OrgSearch.module.css'; // 필요한 스타일
import { OrgInfo } from './OrgInfo';

const OrgSearch = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredResults([]);
      return;
    }

    // OrgInfo에서 검색어 필터링
    const results = OrgInfo.filter(
      (org) => org.org.includes(term) || org.add.includes(term)
    );
    setFilteredResults(results);
  };

  return (
    <div className={styles.orgSearchMainContainer}>
      <div>
        <h3>기관 검색</h3>
        <input
          type="text"
          placeholder="기관명 또는 주소를 입력하세요..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.orgSearchbox}
          style={{ marginBottom: '20px' }}
        />
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {filteredResults.map((org, index) => (
            <li
              key={index}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
              onClick={() => onSelect(org)}
            >
              <strong>{org.org}</strong>
              <p>{org.add}</p>
            </li>
          ))}
        </ul>
        {filteredResults.length === 0 && searchTerm.trim() !== '' && (
          <p style={{ color: 'red' }}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default OrgSearch;
