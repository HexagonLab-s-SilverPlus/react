import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRouter from './routers/router'; // 라우터 설정 임포트

function App() {
  return (
    <>     
      <AppRouter />
    </>
  );
}

export default App;