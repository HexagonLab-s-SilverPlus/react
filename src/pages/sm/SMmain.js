// src/pages/sm/SMmain.js
import React from 'react';
import { Link } from 'react-router-dom';

function SMmain() {
  return (
    <div>
      <h2>상무 메인페이지</h2>
      <ul>
        <li><Link to="/notice/listall">공지사항</Link></li>
        {/*<li><Link to="/book/listall">책</Link></li>
        <li><Link to="/gamerecord/listall">게임</Link></li>*/}
      </ul>
    </div>
  );
}

export default SMmain;
