const Stock = () => {
    return (
        <div className="flex flex-col py-4 h-full">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">재고 관리</h1>

                <div className="p-4">
                    <div className="grid grid-cols-2 items-center">
                        <span className="col-span-1 text-gray-500 text-sm">재고 수량</span>
                        <span className="col-span-1 text-lg">- 개</span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-2 items-center">
                        <span className="float-left col-span-1 text-gray-500 text-sm">수령할 수량</span>
                        <span className="col-span-1 text-lg">- 개</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stock;