import React from 'react';
import { Route } from 'react-router-dom';

import DashList from '../pages/dashboard/DashList';

const dashboardRouter = [
    
 <>
 
    <Route path="/dashlist" element={<DashList/>}/>,
    <Route path="/dashboard/:Id" element={<DashList/>}/>,
    <Route path="/dashboard/date/:date"  element={<DashList />} />,
 </>
];

export default dashboardRouter;
