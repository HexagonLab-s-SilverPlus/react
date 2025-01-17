import React from 'react';
import { Route } from 'react-router-dom';
import ChatPage from '../pages/chat/ChatPage';
import SeniorMenu from '../components/SeniorMenu';
import ProtectedRoute from '../components/common/ProtectedRoute';
import WelcomeChat from '../pages/chat/WelcomeChat';
import NotFound from '../pages/common/NotFound';
import DocumentChatPage from '../pages/SeniorDocument/DocumentChatPage';
import CompletedDocument from '../pages/SeniorDocument/CompletedDocument';
import TestLottie from '../pages/SeniorDocument/TestLottie';

const eyRouter = [
  <>
    <Route path="/eyRouter/welcome-chat" element={<ProtectedRoute element={<WelcomeChat />} />} />
    <Route path="/eyRouter/senior-menu" element={<ProtectedRoute element={<SeniorMenu />} />} />
    <Route path="/eyRouter/w/:workspaceId" element={<ProtectedRoute element={<ChatPage />} />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/eyRouter/document/:documentType" element={<ProtectedRoute element={<DocumentChatPage  />} />} />
    <Route path="/eyRouter/d/:memUUID" element={<ProtectedRoute element={<CompletedDocument  />} />} />
    <Route path="/eyRouter/lottie" element={<ProtectedRoute element={<TestLottie  />} />} />
  </>
];

export default eyRouter;
