import React from 'react';
import { Route } from 'react-router-dom';
import ChatPage from '../pages/ey/chat/ChatPage';
import SeniorMenu from '../components/SeniorMenu';
import ProtectedRoute from '../components/common/ProtectedRoute';
import WelcomeChat from '../pages/ey/chat/WelcomeChat';

const eyRouter = [
  <>
    <Route path="/welcome-chat" element={<ProtectedRoute element={<WelcomeChat />} />} />
    <Route path="/senior-menu" element={<ProtectedRoute element={<SeniorMenu />} />} />
    <Route path="/w/:workspaceId" element={<ProtectedRoute element={<ChatPage />} />} />
  </>
];

export default eyRouter;
