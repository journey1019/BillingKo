import Swal from 'sweetalert2';

/**
 * SweetAlert2 기반으로 공통 Alert 모음
 */

// ✅ 삭제 확인 모달
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

// ✅ 성공 알림
export const showSuccessAlert = (message = '성공적으로 처리되었습니다!') => {
    Swal.fire({
        icon: 'success',
        title: message,
        timer: 2000,
        showConfirmButton: false
    });
};

// ✅ 오류 알림
export const showErrorAlert = (message = '오류가 발생했습니다. 다시 시도해주세요.') => {
    Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: message
    });
};
