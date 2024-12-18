// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import QnAList from '../pages/qna/QnAList';
import QnAWrite from '../pages/qna/QnAWrite';

const qnaRouter = [
    <>
    <Route path="/qna" element={<QnAList />} />,
    <Route path="/qna/write" element={<QnAWrite />} />,
    </>
];

export default qnaRouter;