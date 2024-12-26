import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import styles from './SeniorSideBar.module.css';
import PropTypes from 'prop-types';

const SeniorSideBar = ({ memUUID, selectedWorkspaceId, setSelectedWorkspaceId }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const { apiSpringBoot } = useContext(AuthContext);
    const navigate = useNavigate();

    // 삭제 모달 오픈 상태 관리 
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
    // 워크스페이스 삭제 상태 관리 
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);


    // 워크스페이스 데이터 가져오기
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
        navigate(`/w/${workspaceId}`, { state: { workspaceId } });
    };

    // 새 워크스페이스 생성 핸들러
    const handleCreateWorkspace = () => {
        navigate('/welcome-chat');
    };

    // 삭제 확인 모달 열기
    const openDeletedModal = (workspace) => {
        setWorkspaceToDelete(workspace);
        setIsDeletedModalOpen(true);
    }

    // 삭제 확인 모달 닫기
    const closeDeleteModal = () => {
        setWorkspaceToDelete(null);
        setIsDeletedModalOpen(false);
    }

    // 워크스페이스 삭제 핸들러
    const handleDeleteWorkspace = async() => {
        // 삭제할 워크스페이스가 null이면 취소소
        if(!workspaceToDelete) return;

        try{
            // 스프링부트의 `/api/workspace/{workspaceId}` DELETE 엔드포인트 호출하여 상태를 업데이트
            await apiSpringBoot.delete(`/api/workspace/${workspaceToDelete.workspaceId}`);
            // 삭제된 워크스페이스 ID와 이전에 존재했던 워크스페이스 ID가 다른 워크스페이스만 필터링해서 화면에 즉시 반영영
            setWorkspaces((prevWorkspace) => 
                prevWorkspace.filter((workspace) => workspace.workspaceId !== workspaceToDelete.workspaceId)
            );
            // 삭제 성공하면 모달 닫기
            closeDeleteModal();
        }catch(error){
            console.error('워크스페이스 삭제 실패:', error);
            alert('워크스페이스 삭제에 실패했습니다. 다시 시도해주세요.');
        }
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
                            className={`${styles.item} ${selectedWorkspaceId === workspace.workspaceId ? styles.selectedItem : ''
                                }`}
                        >
                            <div
                                className={styles.workspaceName}
                                onClick={() => handleWorkspaceSelect(workspace.workspaceId)}
                            >
                                {workspace.workspaceName}
                            </div>
                            <div
                                className={styles.menuIcon}
                                onClick={() => openDeletedModal(workspace)}
                            >
                                ⋮
                            </div>

                        </div>
                    ))
                ) : (
                    <p className={styles.noWorkspace}>등록된 워크스페이스가 없습니다.</p>
                )}
            </div>
            <button onClick={handleCreateWorkspace} className={styles.button}>
                새 워크스페이스 생성
            </button>



            {/* 삭제 확인 모달 */}
            {isDeletedModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>채팅을 삭제하시겠습니까?</h3>
                        <p>삭제된 워크스페이스는 휴지통에서 복구할 수 있습니다.</p>
                        <div className={styles.modalActions}>
                            <button onClick={closeDeleteModal} className={styles.cancelButton}>
                                취소
                            </button>
                            <button onClick={handleDeleteWorkspace} className={styles.deleteButton}>
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

SeniorSideBar.propTypes = {
    memUUID: PropTypes.string.isRequired,
    selectedWorkspaceId: PropTypes.string,
    setSelectedWorkspaceId: PropTypes.func.isRequired,
};

export default SeniorSideBar;
