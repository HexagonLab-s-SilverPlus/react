import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SeniorDetailViewManager from './components/SeniorDetailViewManager';
import SeniorDetailViewFamily from './components/SeniorDetailViewFamily';
import SeniorDetailViewFamilyApproval from './components/SeniorDetailViewFamilyApproval';
import { AuthContext } from '../../AuthProvider';
import styles from './SeniorDetailView.module.css';
import loading from '../../assets/images/loading.gif';
import { apiSpringBoot } from '../../utils/axios';
import { convertUTCToKST } from '../../fuction/function';

// 병력관리
import Medical from './components/Medical';
import SideBar from '../../components/common/SideBar';

// 응급
import EMGList from '../../components/emg/EMGList';

// 공문서
import DocManaged from '../document/DocManaged';

const SeniorDetailView = () => {
  const { UUID } = useParams();
  const [searchParams] = useSearchParams();
  const { role } = useContext(AuthContext);

  // 서버에서 받아오는 데이터 저장 상태변수 목록
  const [family, setFamily] = useState();
  const [senior, setSenior] = useState();
  const [manager, setManager] = useState();
  const [profileData, setProfileData] = useState();

  // DocManaged 섹션 참조
  const docManagedRef = useRef(null);

  const navigate = useNavigate();

  // 페이지 렌더링 시 정보 받아오기
  useEffect(() => {
    const fetchSeniorDetail = async () => {
      try {
        const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
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

    fetchSeniorDetail();
  }, [UUID]);

  // 특정 섹션으로 스크롤
  useEffect(() => {
    if (senior) {
      const scrollToSection = searchParams.get('scrollTo');
      if (scrollToSection === 'DocManaged' && docManagedRef.current) {
        console.log('Scrolling to DocManaged');
        setTimeout(() => {
          docManagedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200); // 약간의 지연 추가
      }
    }
  }, [senior, searchParams]);

  if (!senior) {
    return (
      <div className={styles.loading}>
        <img src={loading} alt="로딩 중" />
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

          {/* 공문서 확인하는 섹션 */}
          <div ref={docManagedRef}>
            <DocManaged UUID={UUID} />
          </div>

          <EMGList emgSnrUUID={UUID} />
          <button
            className={styles.moveSnrDetailBtn}
            onClick={() => navigate(-1)}
          >
            목록
          </button>
        </div>
      ) : (
        <div className={styles.snrDetailViewRight}>
          <SeniorDetailViewFamily UUID={UUID} />
          <Medical UUID={UUID} />
          <EMGList emgSnrUUID={UUID} />
          <div ref={docManagedRef}>
            <DocManaged UUID={UUID} />
          </div>
          <button
            className={styles.moveSnrDetailBtn}
            onClick={() => navigate(-1)}
          >
            목록
          </button>
        </div>
      )}
    </div>
  );
};

export default SeniorDetailView;
