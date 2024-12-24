import React from 'react';
import { Route } from 'react-router-dom';


import DocMain from '../pages/document/DocMain';

const dashboardRouter = [
    
    <Route path="/docmain" element={<DocMain/>}/>,

];

export default dashboardRouter;