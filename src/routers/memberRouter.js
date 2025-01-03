// src/routers/memberRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import EnrollSelect from '../pages/member/EnrollSelect';
import EnrollManager from '../pages/member/EnrollManager';
import LoginMember from '../pages/member/LoginMember';
import LoginSenior from '../pages/member/LoginSenior';
import MyInfoManager from '../pages/member/MyInfoManager';
import MyInfoAdmin from '../pages/member/MyInfoAdmin';
import MyInfoFamily from '../pages/member/MyInfoFamily';
import MemberDetailView from '../pages/member/MemberDetailView';
import MemberListView from '../pages/member/MemberListView';
import FindPwdSenior from '../pages/member/FindPwdSenior';
import FindPwdMember from '../pages/member/FindPwdMember';
import FindIdSenior from '../pages/member/FindIdSenior';
import FindIdMember from '../pages/member/FindIdMember';
import FindIdMemberResult from '../pages/member/FindIdMemberResult';
import FindIdSeniorResult from '../pages/member/FindIdSeniorResult';
import FindPwdMemberResult from '../pages/member/FindPwdMemberResult';
import FindPwdSeniorResult from '../pages/member/FindPwdSeniorResult';
import Oauth2 from '../pages/member/oauth2';

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
    <Route path="/fimResult" element={<FindIdMemberResult />} />,
    <Route path="/fisResult" element={<FindIdSeniorResult />} />,
    <Route path="/fpmResult" element={<FindPwdMemberResult />} />,
    <Route path="/fpsResult" element={<FindPwdSeniorResult />} />,
    <Route path="/oauth2" element={<Oauth2 />} />,
  </>,
];

export default memberRouter;
