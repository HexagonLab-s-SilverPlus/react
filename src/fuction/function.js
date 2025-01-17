// src/function/function.js
import React from 'react';

// 날짜시간 데이터 UTC -> KST 변환 함수
export const convertUTCToKST = (utcDate) => {
  if (!utcDate || typeof utcDate !== 'string') {
    console.error('Invalid date input:', utcDate);
    return null;
  }

  try {
    let date;

    // ISO 8601 형식인지 확인
    if (
      utcDate.includes('T') &&
      (utcDate.endsWith('Z') || utcDate.includes('+'))
    ) {
      date = new Date(utcDate); // ISO 형식인 경우 처리
    } else {
      // 서버 형식(`yyyy-MM-dd HH:mm:ss.SSS`)을 ISO 형식으로 변환
      const isoDateString = utcDate.replace(' ', 'T') + 'Z';
      date = new Date(isoDateString);
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }

    // UTC → KST 변환
    const kstOffset = 9 * 60; // +9시간 (분 단위)
    const kstDate = new Date(date.getTime() + kstOffset * 60 * 1000);

    // 변환된 시간을 `yyyy-MM-dd HH:mm:ss` 형식으로 반환
    return kstDate.toISOString().replace('T', ' ').split('.')[0];
  } catch (error) {
    console.error('Error in convertUTCToKST:', error, 'Input:', utcDate);
    return null;
  }
};

export const parseResidentNumber = (residentNumber) => {
  if (
    !residentNumber ||
    residentNumber.length !== 14 ||
    residentNumber[6] !== '-'
  ) {
    console.error('Invalid resident number format:', residentNumber);
    return null;
  }

  const birthYearPrefix =
    residentNumber[7] === '1' || residentNumber[7] === '2' ? '19' : '20';
  const year = birthYearPrefix + residentNumber.substring(0, 2);
  const month = residentNumber.substring(2, 4);
  const day = residentNumber.substring(4, 6);

  const gender =
    residentNumber[7] === '1' || residentNumber[7] === '3' ? '남성' : '여성';

  return {
    birthDate: `${year}/${month}/${day}`,
    gender: gender,
  };
};

// 주민등록번호 정보를 이용한 나이 계산함수
export const calculateAge = (ssn) => {
  // if (!ssn || ssn.length !== 13) {
  //   alert('주민등록번호를 정확히 입력해주세요.');
  //   return;
  // }

  const today = new Date();
  const currentYear = today.getFullYear();
  const yearPrefix = parseInt(ssn[7], 10) < 3 ? 1900 : 2000; // 1, 2는 1900년대, 3, 4는 2000년대
  const birthYear = yearPrefix + parseInt(ssn.slice(0, 2), 10);
  const birthMonth = parseInt(ssn.slice(2, 4), 10);
  const birthDay = parseInt(ssn.slice(4, 6), 10);

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  let calculatedAge = currentYear - birthYear;

  // 생일이 지났는지 확인
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    calculatedAge -= 1;
  }

  return calculatedAge;
};

export const parseAccessToken = (token) => {
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
