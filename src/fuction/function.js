// src/function/function.js
import React from 'react';

// 날짜시간 데이터 UTC -> KST 변환 함수
export const convertUTCToKST = (utcDate) => {
  if (!utcDate) {
    console.error('Invalid date input:', utcDate);
    return null;
  }

  try {
    let date;

    // ISO 8601 형식인지 확인
    if (utcDate.includes('T') && utcDate.endsWith('Z')) {
      date = new Date(utcDate); // 이미 ISO 형식인 경우
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
