// src/routers/gameRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ReadyGame from '../pages/game/ReadyGame' // 게임 페이지


const gameRouter = [
    <>
    <Route path="/game" element={<ReadyGame />} />,
    </>
];

export default gameRouter;
