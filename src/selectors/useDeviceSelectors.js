import useDeviceStore from '@/stores/deviceStore.js';


// ✅ profile_id 배열만 추출하는 selector
export const useSerialNumberList = () => {
    const deviceData = useDeviceStore((state) => state.deviceData);
    const uniqueSerialNUmber = Array.from(
        new Set(
            deviceData
                .map((item) => item.serial_number)
                .filter((type) => type !== null && type !== undefined && type !== "")
        )
    )
    return uniqueSerialNUmber;
};

export const useDevProfileList = () => {
    const deviceData = useDeviceStore((state) => state.deviceData);
    // console.log(deviceData)

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