// src/routers/gameRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ReadyGame from '../pages/game/ReadyGame' // 게임 welcome
import PlayGame from '../pages/game/PlayGame' // 게임 시작


const gameRouter = [
    <>
    <Route path="/game" element={<ReadyGame />} />,
    <Route path="/playgame" element={<PlayGame />} />,
    </>
];

export default gameRouter;
