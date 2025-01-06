// src/routers/noticeRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import FAQList from '../pages/faq/FAQList';



const faqRouter = [
    <>
        <Route path="/faq" element={<FAQList />} />,
    </>
];

export default faqRouter;