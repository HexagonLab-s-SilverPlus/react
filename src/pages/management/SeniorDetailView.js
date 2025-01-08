// src/pages/management/SeniorDetailView.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SeniorDetailViewManager from './components/SeniorDetailViewManager';
import SeniorDetailViewFamily from './components/SeniorDetailViewFamily';
import SeniorDetailViewFamilyApproval from './components/SeniorDetailViewFamilyApproval';
import { AuthContext } from '../../AuthProvider';
import styles from './SeniorDetailView.module.css';
import loading from '../../assets/images/loading.gif';
import { apiSpringBoot } from '../../utils/axios';
import { convertUTCToKST } from '../../fuction/function';

const SeniorDetailView = () => {
  const { UUID } = useParams();
  const { role } = useContext(AuthContext);
  const [family, setFamily] = useState(); // 가족 데이터 저장 상태변수
  const [senior, setSenior] = useState(); // 어르신 데이터 저장 상태변수
  const [manager, setManager] = useState(); // 담당자 데이터 저장 상태변수
  const [profileData, setProfileData] = useState();

  // 페이지 렌더링 시 정보 받아오기
  useEffect(() => {
    const SeniorDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
        console.log('서버에서 온 정보 객체 확인 : ', response.data.member);
        const updateSeniorData = {
          ...response.data.member,
          memEnrollDate: convertUTCToKST(response.data.member.memEnrollDate),
        };
        setFamily(response.data.familyInfo);
        setManager(response.data.managerInfo);
        setSenior(updateSeniorData);
        setProfileData(response.data.profileData);
      } catch (error) {
        console.error('회원 데이터 조회 실패 : ', error);
      }
    };

    SeniorDetail();
  }, [UUID]);

  if (!family) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  return (
    <>
      {role === 'MANAGER' ? (
        <>
          <SeniorDetailViewManager
            UUID={UUID}
            senior={senior}
            manager={manager}
            profileData={profileData}
          />
          <SeniorDetailViewFamilyApproval UUID={UUID} family={family} />
        </>
      ) : (
        <SeniorDetailViewFamily UUID={UUID} />
      )}
    </>
  );
};

export default SeniorDetailView;
