import React from 'react';
import { Route } from 'react-router-dom';
import EYmain from '../pages/ey/chat/EYmain';
import ChatPage from '../pages/ey/chat/ChatPage'; // ChatPage 컴포넌트 import
import SeniorMenu from '../components/SeniorMenu';


// 'eyRouter'를 const로 변경
const eyRouter = (
  <>
    <Route path="/welcome-chat" element={<EYmain />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/senior-menu" element={<SeniorMenu />} />
  </>
);

export default eyRouter;
