import React from 'react';
import { Route } from 'react-router-dom';

import DashList from '../pages/dashboard/DashList';
import ProtectedRoute from '../components/common/ProtectedRoute';

const dashboardRouter = [
    
 <>


    <Route path="/sjRouter/dashlist" element={<ProtectedRoute element={<DashList/>}/>}/>,
    <Route path="/sjRouter/dashboard/:Id" element={<ProtectedRoute element={<DashList/>}/>}/>,
    <Route path="/sjRouter/dashboard/date/:date"  element={<ProtectedRoute element={<DashList />} />}/>,
 </>
];

export default dashboardRouter;
