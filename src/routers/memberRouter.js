// src/routers/memberRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import EnrollSelect from '../pages/member/EnrollSelect';
import EnrollManager from '../pages/member/EnrollManager';
import LoginMember from '../pages/member/LoginMember';

const memberRouter = [
  <Route path="/enrollselect" element={<EnrollSelect />} />,
  <Route path="/enrollmanager" element={<EnrollManager />} />,
  <Route path="/loginmember" element={<LoginMember />} />,
];

export default memberRouter;
