//src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// 통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import memberRouter from './memberRouter';
import noticeRouter from './noticeRouter';
import dashboardRouter from './dashboardRouter';
import documentRouter from './documentRouter';
import siRouter from './siRouter';
import eyRouter from './eyRouter';
import qnaRouter from './qnaRouter';
import gameRouter from './gameRouter';
import WelcomePage from '../components/common/WelcomePage';
import programRouter from './programRouter';

const AppRouter = () => {
  // 변수 = () => {}  ==>> 함수임
  return (
    <Routes>
      {/*통합된 라우터 파일*/}
      <Route path="/" element={<WelcomePage />} />
      {memberRouter}
      {noticeRouter}
      {dashboardRouter}
      {documentRouter}
      {siRouter}
      {eyRouter}
      {qnaRouter}
      {gameRouter}
      {programRouter}
    </Routes>
  );
};

export default AppRouter;
