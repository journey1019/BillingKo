

const Move = () => {
    return(
        <>
            <div className="flex flex-col py-4">
                <div className="bg-white rounded-2xl shadow-md">
                    <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">Flow Chart</h1>
                    <div className="p-4 grid grid-cols-5 space-x-10 items-center text-center">
                        <div className="p-4 rounded-md border-blue-400 border-2">창고</div>
                        <div className="p-4 rounded-md border-blue-400 border-2">기초등록</div>
                        <div className="p-4 rounded-md border-blue-400 border-2">견적</div>
                        <div className="p-4 rounded-md border-blue-400 border-2">청구서</div>
                        <div className="p-4 rounded-md border-blue-400 border-2">지로</div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Move;