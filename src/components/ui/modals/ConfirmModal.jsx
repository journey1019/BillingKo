
const ConfirmModal = ({ open, messageList = [], notices = [], onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] p-6 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">변경 항목 확인</h2>

                {/* 스크롤 영역 */}
                <div className="overflow-y-auto relative flex-1 border border-gray-200 rounded-md px-4 py-3">
                    {/* 내용이 많으면 상단 그림자 */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white to-transparent z-10" />
                    <ul className="text-sm space-y-1">
                        {messageList.map(({ acct_name, acct_num, status }, idx) => (
                            <li key={idx} className={`font-medium ${
                                status === '과오납' ? 'text-red-500' :
                                    status === '미납' ? 'text-orange-500' :
                                        status === '부분납' ? 'text-yellow-600' :
                                            'text-green-500'
                            }`}>
                                • {acct_name} ({acct_num}): {status}
                            </li>
                        ))}
                    </ul>

                    {notices.length > 0 && (
                        <div className="mt-4 text-xs text-gray-600 whitespace-pre-wrap border-t pt-3">
                            {notices.map((n, idx) => (
                                <div key={idx} className="mb-1">⚠️ {n}</div>
                            ))}
                        </div>
                    )}

                    {/* 아래 그림자 */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10" />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
