//src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// 통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import memberRouter from './memberRouter';
import noticeRouter from './noticeRouter';
import dashboardRouter from './dashboardRouter';
import documentRouter from './documentRouter';
import eyRouter from './eyRouter';
import qnaRouter from './qnaRouter';
import faqRouter from './faqRouter';
import gameRouter from './gameRouter';
import WelcomePage from '../components/common/WelcomePage';
import programRouter from './programRouter';
import bookRouter from './bookRouter';

const AppRouter = () => {
  // 변수 = () => {}  ==>> 함수임
  return (
    <Routes>
      {/*통합된 라우터 파일*/}
      <Route path="/" element={<WelcomePage />} />
      {/* {memberRouter}
      {noticeRouter}
      {dashboardRouter}
      {documentRouter}
      {siRouter}
      {eyRouter}
      {qnaRouter}
      {faqRouter}
      {gameRouter}
      {programRouter} */}



      {/*  2024-12-27 (by 최은영)
        각 라우트 배열을 map을 사용해 순회하며 고유한 key 값을 부여함으로써 
        Each child in a list should have a unique "key" prop 에러 해결함
        혹시나 몰라서 기존의 간단한 라우트 코드는 주석 처리해둠
      */}

      {/*
        React.cloneElement: 각 Route 요소에 key 값을 동적으로 추가함
        key 값 생성: 배열의 index를 이용해 라우터 이름과 번호를 조합한 고유한 key 값 부여
      */}
      {memberRouter.map((route, index) => React.cloneElement(route, { key: `member-${index}` }))}
      {noticeRouter.map((route, index) => React.cloneElement(route, { key: `notice-${index}` }))}
      {dashboardRouter.map((route, index) => React.cloneElement(route, { key: `dashboard-${index}` }))}
      {documentRouter.map((route, index) => React.cloneElement(route, { key: `document-${index}` }))}
      {eyRouter.map((route, index) => React.cloneElement(route, { key: `ey-${index}` }))}
      {qnaRouter.map((route, index) => React.cloneElement(route, { key: `qna-${index}` }))}
      {faqRouter.map((route, index) => React.cloneElement(route, { key: `qna-${index}` }))}
      {gameRouter.map((route, index) => React.cloneElement(route, { key: `game-${index}` }))}
      {programRouter.map((route, index) => React.cloneElement(route, { key: `program-${index}` }))}
      {bookRouter.map((route, index) => React.cloneElement(route, { key: `bookRouter-${index}` }))}
    </Routes>
  );
};

export default AppRouter;
