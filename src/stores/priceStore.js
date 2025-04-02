// src/stores/priceStore.js
import { create } from 'zustand';
import {
    fetchPrice,
    fetchPricePart,
    fetchPriceHistory,
    updatePrice,
    deletePrice,
    createPrice
} from '@/service/priceService';
import { fetchAdjustmentValueHistory } from '@/service/adjustmentService';

const usePriceStore = create((set, get) => ({
    // 전체 요금 데이터
    priceData: [],
    priceLoading: false,
    priceError: null,

    // 선택된 요금 상세 데이터
    pricePartData: null,
    pricePartLoading: false,
    pricePartError: null,

    // 선택된 요금 변경 이력 데이터
    priceHistoryData: null,
    priceHistoryLoading: false,
    priceHistoryError: null,

    // 선택한 요금 조정 이력 데이터
    priceAdjustHistoryData: null,
    priceAdjustHistoryLoading: false,
    priceAdjustHistoryError: null,

    ppidError: "",

    // 요금 초기 상태 세팅
    formData: {
        ppid: "",
        basic_fee: 0,
        subscription_fee: 0,
        free_byte: 0,
        surcharge_unit: 0,
        each_surcharge_fee: 0,
        apply_company: "",
        remarks: "",
        note: ""
    },

    // 가격 전체 데이터 불러오기
    fetchPriceData: async () => {
        set({ priceLoading: true, priceError: null });
        try {
            const data = await fetchPrice();
            set({ priceData: data });
        } catch (error) {
            set({ priceError: error.message || '가격 데이터를 불러오지 못했습니다.' });
        } finally {
            set({ priceLoading: false });
        }
    },

    // 단일 가격 세부 정보 불러오기
    fetchPriceDetails: async (ppid) => {
        set({
            pricePartLoading: true,
            priceHistoryLoading: true,
            priceAdjustHistoryLoading: true,
            pricePartError: null,
            priceHistoryError: null,
            priceAdjustHistoryError: null,
        });

        try {
            const [part, history, adjust] = await Promise.all([
                fetchPricePart(ppid),
                fetchPriceHistory(ppid),
                fetchAdjustmentValueHistory(ppid),
            ]);

            set({
                pricePartData: part,
                priceHistoryData: history,
                priceAdjustHistoryData: adjust,
            });
        } catch (error) {
            set({
                pricePartError: error.message,
                priceHistoryError: error.message,
                priceAdjustHistoryError: error.message,
            });
        } finally {
            set({
                pricePartLoading: false,
                priceHistoryLoading: false,
                priceAdjustHistoryLoading: false,
            });
        }
    },

    // 선택한 요금 데이터 수정
    updatePriceData: async (ppid, payload) => {
        await updatePrice(ppid, payload);
    },

    // 선택한 요금 데이터 삭제
    // deletePriceData: async (ppid) => {
    //     await deletePrice(ppid);
    // },
    deletePriceData: async (ppid) => {
        try {
            await deletePrice(ppid);
        } catch (err) {
            console.error("요금 정보 삭제 실패:", err);
            throw err; // 상위에서 핸들링하도록
        }
    },


    // 새로운 요금 데이터 생성
    handleChange: (id, value) => {
        const { priceData } = get();

        // 중복 검사
        if (id === 'ppid') {
            const isDuplicate = priceData.some((p) => p.ppid === value);
            set({ ppidError: isDuplicate ? '이미 존재하는 PPID 입니다.' : '' });
        }

        // 숫자 필드 처리
        const numericFields = ["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"];
        if (numericFields.includes(id)) {
            value = value === '' ? 0 : Number(value.replace(/[^0-9]/g, ""));
        }

        set((state) => ({
            formData: { ...state.formData, [id]: value }
        }));
    },

    submitPriceForm: async () => {
        const { formData, ppidError } = get();
        if (ppidError) throw new Error("중복된 PPID입니다.");

        const requiredFields = ["ppid", "basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"];
        for (const field of requiredFields) {
            if (!formData[field] && formData[field] !== 0) {
                throw new Error(`필수 입력 항목: ${field}`);
            }
        }

        const normalized = { ...formData };
        ["remarks", "note"].forEach((key) => {
            if (!normalized[key]) normalized[key] = "-";
        });
        if (!normalized.apply_company) normalized.apply_company = "-";

        await createPrice(normalized);
    },
}));

export default usePriceStore;
