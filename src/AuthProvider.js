// src/AuthProvider.js

// 전역 상태 관리자 : 로그인 여부 상태와 accessToken, refreshToken 상태 관리가 목적임

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSpringBoot } from './utils/axios';

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴
const parseAccessToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [tokenInfo, setTokenInfo] = useState({
    accessToken: '',
    refreshToken: '',
  });
  // authInfo 는 accessToken, refreshToken 을 상태관리함
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    role: '',
    memName: '',
    memId: '',
    member: null,
  });

  // 로그인 함수 : 로그인 시 토큰을 저장하고 로그인 상태를 업데이트 처리함
  const login = ({ accessToken, refreshToken }) => {
    // 로컬스토리지에 엑세스토큰과 리프레시토큰 저장

    const parsedToken = parseAccessToken(accessToken); // 페이로드만 리턴받음
    setAuthInfo({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      role: parsedToken.role, // JWTUtil 클래스에서 토큰 생성 메소드를 확인해서 이름 맞춤
      memName: parsedToken.name, // JWTUtil 클래스에서 토큰 생성 메소드를 확인해서 이름 맞춤
      memId: parsedToken.sub, // 토큰에서 subject 정보 추출
      member: parsedToken.member,
    });
    setTokenInfo({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    console.log('login tokenInfo', tokenInfo);
    console.log('login : ', authInfo);
  };

  // 토큰 저장 함수
  const tokenUpdate = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

  };

  // 로그아웃 함수 : 로그인 상태를 초기화하고, 로컬 스토리지에 저장된 토큰 삭제 처리
  const logout = async (refreshToken) => {
    try {
      const response = await apiSpringBoot.get('/logout', {
        headers: {
          Authorization: `Bearer ${refreshToken.refreshToken}`,
        },
      });

      console.log('response :', response);

      localStorage.clear();
      setAuthInfo({
        isLoggedIn: false,
        accessToken: '',
        refreshToken: '',
        role: '',
        memName: '',
        memId: '',
        member: null,
      });
      navigate('/loginmember');
    } catch (error) {}
  };

  // 로컬스토리지와 로그인상태 해제용 함수
  const tokenLoginClear = () => {
    localStorage.clear();
    setAuthInfo({
      isLoggedIn: false,
      accessToken: '',
      refreshToken: '',
      role: '',
      memName: '',
      memId: '',
      member: null,
    });
  };

  // token 재발급 요청
  const refreshAccessToken = async () => {
    let accessToken = localStorage.getItem('accessToken')?.trim();
    let refreshToken = localStorage.getItem('refreshToken')?.trim();

    if (!accessToken || !refreshToken) {
      console.error('reisssu 요청 실패 : 토큰 없음');
      alert('세션 만료. 다시 로그인해주세요.');
      tokenLoginClear;
      navigate('/loginmember');
      return;
    }

    try {
      console.log('reissue 요청 - accessToken : ', accessToken);
      console.log('reissue 요청 - refreshToken : ', refreshToken);

      const response = await apiSpringBoot.post('/token/reissue', null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          RefreshToken: `Bearer ${refreshToken}`,
        },
      });

      console.log('reissue 성공. 응답헤더 : ', response.headers);
      console.log('reissue 성공. 응답바디 : ', response.body);
      console.log('authorization : ', response.headers['authorization']);
      console.log('refresh-token : ', response.headers['refresh-token']);

      const newAccessToken = response.headers['authorization']
        ?.split(' ')[1]
        ?.trim();
      const newRefreshToken = localStorage.getItem('refreshToken');
      localStorage.setItem('accessToken', newAccessToken);
      // localStorage.setItem('refreshToken', newRefreshToken);
      console.log('tokenUpdate : reissue 성공 후 토큰 저장완료');
      setTokenInfo({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      return newAccessToken;
    } catch (error) {
      console.error('Reissue 실패 - 상태 코드:', error.response?.status);
      console.error('Reissue 실패 - 응답 데이터:', error.response?.data);

      const expiredTokenType = error.response?.headers['token-expired'];
      if (
        expiredTokenType === 'RefreshToken' ||
        error.response?.data === 'session expired'
      ) {
        alert('세션 만료. 다시 로그인해주세요.');
        tokenLoginClear;
        navigate('/loginmember');
      } else if (expiredTokenType === 'AccessToken') {
        console.warn('accessToken 만료됨. 재발급 진행');
        return await refreshAccessToken();
      } else {
        console.error('오류 발생 : ', error.message);
        tokenLoginClear;
        navigate('/loginmember');
      }
    }
  };

  // // api 요청함수
  // const apiRequest = async (url, options = {}, retry = true) => {
  //   console.log('apiRequest 실행');
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   if (!accessToken || !refreshToken) {
  //     throw new Error('token 이 없습니다.');
  //   }

  //   try {
  //     const response = await apiSpringBoot.get(url, {
  //       ...options,
  //       headers: {
  //         Authorization: `Bearer ${refreshToken}`,
  //         AccessToken: `Bearer ${accessToken}`,
  //         ...options.headers,
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     console.error('API 요청 실패 - 상태코드 : ', error.response?.status);
  //     console.error('API 응답 헤더 : ', error.response?.headers);
  //     console.error('API 응답 데이터 : ', error.response?.data);
  //   }

  //   const tokenExpiredHeader = error.response?.headers['token-expired'];

  //   if (error.response?.status === 401 && retry) {
  //     // refreshToken 만료 시 로그인 연장여부 확인
  //     if (tokenExpiredHeader === 'RefreshToken') {
  //       const confirmExtedn = window.confirm(
  //         '로그인이 만료되었습니다. 연장하시겠습니까?'
  //       );
  //       if (confirmExtedn) {
  //         try {
  //           await refreshAccessToken(true);
  //           return apiRequest(url, options, false);
  //         } catch (error) {
  //           console.error('로그인 연장 실패 : ', error.response?.data);
  //           alert('다시 로그인해주세요.');
  //           logout();
  //         }
  //       } else {
  //         alert('다시 로그인해주세요.');
  //         logout();
  //       }
  //     }

  //     // accessToken 만료 시 refreshToken 으로 accessToken 재발급
  //     if (tokenExpiredHeader === 'AccessToken') {
  //       console.warn('accessToken 만료. 재발급 진행');
  //       try {
  //         await refreshAccessToken();
  //         return apiRequest(url, options, false);
  //       } catch (error) {
  //         console.error('accessToken 재발급 실패 : ', error.response?.data);
  //       }
  //       logout();
  //     }
  //   }
  // };

  // 요청, 응답 인터셉터 함수
  const setupInterceptors = (axiosInstance) => {
    // 요청 인터셉터
    axiosInstance.interceptors.request.use(
      (config) => {
        if (
          config.url.includes('logout') ||
          config.url.includes('login') ||
          config.url.includes('/reissue')
        ) {
          return config;
        } else if (localStorage.getItem('accessToken', accessToken)) {
          console.log('요청 인터셉터 하는지 확인');
          console.log('실제요청 : ', config);
          console.log(
            'tokenInfo.accessToken',
            localStorage.getItem('accessToken', accessToken)
          );
          config.headers['Authorization'] = `Bearer ${tokenInfo.accessToken}`;
          config.headers['RefreshToken'] = `Bearer ${tokenInfo.refreshToken}`;
          console.log(
            'config.headers Authorization :',
            config.headers['Authorization']
          );
          console.log(
            'config.headers RefreshToken :',
            config.headers['RefreshToken']
          );
        }
        return config; // 수정된 config 반환
      },
      (error) => {
        return Promise.reject(error); // 오류가 발생하면 Promise 체인에 전달
      }
    );

    // 응답 인터셉터
    axiosInstance.interceptors.response.use(
      (response) => {
        return response; // 응답에 문제가 없으면 바로 반환
      },
      async (error) => {
        console.log('응답 인터셉터 하는지 확인');
        const originalRequest = error.config; // 원래 요청 정보 저장
        const tokenExpiredHeader = error.response?.headers['token-expired'];

        console.log('response : ', error.response);
        console.log('originalRequest :', originalRequest);
        console.log('tokenExpiredHeader :', tokenExpiredHeader);

        if (!originalRequest) {
          console.error('originalRequest가 정의되지 않음');
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          console.warn('이미 재시도된 요청입니다. 무한 반복 방지');
          return Promise.reject(error);
        }

        // 토큰 재발급
        if (
          error.response.status === 401 &&
          tokenExpiredHeader === 'RefreshToken'
        ) {
          originalRequest._retry = true;
          // accessToken 유효, refreshToken 만료
          // refreshToken 만료시 로그인 연장여부 확인

          const confirmExtend = window.confirm(
            '로그인이 만료되었습니다. 연장하시겠습니까?'
          );
          if (confirmExtend) {
            try {
              const newAccessToken = await refreshAccessToken();
              originalRequest.headers['Authorization'] =
                `Bearer ${newAccessToken}`;
              localStorage.setItem('accessToken', newAccessToken);
              return axiosInstance(originalRequest);
            } catch (error) {
              console.error('로그인 연장 실패 : ', error.response?.data);
              alert('다시 로그인해주세요.');
              logout();
              navigate('/loginmember');
            }
          } else {
            alert('다시 로그인해주세요.(로그인연장 거부)');
            tokenLoginClear;
            navigate('/loginmember');
            return Promise.reject(error);
          }
        }

        // accessToken 만료, refreshToken 유효
        if (
          error.response.status === 401 &&
          tokenExpiredHeader === 'AccessToken'
        ) {
          try {
            originalRequest._retry = true;
            console.log('AccessToken 만료. 재발급 진행 중...');
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            // // 새 요청 생성
            // const updatedRequest = {
            //   ...originalRequest,
            //   headers: {
            //     ...originalRequest.headers,
            //     Authorization: `Bearer ${newAccessToken}`,
            //   },
            // };

            // // 새로운 요청 실행
            // return axiosInstance(updatedRequest);

            return axiosInstance(originalRequest);
          } catch (error) {
            console.error('accessToken 재발급 실패 : ', error.response?.data);
            tokenLoginClear;
            navigate('/loginmember');
          }
        }

        if (
          error.response.status === 401 &&
          tokenExpiredHeader === 'AllToken'
        ) {
          console.warn('모든 토큰 만료.');
          tokenLoginClear;
          navigate('/loginmember');
        }

        if (error.response && error.response.status !== 401) {
          logout();
        }

        return Promise.reject(error);
      }
    );
  };

  // //* 공통 인터셉터 로직을 함수로 추출
  // const setupInterceptors = (axiosInstance) => {
  //   //* 요청 인터셉터: 모든 Axios 요청 전에 실행되어 Access Token을 헤더에 추가
  //   axiosInstance.interceptors.request.use(
  //     (config) => {
  //       if (
  //         config.url.includes('logout') ||
  //         config.url.includes('login') ||
  //         config.url.includes('/reissue')
  //       ) {
  //         return config;
  //       }

  //       if (authInfo.accessToken) {
  //         //! Authorization 헤더에 Bearer 토큰을 추가
  //         config.headers['Authorization'] = `Bearer ${authInfo.accessToken}`;
  //         console.log(
  //           'Access Token being set in headers:',
  //           authInfo.accessToken
  //         );
  //       }
  //       return config; // 수정된 config 반환
  //     },
  //     (error) => {
  //       return Promise.reject(error); // 오류가 발생하면 이를 Promise 체인에 전달
  //     }
  //   );

  //   //* 응답 인터셉터 설정 - 서버 응답 후 실행
  //   axiosInstance.interceptors.response.use(
  //     (response) => {
  //       return response; // 응답이 정상적이면 그대로 반환
  //     },
  //     async (error) => {
  //       const originalRequest = error.config; // 원래의 요청 정보 저장

  //       // //^  /refresh-token 요청 및 /login 요청은 인터셉터에서 제외
  //       // if (originalRequest.url.includes('/login')) {
  //       //   return Promise.reject(error); // 무한 재시도 방지
  //       // }

  //       // * 401 에러 및 재시도 시도가 아닌 경우, Refresh Token으로 Access Token 재발급 시도
  //       if (
  //         error.response &&
  //         error.response.status === 401 &&
  //         !originalRequest._retry &&
  //         authInfo.refreshToken
  //       ) {
  //         originalRequest._retry = true; // 재시도 플래그 설정하여 무한 재시도 하지 않도록 방지
  //         console.log(
  //           '이 리프레시토큰으로 access token 재발급 받으려 시도 중:',
  //           authInfo.refreshToken
  //         );
  //         try {
  //           const newAccessToken = await refreshAccessToken(); // 토큰 재발급 함수 호출

  //           if (newAccessToken) {
  //             //! 원래의 요청 헤더에 새로운 Access Token 추가
  //             originalRequest.headers['Authorization'] =
  //               `Bearer ${newAccessToken}`;
  //             //! 수정된 요청을 재시도
  //             return axiosInstance(originalRequest);
  //           }
  //         } catch (refreshError) {
  //           console.error('Token refresh failed:', refreshError);
  //         }
  //       }

  //       //* 401 외의 에러 처리
  //       if (error.response && error.response.status === 401) {
  //       }

  //       return Promise.reject(error); // 조건에 해당하지 않으면 오류를 그대로 Promise 체인에 전달
  //     }
  //   );
  // };

  setupInterceptors(apiSpringBoot);

  // 컴포넌트 마운트시 (연동시) 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      const parsedToken = parseAccessToken(accessToken);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          memName: parsedToken.name,
          memId: parsedToken.sub,
          accessToken: accessToken,
          refreshToken: refreshToken,
          member: parsedToken.member,
        });
      }
    }
    console.log('login : ', authInfo);
  }, []);

  useEffect(() => {
    console.log('Updated authInfo: ', authInfo);
    setTokenInfo({
      accessToken: authInfo.accessToken,
      refreshToken: authInfo.refreshToken,
    });
    tokenUpdate(authInfo.accessToken, authInfo.refreshToken);
  }, [authInfo]); // authInfo가 변경될 때 실행

  return (
    <AuthContext.Provider
      value={{ ...authInfo, login, logout, apiSpringBoot, authInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
