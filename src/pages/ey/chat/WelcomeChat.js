import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomeChat.module.css';
import Container from './Container.js';
import { AuthContext } from '../../../AuthProvider.js';

function WelcomeChat() {
  const [inputText, setInputText] = useState('');
  const [workspaces, setWorkspaces] = useState([]); // 워크스페이스 ID 배열 상태
  const navigate = useNavigate();
  const { apiSpringBoot, apiFlask, member, accessToken } = useContext(AuthContext);
  // const { apiSpringBoot, apiFlask, member } = useContext(AuthContext);
  
  // const accessToken  = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MiIsImNhdGVnb3J5IjoicmVmcmVzaCIsIm5hbWUiOiJ0ZXN0MiIsInJvbGUiOiJBRE1JTiIsIm1lbWJlciI6eyJtZW1VVUlEIjoiNWU3NGRhNTMtYjFmZi00ODA2LWExNWMtNmM5OGMxNTA4ZTBkIiwibWVtSWQiOiJ0ZXN0MiIsIm1lbVB3IjoiJDJhJDEwJEt3S0hRRUJBMnkvM1JETHVvOFBKOWVFcGN4bTVYT3dleEtUNEhiSEdraGp3S1VRTmhia3NLIiwibWVtTmFtZSI6InRlc3QyIiwibWVtVHlwZSI6IkFETUlOIiwibWVtRW1haWwiOiJ0ZXN0MUB0LmtyIiwibWVtQWRkcmVzcyI6IuyEnOy0iOuMgOuhnCIsIm1lbUNlbGxwaG9uZSI6IjAxMDEyMzQ1Njc4IiwibWVtUGhvbmUiOm51bGwsIm1lbVJubiI6IjEyMzQ1Ni0xMjM0NTY3IiwibWVtR292Q29kZSI6bnVsbCwibWVtU3RhdHVzIjoiQUNUSVZFIiwibWVtRW5yb2xsRGF0ZSI6bnVsbCwibWVtQ2hhbmdlU3RhdHVzIjpudWxsLCJtZW1GYW1pbHlBcHByb3ZhbCI6bnVsbCwibWVtU29jaWFsS2FrYW8iOm51bGwsIm1lbUtha2FvRW1haWwiOm51bGwsIm1lbVNvY2lhbE5hdmVyIjpudWxsLCJtZW1OYXZlckVtYWlsIjpudWxsLCJtZW1Tb2NpYWxHb29nbGUiOm51bGwsIm1lbUdvb2dsZUVtYWlsIjpudWxsLCJtZW1VVUlERmFtIjpudWxsLCJtZW1VVUlETWdyIjpudWxsfSwiZXhwIjoxNzM1MTI0MzI1fQ.qhtOqXHTu9IdxCGqHUz4npBs5StSVYvgzbqQEmlV1Is";

  // 워크스페이스 목록 가져오기
  const fetchWorkspace = async () => {
    if (!member?.memUUID) {
      console.warn("member.memUUID가 비어 있습니다.");
      return;
    }

    try {
      console.log("Fetching workspaces for memUUID: ", member.memUUID);

      // 스프링부트 API 호출하여 워크스페이스 목록 조회
      const response = await apiSpringBoot.get(`/api/workspace/${member.memUUID}`);
      const { data } = response.data;

      if (data && Array.isArray(data)) {
        console.log("워크스페이스 목록:", data);
        setWorkspaces(data); // 워크스페이스 배열 저장

        // 가장 첫 번째 워크스페이스로 이동
        // TODO: 지금은 첫 워크스페이스로 임시방편 이동하지만, 나중에 세션 연결해서 세션 끊기지 않으면 워크스페이스 이동하면 안 됨
        if (data.length > 0) {
          const firstWorkspace = data[0];
          // navigate(`/w/${firstWorkspace.workspaceId}`, {
          //   state: { workspaceId: firstWorkspace.workspaceId },
          // });
        }
      } else {
        console.log("워크스페이스가 없습니다.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("워크스페이스가 존재하지 않습니다.");
      } else {
        console.error('워크스페이스 확인 중 오류:', error);
      }
    }
  };

  // 초기 렌더링 시 워크스페이스 확인
  useEffect(() => {
    if (member?.memUUID) {
      fetchWorkspace();
    }
  }, [member?.memUUID]);

  const handleInputChange = (e) => setInputText(e.target.value);

  // 메시지 전송 핸들러
  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const refreshToken=localStorage.getItem('refreshToken'); // refreshToken 가져오기
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);

      const response = await apiFlask.post(
        '/chat',
        { 
          message: inputText,
          createWorkspace: true // 새 워크스페이스 생성 요청 플래그그
        },
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: `Bearer ${refreshToken}`, // RefreshToken 추가
          },
        },
      );

      const { reply, workspaceId } = response.data;
      console.log('Flask 응답:', reply, workspaceId);

      if (!workspaceId) {
        alert("워크스페이스 생성에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // 새로운 워크스페이스 생성 시 배열 업데이트
      setWorkspaces((prev) => [...prev, { workspaceId }]); // 새로운 워크스페이스 추가가

      // 생성된 워크스페이스로 이동
      navigate(`/w/${workspaceId}`, {
        state: { workspaceId, aiReply: reply },
      });
    } catch (error) {
      console.error("Flask 서버 호출 중 오류:", error);
      alert("메시지 전송 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <div className={styles['welcome-container']}>
        <h1 className={styles['welcome-title']}>
          점심은 드셨나요?<br />오늘 드신 점심메뉴를 이야기해주세요!
        </h1>
        <p className={styles['welcome-description']}>
          말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.
        </p>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="오늘 날씨가 참 좋네."
            className={styles['text-input']}
            aria-label="대화 입력창"
            value={inputText}
            onChange={handleInputChange}
          />
          <button
            className={`${styles['send-button']} ${styles['button']}`}
            aria-label="전송 버튼"
            onClick={handleSend}
          >
            <span className={styles['arrow-icon']}>➤</span>
          </button>
        </div>

        {/* 워크스페이스 목록 조회용용 */}
        <div className={styles['workspace-list']}>
          <h3>워크스페이스 목록</h3>
          <ul>
            {workspaces.map((workspace) => (
              <li key={workspace.workspaceId}>
                {workspace.workspaceName} (ID: {workspace.workspaceId})
              </li>
            ))}
          </ul>
        </div>



      </div>
    </Container>
  );
}

export default WelcomeChat;
