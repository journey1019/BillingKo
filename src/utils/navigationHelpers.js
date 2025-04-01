import { useLocation } from "react-router-dom";

/**
 * 현재 경로(path)와 메뉴 아이템의 경로(itemPath)를 비교하여 활성화 상태인지 확인하는 함수
 * @param {string} itemPath - 메뉴 아이템의 경로
 * @returns {string} - 활성화된 경우 'text-blue-500', 아닌 경우 'hover:text-blue-400'
 */
// export const useActivePath = (itemPath) => {
//     const location = useLocation();
//     return location.pathname === itemPath ? "text-blue-500" : "hover:text-blue-400";
// };


export const useActivePath = (itemPath) => {
    const location = useLocation();

    // 현재 경로가 정확히 일치하거나, 해당 경로로 시작하면 활성화 처리
    const isActive =
        location.pathname === itemPath ||
        location.pathname.startsWith(itemPath + "/") || // 하위 경로 처리 (/accounts/...)
        location.pathname === itemPath && location.search; // 쿼리 파라미터 포함 시

    return isActive ? "text-blue-500" : "hover:text-blue-400";
};
