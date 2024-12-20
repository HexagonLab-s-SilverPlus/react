import React from 'react';
import { Route } from 'react-router-dom';
import ChatPage from '../pages/ey/chat/ChatPage'; // ChatPage 컴포넌트 import
import SeniorMenu from '../components/SeniorMenu';
import WelcomeChat from '../pages/ey/chat/WelcomeChat';

// 'eyRouter'를 const로 변경
const eyRouter = (
  <>
    <Route path="/welcome-chat" element={<WelcomeChat />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/senior-menu" element={<SeniorMenu />} />
    <Route path="/w/:workspaceId" element={<ChatPage />}/>
  </>
);

export default eyRouter;
