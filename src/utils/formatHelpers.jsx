export const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return "0";  // ❗ 숫자가 아니면 기본값 반환
    return num.toLocaleString(); // 정상적인 숫자면 포맷 적용
};

// 천 단위 ',' 설정
export function formatNumberWithCommas(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '-'; // 값이 없을 경우 안전한 기본값 반환
    }
    return number.toLocaleString('en-US'); // 'ko-KR' 사용 가능
}

/**
 * @method: '10000' -> '10.000'
 * */
const formatNumberWithCommasString = (number) => {
    if (isNaN(number) || number === null) return "0";
    return Number(number).toLocaleString();
};

/**
 * 숫자 또는 문자열을 받아 천 단위 구분자 추가
 * - 값이 없거나 유효하지 않으면 "-"
 * - 숫자로 변환 후 천 단위 ',' 구분 추가
 * - 소수점이 있는 경우 유지
 *
 * @param {string|number|null|undefined} value - 변환할 값
 * @returns {string} 변환된 값 ('-', '1,000', '10,000.50' 등)
 */
export const formatAnyWithCommas = (value) => {
    if (value === null || value === undefined || value === "" || isNaN(Number(value))) {
        return "-"; // 유효하지 않은 값이면 "-"
    }

    return Number(value).toLocaleString("en-US"); // 천 단위 구분자 추가
};

/**
 * 천 단위 ',' 구분자를 제거하고 숫자로 변환
 * - 값이 없거나 유효하지 않으면 0 반환
 * - 문자열 숫자를 변환하여 정수 또는 소수 반환
 *
 * @param {string|null|undefined} value - 변환할 값
 * @returns {number} 변환된 숫자 (1000, 2500.75 등)
 */
export const removeCommas = (value) => {
    if (!value || typeof value !== "string") {
        return 0; // 유효하지 않은 값이면 0 반환
    }

    const numberValue = value.replace(/,/g, ""); // ',' 제거 후 숫자로 변환
    return isNaN(Number(numberValue)) ? 0 : Number(numberValue);
};


/** @desc: 맨 앞 글자만 대문자 변환 */
export const FirstUpperChange = (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}



export const formatValue = (value, defaultText = "-") => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "null" ||
        (typeof value === "string" && value.trim() === "")
    ) {
        return defaultText;
    }
    return value;
};

export const formatDate = (datetime) => {
    if (!datetime) return "";
    return new Date(datetime).toISOString().slice(0, 10);
};

// 날짜 T 제거 포맷팅 함수 YYYY-MM-DD HH:mm:ss (UTC -> KST)
// UCT로 변환해서 (-9)
// export const formatDateTime = (dateTimeString) => {
//     if(!dateTimeString) return '-';
//
//     const date = new Date(dateTimeString);
//     return date.toISOString().replace("T", " ").slice(0, 19);
// };
// DateTime 그대로 ('YYYY-MM-DDTHH:mm:ss' -> 'YYYY-MM-DD HH:mm:ss')
export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';

    return dateTimeString.replace("T", " ").slice(0, 19); // "2018-08-13T00:00:00" -> "2018-08-13 00:00:00"
};

export const formatDisplayValue = (value) => {
    return !value || value === "null" ? "-" : value;
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 변환
export const getTodayDate = () => {
    return new Date().toISOString().slice(0, 10);
}


/**
 * @desc: 'YYYY-MM-DD HH:mm' -> 'YYYY-MM-DD HH:mm:00'
 * */
export const formatDateAddTime = (dateString) => {
    if (!dateString) return null;
    return dateString.length === 16 ? `${dateString}:00` : dateString; // 초가 없으면 ":00" 추가
};

/**
 * @method: '202412' -> '2024-12' || 'YYYYMM' -> 'YYYY-MM'
 * */
export const formatDateIndex = (dateIndex) => {
    if (!dateIndex || dateIndex.length !== 6) return "-"; // 유효성 검사
    return `${dateIndex.substring(0, 4)}-${dateIndex.substring(4, 6)}`;
};

/**
 * @method: '202412' -> '2024년 12월'
 * */
export const formatYearMonth = (dateString) => {
    // 값이 없거나 유효하지 않으면 기본값 반환
    if (!dateString || typeof dateString !== "string" || dateString.length !== 6) {
        return "-";
    }

    // 연도와 월 분리
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);

    // 숫자로 변환하여 월 앞의 0 제거
    const formattedMonth = parseInt(month, 10);

    return `${year}년 ${formattedMonth}월`;
};


// ✅ 전화번호를 '00-0000-0000' 또는 '000-0000-0000' 형식으로 변환
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, ""); // 숫자만 추출
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return phoneNumber; // 원래 값 반환
};

// ✅ 사업자 등록번호를 '000-00-00000' 형식으로 변환
export const formatBusinessNumber = (businessNum) => {
    if (!businessNum) return "";
    const cleaned = businessNum.replace(/\D/g, ""); // 숫자만 추출
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
    }
    return businessNum; // 원래 값 반환
};



/** UTC 변환 없이 원 날짜 그대로 활용 */
export const formatFormDate = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};