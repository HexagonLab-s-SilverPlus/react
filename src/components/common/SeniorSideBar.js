import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import ReactDOM from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component"; // InfiniteScroll import
import styles from "./SeniorSideBar.module.css";
import PropTypes from "prop-types";

// 공통 모달 컴포넌트
const WorkspaceModal = ({ isOpen, closeModal, workspaces, fetchMore, hasMore, title, navigate }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.trashModal}>
                <h3>{title}</h3>
                <button className={styles.closeButton} onClick={closeModal}>
                    닫기
                </button>
                <div className={styles.trashList}>
                    <InfiniteScroll
                        dataLength={workspaces.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={<div className={styles.spinner}>로딩 중...</div>}
                        height={300}
                    >
                        {workspaces.length > 0 ? (
                            workspaces.map((workspace) => (
                                <div
                                    key={workspace.workspaceId}
                                    className={styles.deletedItem}
                                    onClick={() => {
                                        closeModal();
                                        navigate(`/w/${workspace.workspaceId}`);
                                    }}
                                >
                                    {workspace.workspaceName}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noWorkspace}>
                                {title === "즐겨찾기" ? "즐겨찾기가 비었습니다." : "휴지통이 비었습니다."}
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </div>,
        document.body
    );
};

// 삭제 확인 모달 컴포넌트
const DeleteConfirmationModal = ({ isOpen, closeModal, workspaceToDelete, handleDelete }) => {
    if (!isOpen) return null;

    const workspaceName = workspaceToDelete?.workspaceName || "이 워크스페이스";

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>삭제 확인</h3>
                <p>
                    <strong>{workspaceName}</strong>을(를) 정말로 삭제하시겠습니까?
                </p>
                <div className={styles.modalActions}>
                    <button onClick={closeModal} className={styles.cancelButton}>
                        취소
                    </button>
                    <button onClick={handleDelete} className={styles.deleteButton}>
                        삭제
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const SeniorSideBar = ({ memUUID }) => {
    const [activeWorkspaces, setActiveWorkspaces] = useState([]);
    const [archivedWorkspaces, setArchivedWorkspaces] = useState([]);
    const [deletedWorkspaces, setDeletedWorkspaces] = useState([]);

    const [hasMoreActive, setHasMoreActive] = useState(true);
    const [hasMoreArchived, setHasMoreArchived] = useState(true);
    const [hasMoreDeleted, setHasMoreDeleted] = useState(true);

    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
    const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const { apiSpringBoot, memName } = useContext(AuthContext);
    const navigate = useNavigate();

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseActive = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=ACTIVE&page=1&size=5`
                );
                if (responseActive.data.data) {
                    setActiveWorkspaces(responseActive.data.data);
                    setHasMoreActive(responseActive.data.data.length === 5);
                } else {
                    setActiveWorkspaces([]);
                    setHasMoreActive(false);
                }

                const responseArchived = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=ARCHIVED&page=1&size=5`
                );
                if (responseArchived.data.data) {
                    setArchivedWorkspaces(responseArchived.data.data);
                    setHasMoreArchived(responseArchived.data.data.length === 5);
                } else {
                    setArchivedWorkspaces([]);
                    setHasMoreArchived(false);
                }




                const responseDeleted = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=DELETED&page=1&size=5`
                );

                if (responseDeleted.data.data) {
                    setDeletedWorkspaces(responseDeleted.data.data);
                    setHasMoreDeleted(responseDeleted.data.data.length === 5);
                } else {
                    console.log("휴지통이 비었습니다.");
                    setDeletedWorkspaces([]);
                    setHasMoreDeleted(false);
                }
            } catch (error) {
                console.error("워크스페이스 초기 데이터 로드 실패:", error);
            }
        };

        fetchInitialData();
    }, [memUUID]);


    // 휴지통 버튼 클릭 핸들러
    const fetchDeletedWorkspaces = async () => {
        try {
            
            const page = Math.ceil(deletedWorkspaces.length / 5) + 1; // 다음 페이지 계산
            const response = await apiSpringBoot.get(
                `/api/workspace/${memUUID}/status?workspaceStatus=DELETED&page=${page}&size=5`
            );

            setDeletedWorkspaces(response.data.data || []); // 새로고침 후 데이터 반영
            setHasMoreDeleted(response.data.data.length === 5); // 더 가져올 데이터가 있는지 확인
        } catch (error) {
            console.error("삭제된 워크스페이스 로드 실패:", error);
        }
    };


    // 워크스페이스 삭제 핸들러
    const handleDeleteWorkspace = async () => {
        if (!workspaceToDelete) return;

        try {
            await apiSpringBoot.delete(`/api/workspace/${workspaceToDelete.workspaceId}`);
            
            // 기존의 워크스페이스와 삭제된 워크스페이스가 다른 경우에만 필터링해서
            // 활성화된 워크스페이스 상태에 업데이트한다.
            setActiveWorkspaces((prev) =>
                prev.filter((workspace) => workspace.workspaceId !== workspaceToDelete.workspaceId)
            );

            // 삭제된 워크스페이스 상태에 추가
            // 삭제된 워크스페이스 객체를 기존 배열의 맨 앞에 추가한 새로운 배열을 생성하여 업데이트한다.
            // 이렇게 하면 최근에 삭제된 워크스페이스가 목록의 맨 위에 표시된다.
            setDeletedWorkspaces((prev) => [workspaceToDelete, ...prev]);

            // 삭제할 워크스페이스 초기화
            setWorkspaceToDelete(null);
            // 삭제 확인 모달 닫기
            setIsDeleteConfirmationOpen(false);
        } catch (error) {
            console.error("워크스페이스 삭제 실패:", error);
            alert("워크스페이스 삭제에 실패했습니다.");
        }
    };

    const toggleDropdown = (workspaceId) => {
        setOpenDropdownId(openDropdownId === workspaceId ? null : workspaceId);
    };


    const fetchMoreWorkspaces = async (type) => {
        try {
            let page;
            if (type === "active") {
                page = Math.ceil(activeWorkspaces.length / 5) + 1;
                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=ACTIVE&page=${page}&size=5`
                );
                if (response.data.data) {
                    setActiveWorkspaces((prev) => [...prev, ...response.data.data]); // 기존 데이터에 추가
                    setHasMoreActive(response.data.data.length === 5);
                } else {
                    console.log("활성 워크스페이스가 비었습니다.");
                    setActiveWorkspaces([]);
                    setHasMoreActive(false);
                }
            } else if (type === "archived") {
                page = Math.ceil(archivedWorkspaces.length / 5) + 1;
                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=ARCHIVED&page=${page}&size=5`
                );
                if (response.data.data) {
                    setArchivedWorkspaces((prev) => [...prev, ...response.data.data]); // 기존 데이터에 추가
                    setHasMoreArchived(response.data.data.length === 5);
                } else {
                    console.log("즐겨찾기가 비었습니다.");
                    setArchivedWorkspaces([]);
                    setHasMoreArchived(false);
                }
            } else if (type === "deleted") {
                page = Math.ceil(deletedWorkspaces.length / 5) + 1;
                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status?workspaceStatus=DELETED&page=${page}&size=5`
                );
                if (response.data.data) {
                    setDeletedWorkspaces((prev) => [...prev, ...response.data.data]); // 기존 데이터에 추가
                    setHasMoreDeleted(response.data.data.length === 5);
                } else {
                    console.log("휴지통이 비었습니다.");
                    setDeletedWorkspaces([]);
                    setHasMoreDeleted(false);
                }
            }
        } catch (error) {
            console.error(`${type} 워크스페이스 추가 로드 실패:`, error);
        }
    };



    return (
        <div className={styles.sidebar}>
            <h2 className={styles.header}>{memName}님의 말동무</h2>

            <button
                className={styles.createWorkspaceButton}
                onClick={() => navigate("/welcome-chat")}
            >
                새 워크스페이스 생성
            </button>

            {archivedWorkspaces.length > 0 && (
                <>
                    <h2 className={styles.header}>즐겨찾기</h2>
                    <div className={styles.list}>
                        {archivedWorkspaces.map((workspace) => (
                            <div key={workspace.workspaceId} className={styles.item}>
                                <span onClick={() => navigate(`/w/${workspace.workspaceId}`)}>
                                    {workspace.workspaceName}
                                </span>
                            </div>
                        ))}
                        {hasMoreArchived && (
                            <button
                                className={styles.button}
                                onClick={() => setIsArchivedModalOpen(true)}
                            >
                                더보기
                            </button>
                        )}
                    </div>
                </>
            )}

            <div className={styles.list}>
                {activeWorkspaces.map((workspace) => (
                    <div
                        key={workspace.workspaceId}
                        className={`${styles.item} ${selectedWorkspaceId === workspace.workspaceId ? styles.selectedItem : ""
                            }`}
                        onClick={() => {
                            setSelectedWorkspaceId(workspace.workspaceId);
                            navigate(`/w/${workspace.workspaceId}`)
                        }
                        }
                    >
                        {workspace.workspaceName}
                        <button
                            className={styles.menuButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(workspace.workspaceId);
                            }}
                        >
                            ⋮
                        </button>
                        {openDropdownId === workspace.workspaceId && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={() => console.log("즐겨찾기 추가")}>즐겨찾기</button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setWorkspaceToDelete(workspace);
                                        setIsDeleteConfirmationOpen(true);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {hasMoreActive && (
                    <button className={styles.button} onClick={() => setIsActiveModalOpen(true)}>
                        더보기
                    </button>
                )}
            </div>

            <button
                className={styles.trashButton}
                onClick={() => {
                    fetchDeletedWorkspaces(); // 삭제된 데이터 새로고침
                    setIsTrashModalOpen(true); // 모달 열기
                }}
            >
                휴지통
            </button>

            <WorkspaceModal
                isOpen={isActiveModalOpen}
                closeModal={() => setIsActiveModalOpen(false)}
                workspaces={activeWorkspaces}
                fetchMore={() => fetchMoreWorkspaces("active")}
                hasMore={hasMoreActive}
                title="활성 워크스페이스"
                navigate={navigate}
            />
            <WorkspaceModal
                isOpen={isArchivedModalOpen}
                closeModal={() => setIsArchivedModalOpen(false)}
                workspaces={archivedWorkspaces}
                fetchMore={() => fetchMoreWorkspaces("archived")}
                hasMore={hasMoreArchived}
                title="즐겨찾기"
                navigate={navigate}
            />
            <WorkspaceModal
                isOpen={isTrashModalOpen}
                closeModal={() => setIsTrashModalOpen(false)}
                workspaces={deletedWorkspaces}
                fetchMore={() => fetchMoreWorkspaces("deleted")}
                hasMore={hasMoreDeleted}
                title="휴지통"
                navigate={navigate}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteConfirmationOpen}
                closeModal={() => setIsDeleteConfirmationOpen(false)}
                workspaceToDelete={workspaceToDelete}
                handleDelete={handleDeleteWorkspace}
            />
        </div>
    );
};

// PropTypes 검증 추가
WorkspaceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    workspaces: PropTypes.array.isRequired,
    fetchMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
};

DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    workspaceToDelete: PropTypes.object,
    handleDelete: PropTypes.func.isRequired,
};

SeniorSideBar.propTypes = {
    memUUID: PropTypes.string.isRequired,
};

export default SeniorSideBar;
