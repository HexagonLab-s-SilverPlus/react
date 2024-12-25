import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import styles from './SeniorSideBar.module.css';
import PropTypes from 'prop-types';

const SeniorSideBar = ({ memUUID }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const { apiSpringBoot } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleWorkspaceSelect = (workspaceId) => {
        setSelectedWorkspaceId(workspaceId);
        navigate(`/w/${workspaceId}`, { state: { workspaceId } });
    };

    const handleCreateWorkspace = () => {
        navigate('/welcome-chat');
    };

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
                    <p className={styles.noWorkspace}>등록된 워크스페이스가 없습니다.</p>
                )}
            </div>
            <button onClick={handleCreateWorkspace} className={styles.button}>
                새 워크스페이스 생성
            </button>
        </div>
    );
};

SeniorSideBar.propTypes = {
    memUUID: PropTypes.string.isRequired,
};

export default SeniorSideBar;
