import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import ReactDOM from "react-dom";
import styles from "./SeniorSideBar.module.css";
import PropTypes from "prop-types";

const SeniorSideBar = ({ memUUID, selectedWorkspaceId, setSelectedWorkspaceId }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const { apiSpringBoot } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null); // 드랍다운 관리

    // 드랍다운 상태 업데이트의 비동기 이슈를 우회할 수 있다.
    const currentDropdownId = useRef(null);

    const dropdownRef = useRef(null);

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
                console.error("워크스페이스 조회 실패:", error);
                setError("워크스페이스를 불러오지 못했습니다.");
            }
        };

        if (memUUID) fetchWorkspace();
    }, [memUUID]);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null); // 드랍다운 외부 클릭 시 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const handleWorkspaceSelect = (workspaceId) => {
        setSelectedWorkspaceId(workspaceId);
        navigate(`/w/${workspaceId}`, { state: { workspaceId } });
    };

    const handleCreateWorkspace = () => {
        navigate("/welcome-chat");
    };

    const openDeletedModal = (workspace) => {
        setWorkspaceToDelete(workspace);
        setIsDeletedModalOpen(true);
        setOpenDropdownId(null); // 드랍다운 닫기
    };

    const closeDeleteModal = () => {
        setWorkspaceToDelete(null);
        setIsDeletedModalOpen(false);
    };

    const handleDeleteWorkspace = async () => {
        if (!workspaceToDelete) return;

        try {
            await apiSpringBoot.delete(`/api/workspace/${workspaceToDelete.workspaceId}`);
            setWorkspaces((prevWorkspace) =>
                prevWorkspace.filter((workspace) => workspace.workspaceId !== workspaceToDelete.workspaceId)
            );
            closeDeleteModal();
        } catch (error) {
            console.error("워크스페이스 삭제 실패:", error);
            alert("워크스페이스 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };


    // 미트볼 아이콘 클릭 핸들러
    const toggleDropdown = (workspaceId) => {
        // 현재 열려있는 드랍다운 ID와 클릭한 ID가 동일한 경우 드랍다운을 닫기
        if (openDropdownId === workspaceId) {
            currentDropdownId.current = null;
        } else {
            // 다른 워크스페이스의 드랍다운을 열기
            setOpenDropdownId(workspaceId);
            currentDropdownId.current = workspaceId;
        }
    };

    // 모달 렌더링 문제 수정
    // 모달을 최상위 DOM에 렌더링하도록 React Portal을 사용한다. 이렇게하면 모달이 사이드바에 한정되지 않고 화면 전체를 차지하도록 표시가 가능하다.
    const renderModal = () => {
        // isDeletedModalOpen이 false라면 renderModal은 아무것도 렌더링하지 않고고 null 반환(모달 자체 출력을 안 함)
        if (!isDeletedModalOpen) return null;

        // workspaceToDelete가 설정되어 있을 경우 이름을 출력
        const workspaceName = workspaceToDelete?.workspaceName || "이 워크스페이스";


        // 모달 내용을 실제 DOM 트리에 추가하며, document.body에 렌더링한다.
        // 모달이 현재 컴포넌트의 스타일 영향 없이 전체 화면에 렌더링된다.
        return ReactDOM.createPortal(
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h3>채팅을 삭제하시겠습니까?</h3>
                    <p><strong>{workspaceName}</strong>이(가) 삭제됩니다.</p>
                    <div className={styles.modalActions}>
                        <button onClick={closeDeleteModal} className={styles.cancelButton}>
                            취소
                        </button>
                        <button onClick={handleDeleteWorkspace} className={styles.deleteButton}>
                            삭제
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
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
                            className={`${styles.item} ${selectedWorkspaceId === workspace.workspaceId ? styles.selectedItem : ""
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
                                onClick={() => toggleDropdown(workspace.workspaceId)}
                            >
                                ⋮
                            </div>
                            {openDropdownId === workspace.workspaceId && (
                                <div className={styles.dropdownMenu} ref={dropdownRef}>
                                    <button onClick={() => openDeletedModal(workspace)}>삭제하기</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.noWorkspace}>등록된 워크스페이스가 없습니다.</p>
                )}
            </div>
            <button onClick={handleCreateWorkspace} className={styles.button}>
                새 워크스페이스 생성
            </button>
            {/* JSX에서 renderModal()을 호출하여 반환값을 렌더링한다.*/}
            {/* isDeletedModalOpen이 true일 때: renderModal()은 모달 컴포넌트를 반환하므로 화면에 모달이 표시된다. */}
            {/* isDeletedModalOpen이 false일 때: renderModal()은 null을을 반환하므로 아무것도 렌더링되지 않는다. */}
            {/* 결론적으로 renderModal()은 항상 호출되지만, 내부에서 isDeletedModalOpen을 조건으로 모달을 렌더링할지 여부를 결정한다. */}
            {/* 모달은 isDeletedModalOpen이 true일 때만 렌더링된다. */}
            {renderModal()}
        </div>
    );
};

SeniorSideBar.propTypes = {
    memUUID: PropTypes.string.isRequired,
    selectedWorkspaceId: PropTypes.string,
    setSelectedWorkspaceId: PropTypes.func.isRequired,
};

export default SeniorSideBar;
