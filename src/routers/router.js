//src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// 통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import tjRouter from './tjRouter';
import hsRouter from './hsRouter';
import smRouter from './smRouter';
import sjRouter from './sjRouter';
import siRouter from './siRouter';
import eyRouter from './eyRouter';

const AppRouter = () => {
  // 변수 = () => {}  ==>> 함수임
  return (
    <Routes>
      {/*통합된 라우터 파일*/}
      <Route path="/" element={<Home />} />
      {tjRouter}
      {hsRouter}
      {smRouter}
      {sjRouter}
      {siRouter}
      {eyRouter}
    </Routes>
  );
};

export default AppRouter;
