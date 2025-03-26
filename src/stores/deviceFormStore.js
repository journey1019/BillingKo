// 📁 src/stores/deviceFormStore.js
import { create } from 'zustand';
import { createDevice } from '@/service/deviceService';
import { getTodayDate } from '@/utils/formatHelpers';

const defaultDeviceFormData = {
    serial_number: '',
    acct_num: '',
    profile_id: '',
    ppid: '',
    model_name: '',
    internet_mail_id: '',
    alias: '',
    remarks: '',
    activated: '',
    deactivated: '',
    update_date: '',
    regist_date: '',
    use_yn: 'Y'
};

const useDeviceFormStore = create((set, get) => ({
    formData: defaultDeviceFormData,
    error: null,

    handleChange: (id, value) => {
        set((state) => ({
            formData: { ...state.formData, [id]: value },
        }));
    },

    validateFormData: () => {
        const { formData } = get();
        const requiredFields = ['serial_number', 'acct_num', 'profile_id', 'activated', 'ppid'];

        for (const field of requiredFields) {
            if (!formData[field]) {
                return `The field "${field}" is required.`;
            }
        }
        return null;
    },

    convertEmptyToNull: () => {
        const { formData } = get();
        const updatedData = { ...formData };

        ['deactivated', 'internet_mail_id', 'alias', 'remarks'].forEach((field) => {
            if (!updatedData[field] || updatedData[field].trim() === '') {
                updatedData[field] = null;
            }
        });

        if (!updatedData.regist_date) {
            updatedData.regist_date = getTodayDate();
        }
        if (!updatedData.update_date) {
            updatedData.update_date = getTodayDate();
        }

        return updatedData;
    },

    submitDeviceForm: async () => {
        const { validateFormData, convertEmptyToNull } = get();

        const validationError = validateFormData();
        if (validationError) throw new Error(validationError);

        const confirmedData = convertEmptyToNull();
        return await createDevice(confirmedData);
    },
}));

export default useDeviceFormStore;
