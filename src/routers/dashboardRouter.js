import React from 'react';
import { Route } from 'react-router-dom';

import DashList from '../pages/dashboard/DashList';
import ProtectedRoute from '../components/common/ProtectedRoute';

const dashboardRouter = [
    
 <>


    <Route path="/dashboardRouter/dashlist" element={<ProtectedRoute element={<DashList/>}/>}/>,
    <Route path="/dashboardRouter/dashboard/:Id" element={<ProtectedRoute element={<DashList/>}/>}/>,
    <Route path="/dashboardRouter/dashboard/date/:date"  element={<ProtectedRoute element={<DashList />} />}/>,
 </>
];

export default dashboardRouter;
