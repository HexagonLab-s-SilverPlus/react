// src/utils.axios.js

import axios from 'axios';


export const apiSpringBoot = axios.create({
  baseURL: process.env.REACT_APP_SPRING_BOOT_API_URL
});
