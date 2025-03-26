import useDeviceStore from '@/stores/deviceStore.js';

// ✅ profile_id 배열만 추출하는 selector
// ['60002798', '60003193']
// export const useDevProfileList = () => {
//     const accountData = useDeviceStore((state) => state.deviceData);
//     return accountData.map((item) => item.profile_id);
// };

// ✅ 중복 제거 profile_id 배열만 추출하는 selector
// ['60002798', '60003193']
export const useDevProfileList = () => {
    const deviceData = useDeviceStore((state) => state.deviceData);

    const uniqueDevProfile = Array.from(
        new Set(
            deviceData
                .map((item) => item.profile_id)
                .filter((type) => type !== null && type !== undefined && type !== "")
        )
    );

    return uniqueDevProfile;
};

// ✅ 중복 제거 modal_name 배열만 추출하는 selector
// ['ST6100', 'IDP690']
export const useDevModelNameList = () => {
    const deviceData = useDeviceStore((state) => state.deviceData);

    const uniqueDevModel = Array.from(
        new Set(
            deviceData
                .map((item) => item.model_name)
                .filter((type) => type !== null && type !== undefined && type !== "")
        )
    );

    return uniqueDevModel;
};