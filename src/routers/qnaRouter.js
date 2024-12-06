// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import QNAList from '../pages/qna/QNAList';

const noticeRouter = [
    <Route path="/qna" element={<QNAList />} />,
];

export default noticeRouter;