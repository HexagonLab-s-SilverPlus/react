// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import FAQList from '../pages/faq/FAQList';
import ProtectedRoute from '../components/common/ProtectedRoute';


const faqRouter = [
    <>
        <Route path="/faq" element={<ProtectedRoute element={<FAQList />} />} />,
    </>
];

export default faqRouter;