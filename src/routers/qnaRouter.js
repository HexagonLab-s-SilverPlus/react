// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import QnAList from '../pages/qna/QnAList';
import QnAWrite from '../pages/qna/QnAWrite';
import QnADetail from '../pages/qna/QnADetail';
import QnAUpdate from '../pages/qna/QnAUpdate';
import QnAAnswer from '../pages/qna/QnAAnswer';
import ModalEMG from '../components/common/ModalEMG'
import ProtectedRoute from '../components/common/ProtectedRoute';



const qnaRouter = [
    <>
        <Route path="/qnarouter/qna" element={<ProtectedRoute element={<QnAList />} />} />,
        <Route path="/qnarouter/qna/write" element={<ProtectedRoute element={<QnAWrite />} />} />,
        <Route path="/qnarouter/qna/detail/:qnaUUID" element={<ProtectedRoute element={<QnADetail />} />} />,
        <Route path="/qna/update/:qnaUUID" element={<ProtectedRoute element={<QnAUpdate />} />} />,
        <Route path="/qnarouter/qna/answer/:qnaUUID" element={<ProtectedRoute element={<QnAAnswer />} />} />,
        <Route path="/qnarouter/emg/modal" element={<ProtectedRoute element={<ModalEMG />} />} />,

    </>
];

export default qnaRouter;