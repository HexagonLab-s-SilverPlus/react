// src/routers/managementRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import SeniorList from '../pages/management/SeniorList';
import SeniorDetailView from '../pages/management/SeniorDetailView';
import SeniorRegist from '../pages/management/SeniorRegist';

const managementRouter = [
  <>
    <Route path="/seniorlist" element={<SeniorList />} />
    <Route path="/sdetailview" element={<SeniorDetailView />} />
    <Route path="/seniorregist" element={<SeniorRegist />} />
  </>,
];

export default managementRouter;
