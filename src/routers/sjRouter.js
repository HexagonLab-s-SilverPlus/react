
// src/routers/tjRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import SJmain from '../pages/sj/SJmain';
import DocMain from '../pages/sj/DocMain';
import DashMain from '../pages/sj/DashMain';





const sjRouter = [
    <Route path="/sjmain" element={<SJmain />} />,
    <Route path="/docmain" element={<DocMain/>}/>,
    <Route path="/dashmain" element={<DashMain/>}/>,
    


];

export default sjRouter;