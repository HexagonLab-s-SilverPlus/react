// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import QnAList from '../pages/qna/QnAList';
import QnAWrite from '../pages/qna/QnAWrite';
import QnADetail from '../pages/qna/QnADetail';
import QnAUpdate from '../pages/qna/QnAUpdate';
import QnAAnswer from '../pages/qna/QnAAnswer';
import ProtectedRoute from '../components/common/ProtectedRoute';



const qnaRouter = [
    <>
        <Route path="/qna" element={<ProtectedRoute element={<QnAList />} />} />,
        <Route path="/qna/write" element={<ProtectedRoute element={<QnAWrite />} />} />,
        <Route path="/qna/detail/:qnaUUID" element={<ProtectedRoute element={<QnADetail />} />} />,
        <Route path="/qna/update/:qnaUUID" element={<ProtectedRoute element={<QnAUpdate />} />} />,
        <Route path="/qna/answer/:qnaUUID" element={<ProtectedRoute element={<QnAAnswer />} />} />,

    </>
];

export default qnaRouter;