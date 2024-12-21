
// src/routers/tjRouter.js
import React from 'react';
import { Route } from 'react-router-dom';

import DocMain from '../pages/sj/DocMain';
import DashList from '../pages/sj/DashList';





const sjRouter = [
    
    <Route path="/docmain" element={<DocMain/>}/>,
    <Route path="/dashlist" element={<DashList/>}/>,
    


];

export default sjRouter;