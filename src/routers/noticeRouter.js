// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/notice/NoticeList'; // 공지사항 목록
import NoticeWrite from '../pages/notice/NoticeWrite'; // 공지사항 쓰기기
import NoticeDetail from '../pages/notice/NoticeDetail'; // 공지사항 상세보기

const noticeRouter = [
    <>
    <Route path="/notice" element={<NoticeList />} />,
    <Route path="/noticewrite" element={<NoticeWrite />} />,
    <Route path="/noticedetail/:notId" element={<NoticeDetail />} />,
    </>


];

export default noticeRouter;
