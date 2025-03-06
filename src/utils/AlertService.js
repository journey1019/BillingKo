import Swal from 'sweetalert2';

/**
 * SweetAlert2 기반으로 공통 Alert 모음
 */

// 📂 삭제 확인 모달
export const confirmDelete = async () => {
    return await Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제하면 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소'
    });
};

// 📁 저장 확인 알람 (사용자가 확인해야 하는 알람)
export const showConfirmAlert = async (title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "예, 저장합니다",
        cancelButtonText: "취소",
    });
    return result.isConfirmed; // 사용자가 확인 버튼을 눌렀는지 여부 반환
};

// ✅ 성공 알람 (저장 완료 등)
export const showSuccessAlert = (title, text) => {
    return Swal.fire({
        icon: "success",
        title,
        text,
    });
};

// ❌ 실패 알람 (에러 발생 시)
export const showErrorAlert = (title, text) => {
    return Swal.fire({
        icon: "error",
        title,
        text,
    });
};

// ⚠️ 경고 알람 (필수 데이터 누락 등)
export const showWarningAlert = (title, text) => {
    return Swal.fire({
        icon: "warning",
        title,
        text,
    });
};
