// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import QnAList from '../pages/qna/QnAList';
import QnAWrite from '../pages/qna/QnAWrite';
import QnADetail from '../pages/qna/QnADetail';
import QnAUpdate from '../pages/qna/QnAUpdate';
import QnAAnswer from '../pages/qna/QnAAnswer';
import EMGTest from '../pages/emg/EMGTest';
import EMGListTest from '../pages/emg/EMGListTest'
import EMGList from '../components/emg/EMGList';


const qnaRouter = [
    <>
        <Route path="/qna" element={<QnAList />} />,
        <Route path="/qna/write" element={<QnAWrite />} />,
        <Route path="/qna/detail/:qnaUUID" element={<QnADetail />} />,
        <Route path="/qna/update/:qnaUUID" element={<QnAUpdate />} />,
        <Route path="/qna/answer/:qnaUUID" element={<QnAAnswer />} />,
        <Route path="/emg" element={<EMGTest />} />,
        <Route path="/emg/test" element={<EMGList />} />,
        <Route path="/emg/listtest" element={<EMGListTest />} />,
    </>
];

export default qnaRouter;