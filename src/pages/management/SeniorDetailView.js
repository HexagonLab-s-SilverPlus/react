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

//병력관리
import Medical from './components/Medical';
import SideBar from '../../components/common/SideBar';

//응급
import EMGList from '../../components/emg/EMGList';

//공문서
import DocManaged from '../document/DocManaged';

const SeniorDetailView = () => {
  const { UUID } = useParams();
  const { role } = useContext(AuthContext);

  // 서버에서 받아오는 데이터 저장 상태변수 목록
  const [family, setFamily] = useState(); // 가족 데이터 저장 상태변수
  const [senior, setSenior] = useState(); // 어르신 데이터 저장 상태변수
  const [manager, setManager] = useState(); // 담당자 데이터 저장 상태변수
  const [profileData, setProfileData] = useState(); // 어르신 프로필 데이터 저장 상태변수

  const navigate = useNavigate();

  // 페이지 렌더링 시 정보 받아오기
  useEffect(() => {
    const SeniorDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
        console.log(
          '서버에서 온 어르신 정보 객체 확인 : ',
          response.data.member
        );
        console.log(
          '서버에서 온 담당자 정보 객체 확인 : ',
          response.data.managerInfo
        );
        console.log(
          '서버에서 온 가족 정보 객체 확인 : ',
          response.data.familyInfo
        );
        const updateSeniorData = {
          ...response.data.member,
          memEnrollDate: convertUTCToKST(response.data.member.memEnrollDate),
        };
        if (response.data.familyInfo) {
          setFamily(response.data.familyInfo);
        }
        if (response.data.managerInfo) {
          setManager(response.data.managerInfo);
        }
        setSenior(updateSeniorData);
        setProfileData(response.data.profileData);
      } catch (error) {
        console.error('회원 데이터 조회 실패 : ', error);
      }
    };

    SeniorDetail();
  }, [UUID]);

  if (!senior) {
    return (
      <div className={styles.loading}>
        <img src={loading} />
        <p>loading.....</p>
      </div>
    );
  }

  return (
    <div className={styles.snrDetailViewWrap}>
      <SideBar />
      {role === 'MANAGER' ? (
        <div className={styles.snrDetailViewRight}>
          <SeniorDetailViewManager
            UUID={UUID}
            senior={senior}
            manager={manager}
            profileData={profileData}
          />
          <SeniorDetailViewFamilyApproval
            UUID={UUID}
            family={family}
            senior={senior}
          />
          <Medical UUID={UUID} />
          <DocManaged UUID={UUID} />
          <EMGList emgSnrUUID={UUID} />
          <button className={styles.moveSnrDetailBtn} onClick={() => navigate(-1)}>목록</button>
        </div>
      ) : (
        <div className={styles.snrDetailViewRight}>
          <SeniorDetailViewFamily UUID={UUID} />
          <Medical UUID={UUID} />
          <EMGList emgSnrUUID={UUID} />
          <DocManaged UUID={UUID} />
          <button className={styles.moveSnrDetailBtn} onClick={() => navigate(-1)}>목록</button>
        </div>
      )}
    </div>
  );
};

export default SeniorDetailView;
