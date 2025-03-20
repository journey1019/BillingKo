import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { formatDateTime, formatDateIndex } from '@/utils/formatHelpers.jsx';

const UploadFileTabOverview = ({ detailData, uploadHistoryDetailLoading, uploadHistoryDetailError }) => {


    return(
        <>
            <div>
                {uploadHistoryDetailLoading ? (
                    <LoadingSpinner/>
                ) : uploadHistoryDetailError ? (
                    <p className="text-red-500">{uploadHistoryDetailError}</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm font-semibold text-gray-600">사용 여부</span>
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        detailData.use_yn === 'Y' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}>
                                    <div
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                            detailData.use_yn === 'Y' ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </div>
                                <span className="text-sm font-medium">{detailData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col py-2">
                            <div className="flex flex-row items-center">
                                <span className="text-xs text-gray-500 w-1/6">업데이트한 계정</span>
                                <h2 className="text-sm font-semibold text-gray-800 w-5/6">{detailData.update_user_id ?? '-'}</h2>
                            </div>
                            <div className="flex flex-row items-center">
                                <span className="text-xs text-gray-500 w-1/6">업데이트한 날짜 </span>
                                <h2 className="text-sm font-semibold text-gray-800 w-5/6">{formatDateTime(detailData.update_date)}</h2>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm py-3">
                            {[
                                { label: 'SPID', value: detailData.sp_id },
                                { label: '요금제', value: detailData.alias },
                                { label: '활성화 날짜', value: formatDateIndex(detailData.active_index) },
                                { label: '비활성화 날짜', value: formatDateIndex(detailData.deactive_index) ?? '-' },
                                { label: '등록된 날짜', value: formatDateTime(detailData.regist_date) },
                                { label: '등록한 계정', value: detailData.regist_user_id },
                            ].map(({ label, value, className }, index) => (
                                <div key={index} className="flex items-center gap-4 border-b pb-2">
                                    <span className="w-40 font-semibold text-gray-700">{label}</span>
                                    <span
                                        className={`p-2 rounded-md bg-gray-100 flex-1 ${className || ''}`}>{value}</span>
                                </div>
                            ))}

                            <div className="flex items-start gap-4 border-b pb-2">
                                <span className="w-40 font-semibold text-gray-700">포함된 파일 리스트</span>
                                <ul className="p-2 border rounded-md bg-gray-100 flex-1">
                                    {detailData.include_files && detailData.include_files.length > 0 ? (
                                        detailData.include_files.map((file, index) => (
                                            <li key={index} className="list-disc ml-5">{file}</li>
                                        ))
                                    ) : (
                                        <p>-</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default UploadFileTabOverview;