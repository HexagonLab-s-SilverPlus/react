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
    <Route path="/noticeRouter/notice" element={<ProtectedRoute element={<NoticeList />} />} />,
    <Route path="/noticeRouter/notice/noticewrite" element={<ProtectedRoute element={<NoticeWrite />} />} />,
    <Route path="/noticeRouter/notice/noticedetail/:notId" element={<ProtectedRoute element={<NoticeDetail />} />} />,
    <Route path="/noticeRouter/notice/noticeupdate/:notId" element={<ProtectedRoute element={<NoticeUpdate />} />} />,
    </>


];

export default noticeRouter;
