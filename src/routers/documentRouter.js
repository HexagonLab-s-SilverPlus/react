import React from 'react';
import { Route } from 'react-router-dom';


import DocMain from '../pages/document/DocMain';
import DocRequestList from '../pages/document/DocReqList';
import DocManaged from '../pages/document/DocManaged';

const dashboardRouter = [
    <>
    <Route path="/docmain" element={<DocMain/>}/>,
    <Route path="/docrequest" element={<DocRequestList/>}/>,
    <Route path="/documentManaged" element={<DocManaged/>}/>,
    </>

];

export default dashboardRouter;