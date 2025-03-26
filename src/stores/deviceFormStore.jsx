// src/stores/deviceFormStore.js
import { create } from 'zustand';
import { createDevice } from '@/service/deviceService';
import { getTodayDate } from '@/utils/formatHelpers'; // 오늘 날짜 반환 함수 필요 시

const defaultDeviceFormData = {
    serial_number: '',
    acct_num: '',
    profile_id: '',
    activated: '',
    deactivated: '',
    ppid: '',
    model_name: '',
    internet_mail_id: '',
    alias: '',
    remarks: '',
    use_yn: 'Y',
    regist_date: '',
    update_date: '',
};

const useDeviceFormStore = create((set, get) => ({
    formData: { ...defaultDeviceFormData },
    error: null,

    // ✅ 별칭으로 setDeviceField 추가
    setDeviceField: (id, value) => {
        set((state) => ({
            formData: {
                ...state.formData,
                [id]: value
            }
        }));
    },


    // ✅ 입력 변경
    updateField: (id, value) => {
        set((state) => ({
            formData: {
                ...state.formData,
                [id]: value
            }
        }));
    },

    // ✅ formData 리셋
    resetForm: () => {
        set({ formData: { ...defaultDeviceFormData }, error: null });
    },

    // ✅ validation
    validate: () => {
        const { formData } = get();
        const requiredFields = ["serial_number", "acct_num", "profile_id", "activated", "ppid"];

        for (const field of requiredFields) {
            if (!formData[field]) {
                return `필수 입력 항목: ${field}`;
            }
        }
        return null;
    },

    // ✅ 빈 값 null 처리 및 날짜 기본값
    normalize: () => {
        const { formData } = get();
        const updated = { ...formData };

        ["deactivated", "internet_mail_id", "alias", "remarks"].forEach((key) => {
            if (!updated[key] || updated[key].trim() === '') {
                updated[key] = null;
            }
        });

        if (!updated.regist_date) updated.regist_date = getTodayDate();
        if (!updated.update_date) updated.update_date = getTodayDate();

        return updated;
    },

    // ✅ 등록 요청
    submit: async () => {
        const { validate, normalize, resetForm } = get();

        const validationError = validate();
        if (validationError) throw new Error(validationError);

        const confirmedData = normalize();
        await createDevice(confirmedData);
        resetForm();
    },
}));

export default useDeviceFormStore;