import { IoMdRefresh } from "react-icons/io";

const RefreshButton = ({
                                onRefresh,
                                refreshLabel = "Refresh List"
                            }) => {

    return (
        <div className="relative">
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
                >
                    <IoMdRefresh />
                </button>
            )}
        </div>
    );
};

export default RefreshButton;
