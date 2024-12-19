// src/utils/axios.js
import axios from 'axios';


export const apiSpringBoot = axios.create({
  baseURL: process.env.REACT_APP_SPRING_BOOT_API_URL, // .env 파일에 설정된 URL 사용
});

