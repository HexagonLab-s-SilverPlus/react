// src/routers/programRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ProgramList from '../pages/program/ProgramList';
import ProgramWrite from '../pages/program/ProgramWrite';
import ProgramDetail from '../pages/program/ProgramDetail';

const programRouter = [
    <>
    <Route path="/program" element={<ProgramList />} />,
    <Route path="/program/write" element={<ProgramWrite />} />,
    <Route path="/program/detail/:snrProgramId" element={<ProgramDetail />} />,
    </>
];

export default programRouter;