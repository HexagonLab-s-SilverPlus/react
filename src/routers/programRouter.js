// src/routers/programRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import ProgramList from '../pages/program/ProgramList';
import ProgramWrite from '../pages/program/ProgramWrite';
import ProgramDetail from '../pages/program/ProgramDetail';
import ProgramUpdate from '../pages/program/ProgramUpdate';
import ProtectedRoute from '../components/common/ProtectedRoute';

const programRouter = [
    <>
        <Route path="/program" element={<ProtectedRoute element={<ProgramList />} />} />,
        <Route path="/program/write" element={<ProtectedRoute element={<ProgramWrite />} />} />,
        <Route path="/program/detail/:snrProgramId" element={<ProtectedRoute element={<ProgramDetail />} />} />,
        <Route path="/program/update/:snrProgramId" element={<ProtectedRoute element={<ProgramUpdate />} />} />,
    </>
];

export default programRouter;