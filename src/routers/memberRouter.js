// src/routers/memberRouter.js
import React from 'react';
import { Route } from 'react-router-dom';
import EnrollSelect from '../pages/member/EnrollSelect';
import EnrollManager from '../pages/member/EnrollManager';
import EnrollFamily from '../pages/member/EnrollFamily';
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
import FaceLogin from '../pages/member/FaceLogin';
import ProtectedRoute from '../components/common/ProtectedRoute';

const memberRouter = [
  <>
    {/* 회원가입 관련 */}
    <Route path="/enrollselect" element={<EnrollSelect />} />
    <Route path="/enrollmanager" element={<EnrollManager />} />
    <Route path="/enrollfamily" element={<EnrollFamily />} />

    {/* 로그인 관련 */}
    <Route path="/loginmember" element={<LoginMember />} />
    <Route path="/loginsenior" element={<LoginSenior />} />
    <Route path="/facelogin" element={<FaceLogin />} />

    {/* 소셜 */}
    <Route path="/oauth2" element={<Oauth2 />} />

    {/* 아이디, 비밀번호찾기 관련 */}
    <Route path="/findpwdsenior" element={<FindPwdSenior />} />
    <Route path="/findpwdmember" element={<FindPwdMember />} />
    <Route path="/findidsenior" element={<FindIdSenior />} />
    <Route path="/findidmember" element={<FindIdMember />} />
    <Route path="/fimResult" element={<FindIdMemberResult />} />
    <Route path="/fisResult" element={<FindIdSeniorResult />} />
    <Route path="/fpmResult" element={<FindPwdMemberResult />} />
    <Route path="/fpsResult" element={<FindPwdSeniorResult />} />

    {/* 마이페이지 관련 */}
    <Route
      path="/myinfomanager"
      element={<ProtectedRoute element={<MyInfoManager />} />}
    />
    <Route
      path="/myinfofamily"
      element={<ProtectedRoute element={<MyInfoFamily />} />}
    />
    <Route
      path="/myinfoadmin"
      element={<ProtectedRoute element={<MyInfoAdmin />} />}
    />

    {/* 회원관리(관리자) 관련 */}
    <Route
      path="/mlistview"
      element={<ProtectedRoute element={<MemberListView />} />}
    />
    <Route
      path="/mlistview/mdetailview/:UUID"
      element={<ProtectedRoute element={<MemberDetailView />} />}
    />
  </>,
];

export default memberRouter;
