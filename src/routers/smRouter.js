// src/routers/tjRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/notice/NoticeList'; // 공지사항 목록
import ReadyGame from '../pages/game/ReadyGame' // 게임 페이지


const smRouter = [
    <Route path="/notice" element={<NoticeList />} />,
    <Route path="/game" element={<ReadyGame />} />,
];

export default smRouter;
