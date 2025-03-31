// src/stores/deviceStore.js
import { create } from 'zustand';
import {
    fetchDevices,
    fetchDeviceHistory,
    fetchDevicePart,
    fetchDeviceHistoryLog,
    updateDevice,
    deleteDevice,
} from '@/service/deviceService';
import { fetchAdjustmentPart, fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';

const useDeviceStore = create((set) => ({
    // 전체 단말 데이터
    deviceData: [],
    deviceLoading: false,
    deviceError: null,

    // 선택된 단말 상세
    devicePartData: null,
    devicePartLoading: false,
    devicePartError: null,

    // 변경 이력
    historyData: null,
    historyLoading: false,
    historyError: null,

    // 조정 이력
    adjustHistoryData: null,
    adjustHistoryLoading: false,
    adjustHistoryError: null,

    // 단말 로그 이력
    deviceHistoryLogData: null,
    deviceHistoryLogLoading: false,
    deviceHistoryLogError: null,

    // 전체 단말 조회
    fetchDeviceData: async () => {
        set({ deviceLoading: true, deviceError: null });
        try {
            const data = await fetchDevices();
            set({ deviceData: data });
        } catch (error) {
            set({ deviceError: error.message });
        } finally {
            set({ deviceLoading: false });
        }
    },

    // 단일 단말 상세 데이터 조회
    fetchDeviceDetails: async (serial_number) => {
        set({
            devicePartLoading: true,
            historyLoading: true,
            adjustHistoryLoading: true,
            deviceHistoryLogLoading: true,
        });

        try {
            const [part, history, adjust, log] = await Promise.all([
                fetchDevicePart(serial_number),
                fetchDeviceHistory(serial_number),
                fetchAdjustmentValueHistory(serial_number),
                fetchDeviceHistoryLog(serial_number),
            ]);
            set({
                devicePartData: part,
                historyData: history,
                adjustHistoryData: adjust,
                deviceHistoryLogData: log,
            });
        } catch (error) {
            set({
                devicePartError: error.message,
                historyError: error.message,
                adjustHistoryError: error.message,
                deviceHistoryLogError: error.message,
            });
        } finally {
            set({
                devicePartLoading: false,
                historyLoading: false,
                adjustHistoryLoading: false,
                deviceHistoryLogLoading: false,
            });
        }
    },

    // 삭제
    deleteDeviceData: async (serial_number) => {
        try {
            await deleteDevice(serial_number);
        } catch (error) {
            console.error(`단말기를 삭제하는데 실패했습니다.:`, error.message);
            throw error;
        }
    },

    // 수정
    updateDeviceData: async (serial_number, payload) => {
        try {
            await updateDevice(serial_number, payload);
        } catch (error) {
            throw error;
        }
    },
}));

export default useDeviceStore;
