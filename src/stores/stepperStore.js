import { create } from 'zustand';
import { fetchStep, createStep } from '@/service/stepService';
import { getCurrentYearMonth, getNextYearMonth } from '@/utils/dateUtils.js';

export const useStepperStore = create((set, get) => ({
    stepMap: {},
    nextStepMap: {},

    setStep: (key, value) => {
        set((state) => ({
            stepMap: { ...state.stepMap, [key]: value }
        }));
    },

    loadSteps: async () => {
        const monthly = getCurrentYearMonth();
        const data = await fetchStep({ monthly });

        // 상태값을 그대로 저장 (Boolean 변환하지 않음)
        const converted = {
            cdr: data.cdr,
            cdr_confirm: data.cdr_confirm,
            cdr_confirm_id: data.cdr_confirm_id,
            device: data.device,
            device_confirm: data.device_confirm,
            device_confirm_id: data.device_confirm_id,
            billing: data.billing,
            billing_confirm: data.billing_confirm,
            billing_confirm_id: data.billing_confirm_id,
            payment: data.payment,
            payment_confirm: data.payment_confirm,
            payment_confirm_id: data.payment_confirm_id,
        };
        set({ stepMap: converted });
    },

    setNextStep: (key, value) => {
        set((state) => ({
            nextStepMap: { ...state.nextStepMap, [key]: value }
        }));
    },

    loadNextMonthSteps: async (monthly) => {
        const data = await fetchStep({ monthly }); // ✅ key 이름 올바르게 사용됨

        const converted = {
            cdr: data.cdr,
            cdr_confirm: data.cdr_confirm,
            cdr_confirm_id: data.cdr_confirm_id,
            device: data.device,
            device_confirm: data.device_confirm,
            device_confirm_id: data.device_confirm_id,
            billing: data.billing,
            billing_confirm: data.billing_confirm,
            billing_confirm_id: data.billing_confirm_id,
            payment: data.payment,
            payment_confirm: data.payment_confirm,
            payment_confirm_id: data.payment_confirm_id,
        };
        set({ nextStepMap: converted });
    },


    updateStep: async (monthly, key, statusCode) => {
        const payload = { [key]: statusCode };
        await createStep(monthly, payload);

        if (monthly === getCurrentYearMonth()) {
            await get().loadSteps();
        } else if (monthly === getNextYearMonth()) {
            await get().loadNextMonthSteps(monthly); // ✅ 명시적으로 전달
        }
    },
}));
