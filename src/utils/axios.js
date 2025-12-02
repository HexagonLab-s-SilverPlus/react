// src/utils/axios.js
import axios from 'axios';


export const apiSpringBoot = axios.create({
  baseURL: process.env.REACT_APP_SPRING_BOOT_API_URL, // .env 파일에 설정된 URL 사용
});
export const apiFlask = axios.create({
  baseURL: process.env.REACT_APP_FLASK_API_URL, 
});

// Flask API base URL for streaming requests
export const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL;

/**
 * Streaming fetch utility for chat responses
 * @param {string} endpoint - API endpoint (e.g., '/chat-stream')
 * @param {Object} body - Request body
 * @param {Object} options - Options object
 * @param {string} options.accessToken - Access token for authorization
 * @param {string} options.refreshToken - Refresh token for authorization
 * @param {Function} options.onChunk - Callback for each chunk received
 * @param {Function} options.onComplete - Callback when streaming completes
 * @param {Function} options.onError - Callback for errors
 * @returns {Promise<string>} - Complete response text
 */
export const streamingFetch = async (endpoint, body, options) => {
  const { accessToken, refreshToken, onChunk, onComplete, onError } = options;
  
  try {
    const response = await fetch(`${FLASK_API_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        RefreshToken: `Bearer ${refreshToken}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      
      if (onChunk) {
        onChunk(chunk, fullText);
      }
    }

    if (onComplete) {
      onComplete(fullText);
    }

    return fullText;
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
};
