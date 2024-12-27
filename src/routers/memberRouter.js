// src/routers/memberRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import EnrollSelect from '../pages/member/EnrollSelect';
import EnrollManager from '../pages/member/EnrollManager';
import LoginMember from '../pages/member/LoginMember';
import LoginSenior from '../pages/member/LoginSenior';

const memberRouter = [
  <>
    <Route path="/enrollselect" element={<EnrollSelect />} />,
    <Route path="/enrollmanager" element={<EnrollManager />} />,
    <Route path="/loginmember" element={<LoginMember />} />,
    <Route path="/loginsenior" element={<LoginSenior />} />,
    <Route path="/myinfomanager" element={<MyInfoManager />} />,
    <Route path="/myinfofamily" element={<MyInfoFamily />} />,
    <Route path="/myinfoadmin" element={<MyInfoAdmin />} />,
    <Route path="/mlistview" element={<MemberListView />} />,
    <Route path="/mdetailview/:UUID" element={<MemberDetailView />} />,
    <Route path="/findpwdsenior" element={<FindPwdSenior />} />,
    <Route path="/findpwdmember" element={<FindPwdMember />} />,
    <Route path="/findidsenior" element={<FindIdSenior />} />,
    <Route path="/findidmember" element={<FindIdMember />} />,
  </>,
];

export default memberRouter;
