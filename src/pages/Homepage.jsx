import { BiBuildings } from "react-icons/bi";
import Move from '@/components/layout/main/Move.jsx';
import Stock from '@/components/layout/main/Stock.jsx';
import HorizontalNonLinearStepper from '@/components/module/HorizontalNonLinearStepper.jsx';
import PaymentStatus from '@/components/layout/main/PaymentStatus.jsx';


const Homepage = () => {
    const user_name = localStorage.getItem("user_name");
    console.log(localStorage.getItem("token"))

    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                <div className="p-2 border border-2 border-gray-400 rounded-md">
                    <BiBuildings className="w-6 h-6 text-gray-600"/>
                </div>
                <div className="items-center text-xl font-semibold">Hello, {user_name}</div>
            </div>

            <Move />

            <Stock />

            <PaymentStatus/>

            {/*<div className="flex flex-row w-1/2">*/}
            {/*    <HorizontalNonLinearStepper/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Homepage;
