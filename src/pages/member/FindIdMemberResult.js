// src/pages/member/FindIdMemberResult.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { apiSpringBoot } from '../../utils/axios';
import styles from './FindIdMember.module.css';
import SeniorFooter from '../../components/common/SeniorFooter';

const FindIdMemberResult = () => {
  useEffect(() => {
    const location = useLocation();
    const verifyData = location.state;

    const FindIdResult = async () => {
      try {
        const response = await apiSpringBoot.post('/');
      } catch (error) {}
    };
  });
};

export default FindIdMemberResult;
