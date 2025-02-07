import { get, put, del, postWithBodyFile } from './api';
import axios from 'axios';

const API_URL_CDR = 'http://127.0.0.1:8000/file/acctFiles';

/**
 * CDR 파일 업로드
 * @param {File} file 업로드할 파일 객체
 * @returns {Promise<object>} 서버 응답 데이터
 */
// export const uploadCdrFile = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file); // 'file'은 서버에서 인식하는 필드 이름
//
//     // 로컬 스토리지에서 토큰 가져오기
//     const token = localStorage.getItem('token');
//
//     try {
//         const response = await axios.post(API_URL_CDR, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         const errorDetail = error.response?.data?.error || '파일 업로드 중 문제가 발생했습니다.';
//
//         // 에러 메시지 변환 로직
//         const userFriendlyMessage = mapErrorToUserMessage(errorDetail);
//         throw new Error(userFriendlyMessage);
//     }
// };

/**
 * 여러 CDR 파일 업로드
 * @param {FileList} files 업로드할 파일 객체 리스트
 * @returns {Promise<object[]>} 각 파일의 서버 응답 데이터 배열
 */
export const uploadCdrFiles = async (files) => {
    const uploadPromises = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append('file', file);  // 서버에서 인식할 필드 이름
        return postWithBodyFile("/file/acctFiles", formData);
    });

    try {
        return await Promise.all(uploadPromises);  // 모든 업로드가 완료될 때까지 기다림
    } catch (error) {
        const errorDetail = error.response?.data?.error || '파일 업로드 중 문제가 발생했습니다.';
        const userFriendlyMessage = mapErrorToUserMessage(errorDetail);
        throw new Error(userFriendlyMessage);
    }
};


/**
 * 파일 업데이트 이력 가져오기
 * @returns {Promise<Array>} 서버에서 반환된 파일 이력 데이터
 */
export const fetchFileUpdateHistory = async () => {
    try {
        return await get(`/file/fileUpdateHistory`);
    } catch (error) {
        console.error('Failed to fetch file update history:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 파일 업데이트 이력 가져오기
 * @returns {Promise<Array>} 서버에서 반환된 파일 이력 데이터
 */
export const fetchFileUpdateMonthHistory = async (yearMonth) => {
    try {
        return await get(`/file/fileUpdateHistory/date/${yearMonth}`);
    } catch (error) {
        console.error('Failed to fetch file update history:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 업데이트 된 CDR Monthly 가져오기
 * @returns {Promise<Array>} 서버에서 반환된 파일 이력 데이터
 */
export const fetchCDRFileUpdate = async (yearMonth) => {
    try {
        return await get(`/monthly/cdr/${yearMonth}`);
    } catch (error) {
        console.error('Failed to fetch updated cdr file:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 업데이트 된 CDR Monthly 가져오기
 * @returns {Promise<Array>} 서버에서 반환된 파일 이력 데이터
 */
export const fetchNetworkReportFileUpdate = async (yearMonth) => {
    try {
        return await get(`/monthly/network/${yearMonth}`);
    } catch (error) {
        console.error('Failed to fetch updated network report file:', error.response?.data || error.message);
        throw error;
    }
};


/**
 * 서버 에러 메시지를 사용자 친화적인 메시지로 매핑
 * @param {string} errorDetail 서버에서 반환된 원본 에러 메시지
 * @returns {string} 사용자 친화적 메시지
 */
const mapErrorToUserMessage = (errorDetail) => {
    if (errorDetail.includes('list index out of range')) {
        return 'CSV 파일 형식이 잘못되었습니다. 데이터가 누락되었거나 잘못된 구조일 수 있습니다.';
    }
    if (errorDetail.includes('duplicate key value violates unique constraint')) {
        return 'CSV 파일에 중복된 데이터가 포함되어 있습니다. 중복 데이터를 제거한 후 다시 업로드하세요.';
    }
    return '알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.';
};