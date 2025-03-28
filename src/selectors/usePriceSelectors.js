import usePriceStore from '@/stores/priceStore.js';

export const usePPIDList = () => {
    const priceData = usePriceStore((state) => state.priceData);
    return priceData.map((item) => item.ppid);
};
