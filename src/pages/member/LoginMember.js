// src/pages/member/LoginMember.js
import React from 'react';
import styles from './LoginMember.module.css';

const LoginMember = () => {
  return (
    <div className={styles.loginform}>
      <form>
        <table>
          <tr>
            <input
              type="text"
              id="memId"
              name="memId"
              placeholder="아이디"
              className={styles.logininput}
            />
          </tr>
          <tr>
            <input
              type="password"
              id="memPw"
              name="memPw"
              placeholder="비밀번호"
              className={styles.logininput}
            />
          </tr>
        </table>
      </form>
    </div>
  );
};

export default LoginMember;
