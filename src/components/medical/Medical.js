// src/components/medical/Medical.js
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import styles from './Medical.module.css';

const Medical = () => {
    const [medicals, setMedicals] = useState([]);
    const [newMedical, setNewMedical] = useState(null); // 새 항목 상태
    // const { mediSnrUUID } = useParams();
    const mediSnrUUID = '146a5b0c-04a0-4cd7-b680-863457102479';

    const [isEditing, setIsEditing] = useState(false);  //작성 상태관리(작성중이면 true)
    const [isPublic, setIsPublic] = useState(false);    //공개 상태관리

    //토큰정보 가져오기(AuthProvider)
    const { role, member } = useContext(AuthContext);

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

    //병력관리 리스트 불러오기
    useEffect(() => {
        const fetchMedical = async () => {
            try {
                console.log('member : ', member);

                const response = await apiSpringBoot.get(`/program/medical/${mediSnrUUID}`);
                console.log('fetchMedical Response : ', response.data);
                setMedicals(response.data.list);

            } catch (error) {
                console.error('Medical useEffect Error : ', error);
            }
        };

        fetchMedical();
    }, [mediSnrUUID]);

    //input 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedical((prev) => ({
            ...prev,
            [name]: value, // name 속성을 키로, 입력값(value)을 값으로 설정
        }));
    }

    const handlePrivacyChange = (e) => {

    };

    const handleInsertClick = () => {
        setNewMedical({
            mediDiagDate: "",
            mediDiseaseName: "",
            mediLastTreatDate: ""
        });
    };

    const handleCancelClick = () => {
        setNewMedical(null);
    };

    const handleSaveClick = async () => {
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
            const response = await apiSpringBoot.post(`/program/medical/${mediSnrUUID}`, updatedMedical);
            // 저장 성공 시 `medicals` 리스트 업데이트
            setMedicals((prev) => [...prev, response.data]);

            // `newMedical` 초기화
            setNewMedical(null);
            alert("병력이 저장되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("handleSaveClick Error:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleUpdateClick = () => { };

    const handleDeleteClick = () => { };

    return (
        <div className={styles.medicalWrap}>
            <div className={styles.mediTop}>
                <h1>병력관리</h1>
                <div className={styles.mediPrivacy}>
                    <span>가족 공개</span>
                    <label><input type="radio" name="mediPrivacy" value="T" checked={isPublic} onChange={handlePrivacyChange} />공개</label>
                    <label><input type="radio" name="mediPrivacy" value="F" checked={!isPublic} onChange={handlePrivacyChange} />비공개</label>
                </div>{/* mediPrivacy end */}
            </div>{/* medi_top end */}

            <table className={styles.mediTable}>
                <thead>
                    <tr>
                        <th></th>
                        <th>진단일</th>
                        <th>병명</th>
                        <th>최근 진료일</th>
                        <th>수정</th>
                    </tr>
                </thead>

                <tbody>
                    {medicals.map((item, index) => (
                        <tr key={index} className={styles.mediItem}>
                            <td><input type="checkbox" /></td>
                            <td><input type="date" name="mediDiagDate" value={item.mediDiagDate.split('T')[0]} disabled /></td>
                            <td><input type="text" name="mediDiseaseName" value={item.mediDiseaseName} disabled /></td>
                            <td><input type="date" name="mediLastTreatDate" value={item.mediLastTreatDate.split('T')[0]} disabled /></td>
                            <td>
                                <button onClick={handleUpdateClick} disabled={newMedical}>수정</button>
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

            {!newMedical ? (
                <div className={styles.mediBtns}>
                    <button onClick={handleDeleteClick}>삭제</button>
                    <button onClick={handleInsertClick}>추가</button>
                </div>
            ) : (
                <div className={styles.mediBtns}>
                    <button onClick={handleCancelClick}>취소</button>
                    <button onClick={handleSaveClick}>저장</button>
                </div>
            )}
        </div>//medical_wrap end
    );
};

export default Medical;