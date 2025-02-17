/**
 * DocumentService: `apiFlask`를 사용해 문서 관련 API를 호출하는 유틸리티
 * @param {object} apiFlask - `AuthContext`에서 제공받은 Axios 인스턴스
 */
const DocumentService = (apiFlask, accessToken, refreshToken) => ({
    // /**
    //  * 문서 키를 가져오는 함수
    //  * @param {string} documentType - 문서 유형
    //  * @returns {Promise<object>} - 키 목록을 포함한 응답 데이터
    //  */
    // getKeys: async (documentType) => {
    //     try {
    //         const response = await apiFlask.post('/select-document', {
    //             documentType, // 전달할 값 확인. 왜 400 bad request 가 뜨냐면 이 값이 없어서 그럼
    //         },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                     RefreshToken: localStorage.getItem('refreshToken')
    //                 },
    //             });
    //         return response.data;
    //     } catch (error) {
    //         console.error('getKeys 오류:', error);
    //         throw error;
    //     }
    // },


    /**
     * GPT 질문 생성 함수
     * @param {string} documentType - 문서 유형
     * @returns {Promise<string[]>} - GPT가 생성한 질문 목록
    */
    generateQuestion: async (documentType) => {
        console.log("refreshTOken: ", refreshToken)
        try {
            console.debug("헤더의 RefreshToken: ", `Bearer ${refreshToken}`)

            const response = await apiFlask.post(
                '/generate-question',
                { documentType },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        RefreshToken: `Bearer ${refreshToken}`,
                    },
                    withCredentials: true,
                },

            );

            if (!response.data || !Array.isArray(response.data.questions)) {
                throw new Error('유효하지 않은 응답 형식');
            }

            return response.data.questions;
        } catch (error) {
            console.error('generateQuestion 오류:', error);
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
            const response = await apiFlask.post('/submit-response', {
                documentType,
                values,
            },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        RefreshToken: `Bearer ${refreshToken}`,
                    },
                    withCredentials: true,
                });
            return response.data;
        } catch (error) {
            console.error('submitDocument 오류:', error);
            throw error;
        }
    },
});

export default DocumentService;
