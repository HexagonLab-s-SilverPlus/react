import React from 'react';
import { Route } from 'react-router-dom';

import DashList from '../pages/dashboard/DashList';

const dashboardRouter = [
    
 <>
    <Route path="/dashlist" element={<DashList/>}/>,
 </>
];

export default dashboardRouter;