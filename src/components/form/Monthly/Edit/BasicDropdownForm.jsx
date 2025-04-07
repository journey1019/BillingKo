import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import { formatDateAddTime, formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { LuRefreshCw } from "react-icons/lu";
import AlertBox from '@/components/common/AlertBox';
import { useNavigate } from 'react-router-dom';


const BasicDropdownForm = ({ detailData, fetchDetailData, yearMonth }) => {
    const navigate = useNavigate();

    console.log(detailData)
    console.log(yearMonth)
    const [alertBox, setAlertBox] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ detailData가 바뀔 때 formData 초기화
    useEffect(() => {
        if (!detailData) return;
        setFormData({
            profileId: detailData.profile_id || "",
            accountNumber: detailData.acct_num || "",
            alias: detailData.alias || "",
            serialNumber: detailData.serial_number || "",
            ppid: detailData.ppid || "",
            activationDate: detailData.activate_date ? detailData.activate_date.split("T").join(" ") : "",
            deactivationDate: detailData.deactivate_date ? detailData.deactivate_date.split("T").join(" ") : "",
            free_bytes: detailData.free_bytes ?? "",
            use_period: detailData.use_period || "",
            use_percent_of_month: detailData.use_percent_of_month || "",
            use_byte_total: detailData.use_byte_total || "",
            basic_fee: detailData.payment.basic_fee ?? "",
            final_fee: detailData.payment.final_fee ?? "",
            total_fee: detailData.payment.total_fee ?? "",
            subscribe_fee: detailData.payment.subscribe_fee ?? "",
            add_use_fee: detailData.payment.add_use_fee ?? "",
            cut_off_fee: detailData.payment.cut_off_fee ?? "",
            modification_fee: detailData.payment.modification_fee ?? "",
        });
    }, [detailData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!name) return; // name 없으면 무시

        let cleanedValue = value;

        // 숫자일 경우 쉼표 제거
        if (!isNaN(value.toString().replace(/,/g, ""))) {
            cleanedValue = value.toString().replace(/,/g, "");
        }

        // 날짜일 경우 시:분까지만 입력되었으면 ":00" 추가
        if ((name === "activationDate" || name === "deactivationDate") && value.length === 16) {
            cleanedValue = `${value}:00`;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: cleanedValue,
        }));
    };


    // ✅ 저장
    const handleSave = async () => {
        try {
            const updatedData = {
                ...detailData, // 최신 detailData 기준
                profile_id: formData.profileId,
                acct_num: formData.accountNumber,
                alias: formData.alias,
                serial_number: formData.serialNumber,
                ppid: formData.ppid,
                activate_date: formatDateAddTime(formData.activationDate),
                deactivate_date: formatDateAddTime(formData.deactivationDate),
                free_bytes: formData.free_bytes,
                use_byte_total: formData.use_byte_total,
                use_period: formData.use_period,
                use_percent_of_month: formData.use_percent_of_month,
                basic_fee: formData.basic_fee,
                final_fee: formData.final_fee,
                total_fee: formData.total_fee,
                subscribe_fee: formData.subscribe_fee,
                add_use_fee: formData.add_use_fee,
                cut_off_fee: formData.cut_off_fee,
                modification_fee: formData.modification_fee,
            };

            const { data_index, user_id, update_date, update_version, ...payload } = updatedData;

            await saveKOMonthlyDetailData(detailData.data_index, payload);

            setAlertBox({
                type: "success",
                title: "저장 성공",
                message: "데이터가 성공적으로 저장되었습니다.",
            });

            closeDropdown();
        } catch (error) {
            console.error("Error updating data:", error);
            setAlertBox({
                type: "danger",
                title: "저장 실패",
                message: "서버에 데이터를 저장하지 못했습니다.",
            });
        }

        setTimeout(() => setAlertBox(null), 3000);
    };

    // ✅ 새로고침
    // const handleRefresh = async () => {
    //     if (!fetchDetailData) return;
    //     try {
    //         await fetchDetailData();
    //         setAlertBox({
    //             type: "info",
    //             title: "데이터 불러오기 성공!",
    //             message: "수정한 데이터를 성공적으로 불러왔습니다.",
    //         });
    //     } catch (error) {
    //         setAlertBox({
    //             type: "danger",
    //             title: "데이터 불러오기 실패!",
    //             message: "데이터를 다시 불러오는 데 실패했습니다.",
    //         });
    //     }
    //
    //     setTimeout(() => setAlertBox(null), 3000);
    // };
    // const handleGoToKOMonthlyPage = () => {
    //     if (!yearMonth || !detailData?.serial_number) return;
    //
    //     const query = new URLSearchParams({
    //         yearMonth,
    //         serial: detailData.serial_number,
    //     }).toString();
    //
    //     navigate(`/ko_monthly?yearMonth=${yearMonth}&serial=${detailData.serial_number}`, { replace: true });
    // };
    const handleForceNavigate = () => {
        const query = `yearMonth=${yearMonth}&serial=${detailData.serial_number}`;
        const targetUrl = `/ko_monthly?${query}`;
        const currentUrl = `${location.pathname}${location.search}`;

        if (currentUrl === targetUrl) {
            // ✅ 현재 주소와 같으면 강제 새로고침
            navigate(0); // window.location.reload()와 동일한 효과
        } else {
            // ✅ 주소 다르면 정상 이동
            navigate(targetUrl);
        }
    };


    return (
        <div className="relative inline-block float-right">
            {/* ✅ AlertBox */}
            {alertBox && (
                <AlertBox type={alertBox.type} title={alertBox.title} message={alertBox.message} />
            )}

            {/* ✅ Refresh 버튼 */}
            {/*<button className="hover:text-blue-500 pr-2" onClick={handleGoToKOMonthlyPage}>*/}
            {/*    <LuRefreshCw />*/}
            {/*</button>*/}
            {/*<button */}
            {/*    className="hover:text-blue-500 pr-2" */}
            {/*    onClick={() => navigate(handleForceNavigate)}*/}
            {/*>*/}
            {/*    <LuRefreshCw />*/}
            {/*</button>*/}
            <button
                className="hover:text-blue-500 pr-2"
                onClick={() => { window.location.href = `/ko_monthly?yearMonth=${yearMonth}&serial=${detailData.serial_number}` }}
            >
                <LuRefreshCw />
            </button>

            {/* ✅ 수정 버튼 */}
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>

            {/* ✅ 드롭다운 */}
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="단말 세부 내용 수정">
                <div className="px-4 py-2 space-y-3 border-b">
                    {[
                        { label: "활성화 날짜", name: "activationDate", type: "datetime-local" },
                        { label: "비활성화 날짜", name: "deactivationDate", type: "datetime-local" },
                    ].map((field, index) => (
                        <FormInput
                            key={index}
                            {...field}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    ))}
                </div>
                <div className="px-4 py-2 space-y-3 border-b">
                    {[
                        { label: "무료 바이트 제공량", name: "free_bytes", type: "number" },
                        { label: "총 사용 바이트", name: "use_byte_total", type: "number" },
                        { label: "월간 사용 기간", name: "use_period", type: "number" },
                        { label: "월간 사용 백분율", name: "use_percent_of_month", type: "number" },
                    ].map((field, index) => (
                        <FormInput
                            key={index}
                            {...field}
                            value={formData[field.name]}
                            onChange={handleChange}
                            direct={field.type}
                        />
                    ))}
                </div>
                <div className="px-4 py-2 space-y-3">
                    {[
                        { label: "기본료", name: "basic_fee", type: "number" },
                        { label: "가입비", name: "subscribe_fee", type: "number" },
                        { label: "추가 사용료", name: "add_use_fee", type: "number" },
                        { label: "절사 금액", name: "cut_off_fee", type: "number" },
                        { label: "부가 서비스료", name: "modification_fee", type: "number" },
                        { label: "총 납부액", name: "final_fee", type: "number" },
                    ].map((field, index) => (
                        <FormInput
                            key={index}
                            {...field}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            direct={field.type}
                        />
                    ))}
                </div>

                {/* ✅ 액션 버튼 */}
                <div className="flex justify-end p-2 bg-gray-100 rounded-b-md space-x-2">
                    <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
                        Save
                    </button>
                    <button onClick={closeDropdown} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">
                        Close
                    </button>
                </div>
            </DropdownMenu>
        </div>
    );
};

export default BasicDropdownForm;
