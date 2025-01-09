// src/pages/management/components//Medical.js
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";
import { apiSpringBoot } from "../../../utils/axios";
import styles from './Medical.module.css';
import Paging from '../../../components/common/Paging';
import { PagingCalculate } from '../../../components/common/PagingCalculate ';

const Medical = ({ UUID }) => {
    const [medicals, setMedicals] = useState([]);
    const [newMedical, setNewMedical] = useState(null); // 새 항목 상태
    const [backupMedical, setBackupMedical] = useState(null);  //수정 전 데이터 저장

    // const { mediSnrUUID } = useParams();
    // const mediSnrUUID = '146a5b0c-04a0-4cd7-b680-863457102479';
    const mediSnrUUID = UUID;

    const [isEditing, setIsEditing] = useState([]);  //작성 상태관리(수정 중인 항목의 index를 관리)
    const [isPublic, setIsPublic] = useState('F');    //공개 상태관리
    const [isAllChecked, setIsAllChecked] = useState(false);

    //토큰정보 가져오기(AuthProvider)
    const { role, member } = useContext(AuthContext);

    const [pagingInfo, setPagingInfo] = useState({
        mediSnrUUID: mediSnrUUID,
        pageNumber: 1,
        action: 'all',
        listCount: 1,
        maxPage: 1,
        pageSize: 5,
        startPage: 1,
        endPage: 1,
        keyword: '',
    });

    //--------------------------------------------------
    //데이터 포맷(한국)
    const formatDate = (w) => {
        const date = new Date(w);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;  //월은 0부터 시작하므로 1더해야 함
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    };

    // 날짜 포맷 함수 추가
    const formatKoreanDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 두 자리로 포맷
        const day = String(date.getDate()).padStart(2, '0'); // 두 자리로 포맷
        return `${year}년 ${month}월 ${day}일`;
    };
    const today = new Date();
    const formattedToday = formatKoreanDate(today); // 오늘 날짜 포맷

    const fetchMedical = async (page = 1) => {
        try {
            const response = await apiSpringBoot.get(`/medical/${mediSnrUUID}`, {
                params: {
                    ...pagingInfo,
                    pageNumber: page,
                },
            });
            // console.log('fetchMedical Response : ', response.data);
            // 리스트 데이터를 상태에 설정
            if (response.data.list) {
                setMedicals(response.data.list);
            } else {
                setMedicals([]);
            }

            //response.data.search 가 undefined일 때
            const searchData = response.data.search || {
                pageNumber: 1,
                listCount: 0,
                pageSize: 5,
            };

            const { maxPage, startPage, endPage } = PagingCalculate(searchData.pageNumber,
                searchData.listCount, searchData.pageSize);

            setPagingInfo((prev) => ({
                ...prev,
                pageNumber: searchData.pageNumber,
                listCount: searchData.listCount,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
            }));

            // 서버에서 가져온 데이터를 기준으로 공개 상태 설정
            if (response.data.list.length > 0) {
                setIsPublic(response.data.list[0].mediPrivacy); // "T" 또는 "F" 설정
            }
        } catch (error) {
            console.error('Medical useEffect Error : ', error);
        }
    };

    // useEffect(() => {
    //     fetchMedical();
    // }, [mediSnrUUID]);
    useEffect(() => {
        // 페이지 번호나 UUID가 변경될 때 데이터를 가져오고 상태 초기화
        setIsAllChecked(false); // 전체선택 초기화
        setMedicals((prev) => prev.map((item) => ({ ...item, isChecked: false }))); // 항목 선택 초기화
        fetchMedical(pagingInfo.pageNumber);
    }, [mediSnrUUID, pagingInfo.pageNumber]);

    const handlePageChange = (page) => {
        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: page,
        }));
        // fetchMedical(page);
    };

    //th 체크박스 클릭 시
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setIsAllChecked(isChecked);

        // 모든 항목의 isChecked 상태를 변경
        setMedicals((prev) =>
            prev.map((item) => ({ ...item, isChecked }))
        );
    };

    //td 체크박스 클릭 시
    const handleRowCheckboxChange = (index) => {
        setMedicals((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, isChecked: !item.isChecked } : item
            )
        );

        // 개별 체크박스 변경 후 "모두 선택" 상태 업데이트
        const allChecked = medicals.every((item, i) =>
            i === index ? !item.isChecked : item.isChecked
        );
        setIsAllChecked(allChecked);
    };

    //input 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedical((prev) => ({
            ...prev,
            [name]: value, // name 속성을 키로, 입력값(value)을 값으로 설정
        }));
    };

    //가족 공개 설정
    const handlePrivacyChange = async (e) => {
        const isPublicValue = e.target.value;

        try {
            await apiSpringBoot.put(`/medical/privacy/${mediSnrUUID}`, {
                mediPrivacy: isPublicValue,
            });

            // 상태 업데이트
            setIsPublic(isPublicValue); // 선택한 값에 따라 상태 업데이트

            alert(`가족 공개 설정이 ${isPublicValue === "T" ? "공개" : "비공개"}로 변경되었습니다.`);
        } catch (error) {
            console.error("handlePrivacyChange Error:", error);
            alert('가족 공개 설정 변경 중 오류가 발생했습니다.');
        }
    };

    const handleInsertClick = () => {
        setNewMedical({
            mediDiagDate: "",
            mediDiseaseName: "",
            mediLastTreatDate: ""
        });
    };

    const handleInsertCancelClick = () => {
        setNewMedical(null);
    };

    const handleInsert = async () => {
        if (window.confirm("정말 병력을 추가하시겠습니까?")) {
            try {
                // 유효성 검사
                if (!newMedical.mediDiagDate || !newMedical.mediDiseaseName || !newMedical.mediLastTreatDate) {
                    alert("모든 항목을 입력해주세요.");
                    return;
                }

                // `isPublic` 값을 newMedical에 추가
                const updatedMedical = {
                    ...newMedical,
                    mediPrivacy: isPublic ? "T" : "F", // isPublic 값을 T/F로 변환
                };

                // API 호출하여 데이터 저장
                const response = await apiSpringBoot.post(`/medical/${mediSnrUUID}`, updatedMedical);
                // 저장 성공 시 `medicals` 리스트 업데이트
                setMedicals((prev) => [...prev, response.data]);

                // `newMedical` 초기화
                setNewMedical(null);
                alert("병력이 저장되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error("handleInsert Error:", error);
                alert("저장 중 오류가 발생했습니다.");
            }
        } else {
            // 취소 버튼을 눌렀을 경우 아무 동작도 하지 않음
            return;
        }
    };

    // input의 onChange 핸들러
    const handleRowInputChange = (index, name, value) => {
        setMedicals((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    //수정 클릭시 input 활성화
    const handleUpdateClick = (index) => {
        setBackupMedical(medicals[index]);  //수정 전 데이터 백업
        setIsEditing((prev) => [...prev, index]);   //수정 상태 추가
    };

    //수정 중일때 취소 클릭하면 작성 취소됌
    const handleUpdateCancleClick = (index) => {
        setMedicals((prev) =>
            prev.map((item, i) => (i === index ? backupMedical : item)) // 백업 데이터로 복원
        );
        setBackupMedical(null); // 백업 데이터 초기화
        setIsEditing((prev) => prev.filter((i) => i !== index)); // 수정 상태 제거
    };

    //수정 클릭시 수정처리
    const handleUpdate = async (index) => {
        if (window.confirm("정말 수정하시겠습니까?")) {
            try {
                //수정할 데이터 추출
                const updatedMedical = medicals[index];

                await apiSpringBoot.put(`/medical/${mediSnrUUID}`, updatedMedical);
                alert("수정이 완료되었습니다.");

                // // 목록 다시 불러오기
                // const response = await apiSpringBoot.get(`/medical/${mediSnrUUID}`);
                // setMedicals(response.data.list);
                fetchMedical();

                // 수정 상태 제거
                setIsEditing((prev) => prev.filter((i) => i !== index));
            } catch (error) {
                console.error("handleUpdate Error:", error);
                alert("수정 중 오류가 발생했습니다.");
            }
        } else {
            // 취소 버튼을 눌렀을 경우 아무 동작도 하지 않음
            return;
        }
    };

    const handleDeleteClick = async () => {
        const checkedItems = medicals.filter((item) => item.isChecked);

        if (checkedItems.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        if (window.confirm("선택한 항목을 삭제하시겠습니까?")) {
            try {
                const mediIds = checkedItems.map((item) => item.mediId);

                await apiSpringBoot.delete(`/medical`, {
                    data: mediIds,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                //삭제 후 목록 업데이트
                setMedicals((prev) => prev.filter((item) => !item.isChecked));
                setIsAllChecked(false);
                alert("선택한 항목이 삭제되었습니다.");
                fetchMedical();
            } catch (error) {
                console.error("handleDeleteClick Error:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    //--------------------------------------------------
    if (role == 'MANAGER') {
        return (
            <div className={styles.medicalWrap}>
                <div className={styles.mediTop}>
                    <h1>병력 관리</h1>
                    <div className={styles.mediPrivacy}>
                        <span>가족 공개</span>
                        <label><input type="radio" name="mediPrivacy" value="T" checked={isPublic === "T"} onChange={handlePrivacyChange} />공개</label>
                        <label><input type="radio" name="mediPrivacy" value="F" checked={isPublic === "F"} onChange={handlePrivacyChange} />비공개</label>
                    </div>{/* mediPrivacy end */}
                </div>{/* medi_top end */}

                <table className={styles.mediTable}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={isAllChecked} onChange={handleSelectAll} /></th>
                            <th>진단일</th>
                            <th>병명</th>
                            <th>최근 진료일</th>
                            <th>수정</th>
                        </tr>
                    </thead>

                    <tbody>
                        {medicals.map((item, index) => (
                            <tr key={index} className={styles.mediItem}>
                                <td><input type="checkbox" checked={item.isChecked || false} onChange={() => handleRowCheckboxChange(index)} /></td>
                                <td><input type="date" name="mediDiagDate" value={item.mediDiagDate.split('T')[0]}
                                    disabled={!isEditing.includes(index)}
                                    onChange={(e) =>
                                        handleRowInputChange(index, e.target.name, e.target.value)
                                    } /></td>
                                <td><input type="text" name="mediDiseaseName" value={item.mediDiseaseName}
                                    disabled={!isEditing.includes(index)}
                                    onChange={(e) =>
                                        handleRowInputChange(index, e.target.name, e.target.value)
                                    } /></td>
                                <td><input type="date" name="mediLastTreatDate" value={item.mediLastTreatDate.split('T')[0]}
                                    disabled={!isEditing.includes(index)}
                                    onChange={(e) =>
                                        handleRowInputChange(index, e.target.name, e.target.value)
                                    } /></td>
                                <td>
                                    {!isEditing.includes(index) ? (
                                        <button onClick={() => handleUpdateClick(index)} disabled={isEditing.length > 0 || newMedical !== null}>수정</button>
                                    ) : (
                                        <span>수정중</span>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {newMedical && (
                            <tr className={styles.mediItem}>
                                <td></td>
                                <td><input type="date" name="mediDiagDate" onChange={handleInputChange} /></td>
                                <td><input type="text" name="mediDiseaseName" placeholder="병명 입력" onChange={handleInputChange} /></td>
                                <td><input type="date" name="mediLastTreatDate" onChange={handleInputChange} /></td>
                                <td><span>작성중</span></td>
                            </tr>
                        )}

                    </tbody>
                </table>

                {!newMedical && !isEditing.length ? (
                    <div className={styles.mediBtns}>
                        <button onClick={handleDeleteClick}>삭제</button>
                        <button onClick={handleInsertClick}>추가</button>
                    </div>
                ) : (
                    <div className={styles.mediBtns}>
                        {newMedical && (
                            <>
                                <button onClick={handleInsertCancelClick}>취소</button>
                                <button onClick={handleInsert}>저장</button>
                            </>
                        )}
                        {isEditing.length > 0 && (
                            <>
                                {isEditing.map((editingIndex) => (
                                    <div className={styles.mediBtns} key={editingIndex}>
                                        <button onClick={() => handleUpdateCancleClick(editingIndex)}>취소</button>
                                        <button onClick={() => handleUpdate(editingIndex)}>저장</button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {pagingInfo && pagingInfo.listCount > 0 && (
                    <Paging
                        pageNumber={pagingInfo.pageNumber}
                        listCount={pagingInfo.listCount}
                        maxPage={pagingInfo.maxPage}
                        startPage={pagingInfo.startPage}
                        endPage={pagingInfo.endPage}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                )}
            </div>//medical_wrap end
        );
    } else if (role == 'FAMILY') {    //가족일때
        if (isPublic === 'T') {
            return (
                <div className={styles.medicalWrap}>
                    <div className={styles.mediTop}>
                        <h1>병력 관리</h1>
                        <div className={styles.mediPrivacy} style={{ display: 'none' }}>
                            <span>가족 공개</span>
                            <label><input type="radio" name="mediPrivacy" value="T" checked={isPublic === "T"} onChange={handlePrivacyChange} />공개</label>
                            <label><input type="radio" name="mediPrivacy" value="F" checked={isPublic === "F"} onChange={handlePrivacyChange} />비공개</label>
                        </div>{/* mediPrivacy end */}
                    </div>{/* medi_top end */}

                    <table className={styles.mediTable}>
                        <thead>
                            <tr>
                                <th className={styles.hiddenColumn}><input type="checkbox" checked={isAllChecked} onChange={handleSelectAll} /></th>
                                <th style={{ borderLeft: '1px solid #fff' }}>진단일</th>
                                <th>병명</th>
                                <th style={{ borderRight: '1px solid #fff' }}>최근 진료일</th>
                                <th className={styles.hiddenColumn}>수정</th>
                            </tr>
                        </thead>

                        <tbody>
                            {medicals.map((item, index) => (
                                <tr key={index} className={styles.mediItem}>
                                    <td className={styles.hiddenColumn}><input type="checkbox" checked={item.isChecked || false} onChange={() => handleRowCheckboxChange(index)} /></td>
                                    <td style={{ borderLeft: '1px solid #fff' }}><input type="date" name="mediDiagDate" value={item.mediDiagDate.split('T')[0]}
                                        disabled={!isEditing.includes(index)}
                                        onChange={(e) =>
                                            handleRowInputChange(index, e.target.name, e.target.value)
                                        } /></td>
                                    <td><input type="text" name="mediDiseaseName" value={item.mediDiseaseName}
                                        disabled={!isEditing.includes(index)}
                                        onChange={(e) =>
                                            handleRowInputChange(index, e.target.name, e.target.value)
                                        } /></td>
                                    <td style={{ borderRight: '1px solid #fff' }}><input type="date" name="mediLastTreatDate" value={item.mediLastTreatDate.split('T')[0]}
                                        disabled={!isEditing.includes(index)}
                                        onChange={(e) =>
                                            handleRowInputChange(index, e.target.name, e.target.value)
                                        } /></td>
                                    <td className={styles.hiddenColumn}>
                                        {!isEditing.includes(index) ? (
                                            <button onClick={() => handleUpdateClick(index)} disabled={isEditing.length > 0 || newMedical !== null}>수정</button>
                                        ) : (
                                            <span>수정중</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {newMedical && (
                                <tr className={styles.mediItem}>
                                    <td></td>
                                    <td><input type="date" name="mediDiagDate" onChange={handleInputChange} /></td>
                                    <td><input type="text" name="mediDiseaseName" placeholder="병명 입력" onChange={handleInputChange} /></td>
                                    <td><input type="date" name="mediLastTreatDate" onChange={handleInputChange} /></td>
                                    <td><span>작성중</span></td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                    <Paging
                        pageNumber={pagingInfo.pageNumber}
                        listCount={pagingInfo.listCount}
                        maxPage={pagingInfo.maxPage}
                        startPage={pagingInfo.startPage}
                        endPage={pagingInfo.endPage}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                </div>//medical_wrap end
            );
        } else {
            return null;
        }
    }
};

export default Medical;