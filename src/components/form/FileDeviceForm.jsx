import UploadFileDevice from '@/components/layout/File/UploadFileDevice.jsx';

const FileDeviceForm = () => {
    const handleUploadComplete = () => {
        console.log("Upload complete, refreshing data...");
        // 업로드 완료 시 데이터 갱신
        refetch();
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Upload Device Return File</h2>

            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                {/* ✅ 모달 트리거 버튼 */}
                <UploadFileDevice onUploadComplete={handleUploadComplete} />
            </div>
        </div>
    );
};

export default FileDeviceForm;
