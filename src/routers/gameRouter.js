// src/routers/gameRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ReadyGame from '../pages/game/ReadyGame' // 게임 welcome
import PlayGame from '../pages/game/PlayGame' // 게임 시작
import ProtectedRoute from '../components/common/ProtectedRoute';



const gameRouter = [
    <>
    <Route path="/game" element={<ProtectedRoute element={<ReadyGame />} />} />,
    <Route path="/playgame" element={<ProtectedRoute element={<PlayGame />} />} />,
    </>
];

export default gameRouter;
