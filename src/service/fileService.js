import { get, put, del, postWithBody, postWithBodyFile } from './api';


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



/**
 * Device 파일과 변경 이력을 업로드하는 함수
 * @param {File} file 업로드할 파일 객체
 * @param {object[]} splitInfo 변경 이력 JSON 데이터 배열
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const uploadFileDevice = async (file, splitInfo) => {
    if (!file) throw new Error("⚠ 파일이 필요합니다.");

    const formData = new FormData();
    formData.append("file", file);

    // ✅ Postman과 동일하게 `split_info`를 문자열(JSON Text)로 추가
    formData.append("split_info", JSON.stringify(splitInfo));

    console.log("📤 FormData 확인:", Object.fromEntries(formData.entries())); // ✅ FormData 로그 확인

    return await postWithBodyFile("http://127.0.0.1:8000/file/byteUse/igws", formData);
};
