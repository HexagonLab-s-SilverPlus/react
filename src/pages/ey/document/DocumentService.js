/**
 * DocumentService: `apiFlask`를 사용해 문서 관련 API를 호출하는 유틸리티
 * @param {object} apiFlask - `AuthContext`에서 제공받은 Axios 인스턴스
 */
const DocumentService = (apiFlask, accessToken) => ({
    /**
     * 문서 키를 가져오는 함수
     * @param {string} documentType - 문서 유형
     * @returns {Promise<object>} - 키 목록을 포함한 응답 데이터
     */
    getKeys: async (documentType) => {
        try {
            const response = await apiFlask.post('/select-document', {
                documentType, // 전달할 값 확인. 왜 400 bad request 가 뜨냐면 이 값이 없어서 그럼
            },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        RefreshToken: localStorage.getItem('refreshToken')
                    },
                });
            return response.data;
        } catch (error) {
            console.error('getKeys 오류:', error);
            throw error;
        }
    },

    /**
     * 문서를 제출하는 함수
     * @param {string} documentType - 문서 유형
     * @param {object} values - 문서에 입력될 값
     * @returns {Promise<object>} - 제출 결과
     */
    submitDocument: async (documentType, values) => {
        try {
            const response = await apiFlask.post('/submit-values', {
                documentType,
                values,
            },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        RefreshToken: localStorage.getItem('refreshToken')
                    },
                });
            return response.data;
        } catch (error) {
            console.error('submitDocument 오류:', error);
            throw error;
        }
    },
});

export default DocumentService;
