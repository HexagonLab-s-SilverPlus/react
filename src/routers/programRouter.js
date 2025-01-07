// src/routers/programRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ProgramList from '../pages/program/ProgramList';
import ProgramWrite from '../pages/program/ProgramWrite';
import ProgramDetail from '../pages/program/ProgramDetail';
import ProgramUpdate from '../pages/program/ProgramUpdate';
import TestMedical from '../pages/program/TestMedical';

const programRouter = [
    <>
        <Route path="/program" element={<ProgramList />} />,
        <Route path="/program/write" element={<ProgramWrite />} />,
        <Route path="/program/detail/:snrProgramId" element={<ProgramDetail />} />,
        <Route path="/program/update/:snrProgramId" element={<ProgramUpdate />} />,
        <Route path="/program/medical" element={<TestMedical />} />,
    </>
];

export default programRouter;