import React from 'react';
import { Route } from 'react-router-dom';


import DocMain from '../pages/document/DocMain';
import DocRequestList from '../pages/document/DocReqList';
import DocManaged from '../pages/document/DocManaged';
import ProtectedRoute from '../components/common/ProtectedRoute';

const documentRouter = [
    <>
    <Route path="/documentRouter/docmain" element={<ProtectedRoute element={<DocMain/>}/>}/>,
    <Route path="/documentRouter/docrequest" element={<ProtectedRoute element={<DocRequestList/>}/>}/>,
    <Route path="/documentRouter/documentManaged" element={<ProtectedRoute element={<DocManaged/>}/>}/>,
    </>

];

export default documentRouter;