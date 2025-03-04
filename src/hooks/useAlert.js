import Swal from 'sweetalert2';

/**
 * SweetAlert2를 쉽게 사용할 수 있도록 커스텀 훅 생성
 */
const useAlert = () => {
    // ✅ 확인창 (Yes/No)
    const showConfirm = async (title, text, confirmButtonText = '확인', cancelButtonText = '취소') => {
        return await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText,
            cancelButtonText,
        });
    };

    // ✅ 성공 메시지
    const showSuccess = (title, text = '', timer = 2000) => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            timer,
            showConfirmButton: false,
        });
    };

    // ✅ 오류 메시지
    const showError = (title, text = '') => {
        Swal.fire({
            icon: 'error',
            title,
            text,
        });
    };

    return { showConfirm, showSuccess, showError };
};

export default useAlert;
