import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import ReactDOM from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component"; // InfiniteScroll import
import styles from "./SeniorSideBar.module.css";
import PropTypes from "prop-types";

// 휴지통 모달 컴포넌트
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
                            휴지통이 비었습니다.
                        </div>
                    )}
                    {hasMore && (
                        <button
                            className={styles.loadMoreButton}
                            onClick={fetchMore}
                        >
                            더보기
                        </button>
                    )}
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
    const [activeWorkspaces, setActiveWorkspaces] = useState([]); // 활성 워크스페이스 
    const [archivedWorkspaces, setArchivedWorkspaces] = useState([]);
    const [deletedWorkspaces, setDeletedWorkspaces] = useState([]);

    const [hasMoreActive, setHasMoreActive] = useState(true); // 활성 워크스페이스 더보기 버튼 표시 여부
    const [hasMoreArchived, setHasMoreArchived] = useState(true);
    const [hasMoreDeleted, setHasMoreDeleted] = useState(true);

    // 페이지와 offset을 동기화
    const [activePage, setActivePage] = useState(0); // 현재 offset (0-based index)
    const [archivedPage, setArchivedPage] = useState(0); // 현재 offset (0-based index)
    const [deletedPage, setDeletedPage] = useState(0); // 현재 offset (0-based index)

    const [pageSize] = useState(5); // 한 페이지의 크기

    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null); // 드롭다운 영역을 참조하기 위한 ref




    const { apiSpringBoot, memName } = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        console.log("Updated hasMoreDeleted:", hasMoreDeleted);
    }, [hasMoreDeleted]);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null); // 외부 클릭 시 드롭다운 닫기
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseActive = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status`,
                    { params: { workspaceStatus: "ACTIVE", page: 1, size: 5 } }
                );
                console.log(responseActive.data.data);

                if (responseActive.data.data) {
                    const workspace = responseActive.data.data || [];
                    setActiveWorkspaces(workspace);
                    // 더복 버튼은 전체 데이터가 6개 이상일 때 표시
                    setHasMoreActive(responseActive.data.data.length === 5);
                } else {
                    setErrorMessage("활성 상태의 워크스페이스가 없습니다.");
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
                    setErrorMessage("즐겨찾기한 워크스페이스가 없습니다.");
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
                    setErrorMessage("휴지통이 비었습니다.");
                    console.log("휴지통이 비었습니다.");
                    setDeletedWorkspaces([]);
                    setHasMoreDeleted(false);
                }
            } catch (error) {
                setErrorMessage("워크스페이스를 불러오는 중 오류가 발생했습니다.");
                console.error("워크스페이스 초기 데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [memUUID]);


    // 휴지통 버튼 클릭 시 삭제된 워크스페이스 로드
    const fetchDeletedWorkspaces = async (reset = false) => {
        if (loading) return; // 중복 호출 방지
        setLoading(true);

        try {
            const offset = reset ? 0 : deletedWorkspaces.length; // 초기화 시 0부터 시작
            const response = await apiSpringBoot.get(
                `/api/workspace/${memUUID}/status`,
                { params: { workspaceStatus: "DELETED", offset, size: pageSize } }
            );

            const newWorkspaces = response.data.data || [];
            if (reset) {
                setDeletedWorkspaces(newWorkspaces); // 초기화 시 데이터 대체
                setDeletedPage(1); // 첫 페이지로 초기화
            } else {
                setDeletedWorkspaces((prev) => [...prev, ...newWorkspaces]); // 기존 데이터에 추가
                setDeletedPage((prev) => prev + 1);
            }

            setHasMoreDeleted(newWorkspaces.length === pageSize); // 더 로드할 데이터가 있는지 확인
        } catch (error) {
            console.error("삭제된 워크스페이스 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };


    // 휴지통 버튼 클릭 핸들러
    const handleTrashButtonClick = () => {
        fetchDeletedWorkspaces(true); // 초기화 후 첫 페이지 데이터 로드
        setIsTrashModalOpen(true); // 모달 열기
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
        setOpenDropdownId((prev) => (prev === workspaceId ? null : workspaceId));
    };


    const fetchMoreWorkspaces = async (type) => {
        console.log(`Fetching more workspaces of type: ${type}`); // 호출 로그 추가
        try {
            if (type === "active") {
                const offset = activeWorkspaces.length; // 현재 데이터 길이를 기반으로 오프셋 계산
                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status`,
                    { params: { workspaceStatus: type.toUpperCase(), offset, size: pageSize } } // 쿼리 파라미터 전달
                );

                console.log("API 응답 데이터:", response.data);
                const newWorkspaces = response.data.data || [];
                console.log("새로운 워크스페이스:", newWorkspaces);


                setActiveWorkspaces((prev) => {
                    // prev에 없는 새로운 워크스페이스만 필터링
                    const uniqueWorkspaces = newWorkspaces.filter(
                        // 새로운 워크스페이스 중 기존 목록에 없는 워크스페이스만 필터링
                        (newWorkspace) => !prev.some((prevWorkspace) => prevWorkspace.workspaceId === newWorkspace.workspaceId)
                    );
                    // 기존 워크스페이스와 고유한 새로운 워크스페이스를 병합
                    return [...prev, ...uniqueWorkspaces];

                }); // 기존 데이터에 추가
                setActivePage((prev) => prev + 1);


                const hasMore = newWorkspaces.length === pageSize;
                console.log("hasMoreActive 업데이트:", hasMore);
                setHasMoreActive(hasMore);

            } else if (type === "archived") {
                const offset = archivedWorkspaces.length; // 현재 데이터 길이를 기반으로 오프셋 계산
                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status`,
                    { params: { workspaceStatus: type.toUpperCase(), offset, size: pageSize } } // 쿼리 파라미터 전달
                );

                console.log("API 응답 데이터:", response.data);
                const newWorkspaces = response.data.data || [];
                console.log("새로운 워크스페이스:", newWorkspaces);

                setArchivedWorkspaces((prev) => {
                    // prev에 없는 새로운 워크스페이스만 필터링
                    const uniqueWorkspaces = newWorkspaces.filter(
                        // 새로운 워크스페이스 중 기존 목록에 없는 워크스페이스만 필터링
                        (newWorkspace) => !prev.some((prevWorkspace) => prevWorkspace.workspaceId === newWorkspace.workspaceId)
                    );
                    // 기존 워크스페이스와 고유한 새로운 워크스페이스를 병합
                    return [...prev, ...uniqueWorkspaces];

                }); // 기존 데이터에 추가
                setArchivedPage((prev) => prev + 1);


                const hasMore = newWorkspaces.length === pageSize;
                console.log("hasMoreArchived 업데이트:", hasMore);
                setHasMoreArchived(hasMore);




            } else if (type === "deleted") {
                const offset = deletedWorkspaces.length; // 현재 데이터 길이를 기반으로 오프셋 계산
                console.log("Deleted page:", deletedPage);
                const nextPage = deletedPage + 1; // 다음 페이지 계산
                console.log(`Fetching page: ${nextPage}`); // 확인용 로그

                const response = await apiSpringBoot.get(
                    `/api/workspace/${memUUID}/status`,
                    { params: { workspaceStatus: type.toUpperCase(), offset, size: pageSize } }
                );

                const newWorkspaces = response.data.data || [];
                console.log("Fetched workspaces:", newWorkspaces);

                if (newWorkspaces.length < pageSize) {
                    console.warn("Expected 5 items but received:", newWorkspaces.length);
                }


                setDeletedWorkspaces((prev) => [...prev, ...newWorkspaces]); // 기존 데이터에 새 데이터 추가
                setDeletedPage(nextPage); // 페이지 번호 업데이트

                // 더 이상 데이터가 없으면 hasMoreDeleted를 false로 설정
                const hasMore = newWorkspaces.length === pageSize;
                console.log("Updated hasMoreDeleted:", hasMore);
                setHasMoreDeleted(hasMore);
            }
        } catch (error) {
            console.error(`${type} 워크스페이스 추가 로드 실패:`, error);
        }
    };


    const fetchMoreWorkspaces_ = (type) => {
        if (type === "deleted") fetchDeletedWorkspaces(false);
    };

    // 즐겨찾기 누르면 해당 워크스페이스 ARCHIVED로 변경
    const setWorkspaceAsFavorite = async (workspaceId) => {
        try {
            const response = await apiSpringBoot.patch(`/api/workspace/${workspaceId}/archived`);
            console.log("즐겨찾기 설정 성공:", response.data.message);

            // UI 업데이트: 활성 워크스페이스에서 제거하고 즐겨찾기 워크스페이스로 이동
            setActiveWorkspaces((prev) =>
                prev.filter((workspace) => workspace.workspaceId !== workspaceId)); // 활성 워크스페이스에서 제거

            const favoritedWorkspace = activeWorkspaces.find(
                (workspace) => workspace.workspaceId === workspaceId
            );

            setArchivedWorkspaces((prev) => [favoritedWorkspace, ...prev]); // 기존의 즐겨찾기 워크스페이스에서 가장 위에 추가

            alert("워크스페이스가 즐겨찾기에 추가되었습니다.");
        } catch (error) {
            console.error("즐겨찾기 설정 실패:", error);
            alert("워크스페이스를 즐겨찾기에 추가하는 데 실패했습니다.");
        }
    };



    // 다시 즐겨찾기 해제하는 핸들러
    const setWorkspaceAsActive = async (workspaceId) => {
        try {
            const response = await apiSpringBoot.patch(`/api/workspace/${workspaceId}/active`);
            console.log("즐겨찾기 해제 성공:", response.data.message);

            // 즐겨찾기 워크스페이스에서 제거하고 활성 워크스페이스로 이동
            const unFavoriteWorkspace = archivedWorkspaces.find(
                (workspace) => workspace.workspaceId === workspaceId
            )

            // 해당 워크스페이스 ID를 필터링해서 즐겨찾기 워크스페이스에서 삭제
            setArchivedWorkspaces((prev) =>
                prev.filter((workspace) => workspace.workspaceId !== workspaceId)
            );
            // 활성 워크스페이스에 추가
            setActiveWorkspaces((prev) => [unFavoriteWorkspace, ...prev]); // 활성 목록에 추가 

            alert("워크스페이스가 활성화되었습니다.");
        } catch (error) {
            console.error("즐겨찾기 해제 실패:", error);
            alert("워크스페이스를 활성화하는 데 실패했습니다.");
        }
    };




    return (
        <div className={styles.sidebar}>
            <h2 className={styles.firstHeader}>{memName}님의 말동무</h2>

            <button
                className={styles.createWorkspaceButton}
                onClick={() => navigate("/welcome-chat")}>
                새 워크스페이스 생성
            </button>


            <div className={styles.workspaceContainer}>
                {archivedWorkspaces.length > 0 && (
                    <>
                        <h2 className={styles.header}>즐겨찾기⭐</h2>
                        <div className={styles.list}>
                            <div className={styles.archivedList}>
                                {archivedWorkspaces.map((workspace) => (
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
                                                e.stopPropagation(); // 클릭 이벤트 전파 방지
                                                toggleDropdown(workspace.workspaceId); // 드랍다운 토글
                                            }}
                                        >
                                            ⋮
                                        </button>
                                        {openDropdownId === workspace.workspaceId && (
                                            <div className={styles.dropdownMenu} ref={dropdownRef}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                                                        setWorkspaceAsActive(workspace.workspaceId); // 활성화 메소드 호출
                                                        setOpenDropdownId(null); // 버튼 클릭 시 드롭다운 닫기
                                                    }}
                                                >
                                                    즐겨찾기 해제
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setWorkspaceToDelete(workspace); // 삭제할 워크스페이스 설정
                                                        setIsDeleteConfirmationOpen(true); // 삭제 확인 모달 열기
                                                        setOpenDropdownId(null); // 버튼 클릭 시 드롭다운 닫기
                                                    }}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {hasMoreArchived && (
                                    <button
                                        className={styles.button}
                                        onClick={() => fetchMoreWorkspaces("archived")}
                                    >
                                        더보기
                                    </button>
                                )}
                            </div>
                        </div>

                    </>
                )}

                <h2 className={styles.header}>워크스페이스</h2>
                <div className={styles.list}>
                    <div className={styles.activeList}>
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
                                    <div className={styles.dropdownMenu} ref={dropdownRef}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // 클릭 이벤트 전파 방지
                                                setWorkspaceAsFavorite(workspace.workspaceId); // 즐겨찾기 메소드 호출
                                                setOpenDropdownId(null); // 버튼 클릭 시 드롭다운 닫기
                                            }}>
                                            즐겨찾기
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setWorkspaceToDelete(workspace);
                                                setIsDeleteConfirmationOpen(true);
                                                setOpenDropdownId(null); // 버튼 클릭 시 드롭다운 닫기
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {hasMoreActive && (
                            <button className={styles.button} onClick={() => fetchMoreWorkspaces("active")}>
                                더보기
                            </button>
                        )}
                    </div>
                </div>
            </div>






            <button
                className={styles.trashButton}
                onClick={handleTrashButtonClick} // 수정된 핸들러
            >
                휴지통
            </button>

            {/* <WorkspaceModal
                isOpen={isActiveModalOpen}
                closeModal={() => setIsActiveModalOpen(false)}
                workspaces={activeWorkspaces}
                fetchMore={() => fetchMoreWorkspaces("active")} // 올바른 함수 전달
                hasMore={
                    hasMoreActive
                }
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
            /> */}
            <WorkspaceModal
                isOpen={isTrashModalOpen}
                closeModal={() => setIsTrashModalOpen(false)}
                workspaces={deletedWorkspaces}
                fetchMore={() => fetchDeletedWorkspaces(false)} // 더보기 버튼 클릭 시 호출
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
