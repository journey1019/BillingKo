import { get, postWithBody } from "./api"; // Body


/**
 * 전체 Step 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchStep = async ({monthly}) => {
    try {
        return await get(`/process/${monthly}`);
    } catch (error) {
        console.error("Failed to fetch Step:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * 특정 월(monthly)에 Step 상태를 업데이트한다.
 *
 * @param {string} monthly - 예: "202507"
 * @param {object} stepData - 변경할 필드 예: { "cdr": "Y" }, { "device": "N", "payment": "Y" }
 * @returns {Promise<object>} - 응답 결과
 */
export const createStep = async (monthly, stepData) => {
    if (!stepData || typeof stepData !== "object") {
        throw new Error("stepData must be a valid object");
    }

    // 디버깅용 출력
    console.log("📤 POST /process 요청:", {
        monthly,
        stepData
    });

    try {
        return await postWithBody(`/process/${monthly}`, stepData);
    } catch (error) {
        const errorMessage = error?.response?.data || error.message;
        console.error("❌ Step 업데이트 실패:", errorMessage);
        throw error;
    }
};

