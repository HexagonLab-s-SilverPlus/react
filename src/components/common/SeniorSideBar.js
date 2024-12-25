// src/components/common/SeniorSideBar.js
//* 노인의 말동무 서비스에서 사용할 워크스페이스 사이드바 컴포넌트입니다.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import styles from './WelcomePage.module.css';
import PropTypes from 'prop-types';

const SeniorSideBar = ({ memUUID }) => {
    const [workspaces, setWorkspaces] = useState([]); // 워크스페이스 목록록
    const [error, setError] = useState(null);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const { apiSpringBoot } = useContext(AuthContext);
    const navigate = useNavigate();

    // 워크스페이스 목록 가져오기기
    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await apiSpringBoot.get(`/api/workspace/${memUUID}`);
                if (response.data.success) {
                    setWorkspaces(response.data.data);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('워크스페이스 조회 실패:', error);
                setError('워크스페이스를 불러오지 못했습니다.');
            }
        };

        if (memUUID) fetchWorkspace();
    }, [memUUID]);


    // 워크스페이스 선택 핸들러
    const handleWorkspaceSelect = (workspaceId) => {
        setSelectedWorkspaceId(workspaceId);
        navigate(`/w/${workspaceId}`, {
          state: { workspaceId }, // workspaceId를 location.state에 전달달
        }); // 해당 워크스페이스로 이동
    }

    // 새 워크스페이스 생성 화면 이동동
    const handleCreateWorkspace = async () => {
        navigate('/welcome-chat'); // WelcomeChat으로 이동
    }

    return (
        <div className={styles.sidebar}>
          <h2 className={styles.header}>워크스페이스</h2>
          <div className={styles.list}>
            {error && <p className={styles.error}>{error}</p>}
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <div
                  key={workspace.workspaceId}
                  className={`${styles.item} ${
                    selectedWorkspaceId === workspace.workspaceId ? styles.selectedItem : ''
                  }`}
                  onClick={() => handleWorkspaceSelect(workspace.workspaceId)}
                >
                  {workspace.workspaceName}
                </div>
              ))
            ) : (
              <p>등록된 워크스페이스가 없습니다.</p>
            )}
          </div>
          <button onClick={handleCreateWorkspace} className={styles.button}>
            새 워크스페이스 생성
          </button>
        </div>
      );
    };
    


// PropTypes 설정
// ESLint가 PropTypes 검사를 설정하지 않아 경고가 뜨길래 아래 코드로 선언해서 해결함
SeniorSideBar.propTypes = {
    memUUID: PropTypes.node.isRequired, // children은 React 노드로 설정하며 필수 값이다.
};

export default SeniorSideBar;