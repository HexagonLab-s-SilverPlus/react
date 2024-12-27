// src/routers/programRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ProgramList from '../pages/program/ProgramList';
import ProgramWrite from '../pages/program/ProgramWrite';

const programRouter = [
    <>
    <Route path="/program" element={<ProgramList />} />,
    <Route path="/program/write" element={<ProgramWrite />} />,
    </>
];

export default programRouter;