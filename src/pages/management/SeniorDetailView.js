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

// 위급
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
  const [mediPrivacy, setMediPrivacy] = useState();

  // 섹션 참조
  const managerRef = useRef(null);
  const familyRef = useRef(null);
  const familyApprovalRef = useRef(null);
  const medicalRef = useRef(null);
  const docManagedRef = useRef(null);
  const emgListRef = useRef(null);

  const navigate = useNavigate();

  // 페이지 렌더링 시 정보 받아오기
  // useEffect(() => {
  //   const fetchSeniorDetail = async () => {
  //     try {
  //       const response = await apiSpringBoot.get(`/member/sdetail/${UUID}`);
  //       const updateSeniorData = {
  //         ...response.data.member,
  //         memEnrollDate: convertUTCToKST(response.data.member.memEnrollDate),
  //       };
  //       if (response.data.familyInfo) {
  //         setFamily(response.data.familyInfo);
  //       }
  //       if (response.data.managerInfo) {
  //         setManager(response.data.managerInfo);
  //       }
  //       setSenior(updateSeniorData);
  //       setProfileData(response.data.profileData);
  //     } catch (error) {
  //       console.error('회원 데이터 조회 실패 : ', error);
  //     }
  //   };

  //   fetchSeniorDetail();
  // }, [UUID]);

  // // 병력 공개 데이터
  // useEffect(() => {
  //   const mediStatus = async () => {
  //     try {
  //       const response = await apiSpringBoot.get(`/medical/${UUID}/tf`);
  //       setMediPrivacy(response.data);
  //       console.log('mediPrivacy : ', mediPrivacy);
  //     } catch (error) {
  //       console.error('시니어 병력 공개 조회 실패 : ', error);
  //     }
  //   };
  //   mediStatus();
  // }, [UUID]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 병렬 데이터 요청
        const [seniorResponse, mediResponse] = await Promise.all([
          apiSpringBoot.get(`/member/sdetail/${UUID}`),
          apiSpringBoot.get(`/medical/${UUID}/tf`),
        ]);

        // Senior 데이터 처리
        const updateSeniorData = {
          ...seniorResponse.data.member,
          memEnrollDate: convertUTCToKST(seniorResponse.data.member.memEnrollDate),
        };
        if (seniorResponse.data.familyInfo) {
          setFamily(seniorResponse.data.familyInfo);
        }
        if (seniorResponse.data.managerInfo) {
          setManager(seniorResponse.data.managerInfo);
        }
        setSenior(updateSeniorData);
        setProfileData(seniorResponse.data.profileData);

        // 병력 공개 데이터 처리
        setMediPrivacy(mediResponse.data);
        // console.log('mediPrivacy : ', mediResponse.data);

      } catch (error) {
        // console.error('데이터 조회 실패: ', error);
        alert('어르신의 정보를 가져오는데 실패했습니다.')
      }
    };

    fetchData();
  }, [UUID]);

  // 특정 섹션으로 스크롤
  useEffect(() => {
    if (senior) {
      const scrollToSection = searchParams.get('scrollTo');
      if (scrollToSection === 'DocManaged' && docManagedRef.current) {
        // console.log('Scrolling to DocManaged');
        setTimeout(() => {
          docManagedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200); // 약간의 지연 추가
      }
    }
  }, [senior, searchParams]);

  // 특정 섹션으로 스크롤
  const scrollToSection = (ref) => {
    if (ref.current) {
      const topOffset = 120; // 원하는 오프셋 값
      const elementPosition = ref.current.getBoundingClientRect().top; // 요소의 현재 화면 내 위치
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth', // 부드러운 스크롤
      });
    }
  };

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
          <div className={styles.sdetailHeader}>
            <p>어르신 관리</p>
            <ul>
              <li onClick={() => scrollToSection(managerRef)}>인적사항</li>
              <li onClick={() => scrollToSection(familyApprovalRef)}>가족계정 승인</li>
              <li onClick={() => scrollToSection(medicalRef)}>병력 관리</li>
              <li onClick={() => scrollToSection(docManagedRef)}>공문서 확인</li>
              <li onClick={() => scrollToSection(emgListRef)}>위급 상황 기록</li>
            </ul>
          </div>{/* sdetailHeader end */}
          <div ref={managerRef}>
            <SeniorDetailViewManager
              UUID={UUID}
              senior={senior}
              manager={manager}
              profileData={profileData}
            />
          </div>
          <div ref={familyApprovalRef}>
            <SeniorDetailViewFamilyApproval
              UUID={UUID}
              family={family}
              senior={senior}
            />
          </div>
          <div ref={medicalRef}>
            <Medical UUID={UUID} />
          </div>
          <div ref={docManagedRef}>
            <DocManaged UUID={UUID} />
          </div>
          <div ref={emgListRef}>
            <EMGList emgSnrUUID={UUID} />
          </div>
          <button
            className={styles.moveSnrDetailBtn}
            onClick={() => navigate(-1)}
          >
            목록
          </button>
        </div>
      ) : (
        <div className={styles.snrDetailViewRight}>
          <div className={styles.sdetailHeader}>
            <p>어르신 관리</p>
            <ul>
              <li onClick={() => scrollToSection(managerRef)}>인적사항</li>
              {mediPrivacy === 'T' && (
                <li onClick={() => scrollToSection(medicalRef)}>병력 관리</li>
              )}
              <li onClick={() => scrollToSection(emgListRef)}>위급 상황 기록</li>
            </ul>
          </div>{/* sdetailHeader end */}
          <div ref={managerRef}>
            <SeniorDetailViewFamily UUID={UUID} />
          </div>
          <div ref={medicalRef}>
            <Medical UUID={UUID} />
          </div>
          <div ref={emgListRef}>
            <EMGList emgSnrUUID={UUID} />
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
