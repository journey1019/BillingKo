const StepDrawer = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-12 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200 animate-slide-down">
            <div className="p-4 flex justify-between items-center">
                <div className="flex-1">{children}</div>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-800"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default StepDrawer;
