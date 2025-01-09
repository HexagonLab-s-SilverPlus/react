// src/routers/managementRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import SeniorList from '../pages/management/SeniorList';
import SeniorDetailView from '../pages/management/SeniorDetailView';
import SeniorRegist from '../pages/management/SeniorRegist';
import ProtectedRoute from '../components/common/ProtectedRoute';

const managementRouter = [
  <>
    <Route path="/seniorlist" element={<ProtectedRoute element={<SeniorList />} />} />,
    <Route path="/seniorlist/sdetailview/:UUID" element={<ProtectedRoute element={<SeniorDetailView />} />} />,
    <Route path="/seniorlist/seniorregist" element={<ProtectedRoute element={<SeniorRegist />} />} />,
  </>,
];

export default managementRouter;