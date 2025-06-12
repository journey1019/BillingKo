import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import ReusableTable from '@/components/table/ReusableTable.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

import TabComponent from '@/components/layout/TabComponent.jsx';
import DeviceTransactionTab from '@/components/form/Device/DeviceTransactionTab.jsx';
import DeviceHistoryTab from '@/components/form/Device/DeviceHistoryTab.jsx';
import DeviceOverViewTab from '@/components/form/Device/DeviceOverViewTab.jsx';
import useDeviceStore from '@/stores/deviceStore.js';
import ExpandablePageLayout from '@/components/layout/ExpandablePageLayout'

const DevicePage = () => {
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.get("value");

    const {
        deviceData,
        deviceLoading,
        deviceError,
        fetchDeviceData,
        fetchDeviceDetails,
        deleteDeviceData,
        historyData,
        deviceHistoryLogData
    } = useDeviceStore();

    const [selectedDeviceId, setSelectedDeviceId] = useState(urlValue || null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장

    useEffect(() => {
        fetchDeviceData();
    }, []);

    useEffect(() => {
        if (selectedDeviceId?.serial_number) {
            fetchDeviceDetails(selectedDeviceId.serial_number);
        }
    }, [selectedDeviceId]);

    // ✅ urlValue로 선택할 계정 자동 설정
    useEffect(() => {
        if (urlValue && deviceData.length > 0) {
            const matchedDevice = deviceData.find(device => device.serial_number === urlValue);
            if (matchedDevice) {
                setSelectedDeviceId(matchedDevice);
                setIsExpanded(true);
            }
        }
    }, [urlValue, deviceData]);

    const handleDeleteSuccess = async (serial_number) => {
        try {
            await fetchDeviceData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedDeviceId(null);
            setIsExpanded(false);
            // console.log(`✅ 삭제 후 새로고침 완료 (ppid: ${serial_number})`);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };

    const latestDeviceLog = deviceHistoryLogData?.sort((a, b) => b.row_number - a.row_number)?.[0];
    const highestRowData = deviceHistoryLogData?.length
        ? deviceHistoryLogData.sort((a, b) => b.row_number - a.row_number)[0]
        : null;
    // console.log('deviceData :', deviceData)
    // console.log(highestRowData);
    // console.log(latestDeviceLog);

    // console.log('historyData', historyData)
    // console.log('deviceHistoryLogData', deviceHistoryLogData)


    return (
        <>
            <ExpandablePageLayout
                title="단말기 관리"
                isExpanded={isExpanded}
                leftTitle="단말기 기본정보 & 매핑 & 수정"
                newButtonTo="/devices/new"
                onExportCSV={() => exportToCSV(deviceData, 'Devices.csv')}
                onExportExcel={() => exportToExcel(deviceData, 'Devices.xlsx')}
                onRefresh={fetchDeviceData}
                table={
                    <ReusableTable
                        columns={DeviceTableColumns || []}
                        data={deviceData || []}
                        options={{
                            ...DeviceTableOptions(selectedDeviceId),
                            meta: {
                                onRowSelect: (selectedRow) => {
                                    if (selectedDeviceId?.serial_number === selectedRow.serial_number) {
                                        setSelectedDeviceId(null);
                                        setIsExpanded(false);
                                    } else {
                                        setSelectedDeviceId(selectedRow);
                                        setIsExpanded(true);
                                    }
                                },
                            },
                        }}
                        isLoading={deviceLoading}
                        error={deviceError}
                    />
                }
                selectedId={selectedDeviceId}
                rightTitle={`${selectedDeviceId?.serial_number} _ ${selectedDeviceId?.serial_number}`}
                onClose={() => {
                    setIsExpanded(false);
                    setSelectedDeviceId(null);
                }}
                entityType="devices"
                editSelectedId={selectedDeviceId?.serial_number}
                deleteData={deleteDeviceData}
                handleDelete={handleDeleteSuccess}
                rightTabs={[
                    { id: 1, label: 'Overview', content: <DeviceOverViewTab /> },
                    { id: 2, label: 'Transaction', content: <DeviceTransactionTab selectedDeviceId={selectedDeviceId} /> },
                    {
                        id: 3, label: 'History', content: (
                            <>
                                <DeviceHistoryTab selectedDeviceId={selectedDeviceId} />
                            </>
                        )
                    }
                ]}
            />
        </>
    );
};

export default DevicePage;