import React from 'react';
import { Route } from 'react-router-dom';


import DocMain from '../pages/document/DocMain';
import DocRequestList from '../pages/document/DocReqList';
import DocManaged from '../pages/document/DocManaged';
import ProtectedRoute from '../components/common/ProtectedRoute';

const dashboardRouter = [
    <>
    <Route path="/docmain" element={<ProtectedRoute element={<DocMain/>}/>}/>,
    <Route path="/docrequest" element={<ProtectedRoute element={<DocRequestList/>}/>}/>,
    <Route path="/documentManaged" element={<ProtectedRoute element={<DocManaged/>}/>}/>,
    </>

];

export default dashboardRouter;