// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/notice/NoticeList'; // 공지사항 목록
import NoticeWrite from '../pages/notice/NoticeWrite'; // 공지사항 쓰기기


const noticeRouter = [
    <Route path="/notice" element={<NoticeList />} />,
    <Route path="/noticeWrite" element={<NoticeWrite />} />,

];

export default noticeRouter;
