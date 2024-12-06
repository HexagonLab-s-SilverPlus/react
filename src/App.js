import React from 'react';

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import AppRouter from './routers/router'; // 라우터 설정 임포트

function App() {
  return (

    <>
      <Header />
      <AppRouter /> {/* 라우터 설정 */}

    </>
  );
}

export default App;