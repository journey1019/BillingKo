import { exportToCSV } from "@/utils/csvExporter";
import { exportToExcel } from "@/utils/excelExporter";
import { formatNumber } from "@/utils/formatHelpers";

const transformDeviceDetailsToExportData = (deviceDetails) => {
    return deviceDetails.map((device, index) => ({
        번호: index + 1,
        별칭: device.alias,
        단말기: device.serial_number,
        "사용 기간": device.period_data,
        기본료: formatNumber(device.basic_fee),
        통신료: formatNumber(device.add_use_fee),
        "기타 사용료": formatNumber(device.subscribe_fee),
        "부가 서비스료": formatNumber(device.modification_fee),
        "사용 바이트 수 (b)": formatNumber(device.use_byte_total),
        "총 요금": formatNumber(device.total_fee),
    }));
};

export const exportDeviceDetailsToCSV = (deviceDetails) => {
    const exportData = transformDeviceDetailsToExportData(deviceDetails);
    exportToCSV(exportData, "Device_Details.csv");
};

export const exportDeviceDetailsToExcel = (deviceDetails) => {
    const exportData = transformDeviceDetailsToExportData(deviceDetails);
    exportToExcel(exportData, "Device_Details.xlsx");
};
