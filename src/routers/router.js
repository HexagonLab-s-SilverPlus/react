// src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import qnaRouter from './qnaRouter'
import Home from '../pages/Home';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       {qnaRouter}
    </Routes>
  );
};

export default AppRouter;