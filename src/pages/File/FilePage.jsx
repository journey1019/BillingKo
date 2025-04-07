import FileUpload from '@/components/form/File/FileUpload.jsx';
import FileUploadStatus from '@/components/form/File/FileUploadStatus.jsx';
import CDRnNN from '@/components/features/CDRnNN.jsx';

const FilePage = () => {
    
    return(
        <div className="grid grid-cols-4 2xl:grid-cols-3">
            {/* File Upload */}
            <div className="grid col-span-2 2xl:col-span-1">
                <FileUploadStatus />
            </div>

            {/* File Upload Status Table */}
            <div className="grid col-span-4 py-5">
                <FileUpload />
            </div>

            {/* 'CDR' & 'Network Report' Table */}
            <CDRnNN />
        </div>
    )
}

export default FilePage;