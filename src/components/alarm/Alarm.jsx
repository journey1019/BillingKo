// Alarm.jsx
import { useEffect, useState, useRef } from 'react';
import { GoBellFill } from 'react-icons/go';
import { fetchAlarm, updateAlarm } from '@/service/alarmService'; // 상대경로 조정

const Alarm = () => {
    const [alarms, setAlarms] = useState([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const loadAlarms = async () => {
        try {
            const data = await fetchAlarm();
            setAlarms(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    // 🔁 마지막 알림 index를 기준으로 일괄 확인 처리
    const handleConfirm = async () => {
        if (alarms.length === 0) return;

        const lastIndex = alarms[alarms.length - 1].alarm_index;
        await updateAlarm(lastIndex); // 서버에서는 이 index 이하를 모두 확인 처리
        await loadAlarms(); // 다시 조회
    };

    useEffect(() => {
        loadAlarms();
    }, []);

    // 외부 클릭 시 알림 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
                <GoBellFill
                    className={`w-5 h-5 cursor-pointer text-white font-semibold duration-200 transition-colors ${open ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
                    onClick={() => setOpen(!open)}
                />

                {/* ✅ 알림 수 Badge */}
                {alarms.length > 0 && (
                    <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                        {alarms.length}
                    </span>
                )}


                {/* 알림 드롭다운 */}
                {open && (
                    <div className="absolute right-0 top-10 mt-2 w-80 bg-white border rounded shadow-lg z-50 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-600">📢 미확인 알림</div>
                            {alarms.length > 0 && (
                                <button
                                    onClick={handleConfirm}
                                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    전체 확인
                                </button>
                            )}
                        </div>
                        {alarms.length === 0 ? (
                            <div className="text-gray-500 text-xs">알림이 없습니다.</div>
                        ) : (
                            <ul className="space-y-2 max-h-64 overflow-y-auto">
                                {alarms.map((alarm) => {
                                    // 타입 및 키 매핑
                                    const typeLabel = alarm.alarm_type === 'job' ? '작업관리' : alarm.alarm_type;
                                    const keyMap = {
                                        cdr: '파일',
                                        device: '단말기 청구서',
                                        billing: '고객별 청구서',
                                        payment: '납입 현황',
                                    };
                                    const keyLabel = keyMap[alarm.alarm_key] || alarm.alarm_key;

                                    return (
                                        <li
                                            key={alarm.alarm_index}
                                            className="border-b pb-2 flex gap-4"
                                        >
                                            <div className="flex flex-col items-center justify-center w-10">
                                                <div className="text-sm text-gray-600">{alarm.alarm_index}</div>
                                            </div>

                                            <div className="text-xs space-y-1 flex-1">
                                                <div className="font-medium text-blue-600">
                                                    [{typeLabel}] {keyLabel}
                                                </div>
                                                <div className="text-gray-600 text-[11px]">{alarm.alarm_date}</div>
                                                <div className="text-gray-500 text-[11px]">
                                                    관리자: {alarm.user_nm} / 적용일: {alarm.date_index}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alarm;
