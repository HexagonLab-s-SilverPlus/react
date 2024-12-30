// src/pages/member/FindIdMember.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindIdMember.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindIdMember = () => {
  const [selectOption, setSelectOption] = useState('phone');
  const handleSelectOption = (e) => {
    setSelectOption(e.target.value);
  };

  return (
    <>
      <div className={styles.findIdMainContainer}>
        <div className={styles.findNavigate}>
          <button className={styles.findNavigateBtn1}>아이디찾기</button>
          <button className={styles.findNavigateBtn2}>비밀번호찾기</button>
        </div>
        <div className={styles.findIdSubContainer}>
          <div className={styles.findIdPhoneContainer}>
            <label className={styles.findIdlabel}>
              <input
                type="radio"
                value="phone"
                checked={selectOption === 'phone'}
                onClick={handleSelectOption}
              />{' '}
              휴대전화로 인증하기
            </label>
            {selectOption === 'phone' && (
              <div>
                <table className={styles.findIdPhoneTable}>
                  <tr>
                    <td>이름</td>
                  </tr>
                  <tr>
                    <input />
                  </tr>
                  <tr>
                    <td>전화번호</td>
                  </tr>
                  <tr>
                    <input name="memCellphone" style={{ width: '260px' }} />
                    <button className={styles.findIdPhoneTableBtn}>
                      인증번호받기
                    </button>
                  </tr>
                  <tr>
                    <input name="phoneAuthNum" style={{ width: '260px' }} />
                    <button className={styles.findIdPhoneTableBtn}>
                      인 증
                    </button>
                  </tr>
                </table>
              </div>
            )}
          </div>

          <div className={styles.findIdEmailContainer}>
            <label className={styles.findIdlabel}>
              <input
                type="radio"
                value="email"
                checked={selectOption === 'email'}
                onChange={handleSelectOption}
              />{' '}
              이메일로 인증하기
            </label>
            {selectOption === 'email' && (
              <div>
                <table className={styles.findIdEmaileTable}>
                  <tr>
                    <td>이름</td>
                  </tr>
                  <tr>
                    <input />
                  </tr>
                  <tr>
                    <td>이메일</td>
                  </tr>
                  <tr>
                    <input name="emailId" style={{ width: '130px' }} />
                    <span className={styles.findIdEmailSpan}>@</span>
                    <input name="domain" style={{ width: '130px' }} />
                    <select name="domainOption">
                      <option>직접입력</option>
                      <option>네이버</option>
                      <option>구글</option>
                      <option>한메일</option>
                      <option>네이트</option>
                    </select>
                  </tr>
                  <tr>
                    <button
                      className={styles.findIdEmailTableBtn}
                      style={{ margin: 0 }}
                    >
                      인증번호받기
                    </button>
                  </tr>
                  <tr>
                    <input name="emailAuthNum" style={{ width: '290px' }} />
                    <button className={styles.findIdEmailTableBtn}>
                      인 증
                    </button>
                  </tr>
                </table>
              </div>
            )}
          </div>
          <div className={styles.buttonDiv}>
            <button
              className={styles.button}
              style={{
                marginRight: '80px',
                backgroundColor: '#D9D9D9',
                color: '#333333',
                border: 0,
              }}
            >
              이 전
            </button>
            <button className={styles.button}>다 음</button>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <SeniorFooter></SeniorFooter>
      </div>
    </>
  );
};

export default FindIdMember;
