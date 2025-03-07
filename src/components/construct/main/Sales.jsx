import { IoIosWarning } from "react-icons/io";


const Sales = () => {
    const datas = [
        {count: '-', definite: '수량', status: '포장 해야함', icon: <IoIosWarning className="w-5 h-5 p-1 rounded-full border"/>, color: 'blue'},
        {count: '-', definite: '수량', status: '배송 예정', icon: <IoIosWarning className="w-5 h-5 p-1 rounded-full border"/>, color: 'red'},
        {count: '-', definite: '수량', status: '배달 예정', icon: <IoIosWarning className="w-5 h-5 p-1 rounded-full border"/>, color: 'green'},
        {count: '-', definite: '수량', status: '청구서', icon: <IoIosWarning className="w-5 h-5 p-1 rounded-full border"/>, color: 'orange'}
    ]

    const Construct = ({data}) => {
        return(
            <div className="col-span-1 flex flex-col space-y-4 items-center">
                <div className="flex flex-col items-center py-2">
                    <span className={`text-4xl text-${data.color}-500 font-semibold pb-3`}>{data.count}</span>
                    <span className="text-xs text-gray-500">{data.definite}</span>
                </div>
                <div className="flex space-x-2 text-gray-500 items-center">
                    {data.icon}
                    <span className="text-sm">{data.status}</span>
                </div>
            </div>
        )
    }

    return(
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">판매 관리</h1>
                <div className="px-2 py-4 grid gap-2 grid-cols-4">
                    {datas.map(data => (
                        <Construct data={data}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sales;