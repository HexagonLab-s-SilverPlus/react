// src/routers/tjRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import SMmain from '../pages/sm/SMmain';  // 개인 메인 페이지
import NoticeList from '../pages/notice/NoticeList'; // 공지사항 목록


const smRouter = [
    <Route path="/smmain" element={<SMmain />} />,
    <Route path="/notice/listall" element={<NoticeList />} />,
];

export default smRouter;
