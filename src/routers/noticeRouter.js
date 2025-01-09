// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/notice/NoticeList'; // 공지사항 목록
import NoticeWrite from '../pages/notice/NoticeWrite'; // 공지사항 쓰기기
import NoticeDetail from '../pages/notice/NoticeDetail'; // 공지사항 상세보기
import NoticeUpdate from '../pages/notice/NoticeUpdate'; // 공지사항 수정
import ProtectedRoute from '../components/common/ProtectedRoute';

const noticeRouter = [
    <>
    <Route path="/notice" element={<ProtectedRoute element={<NoticeList />} />} />,
    <Route path="/noticewrite" element={<ProtectedRoute element={<NoticeWrite />} />} />,
    <Route path="/noticedetail/:notId" element={<ProtectedRoute element={<NoticeDetail />} />} />,
    <Route path="/noticeupdate/:notId" element={<ProtectedRoute element={<NoticeUpdate />} />} />,
    </>


];

export default noticeRouter;
