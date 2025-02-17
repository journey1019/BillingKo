import { BiBuildings } from "react-icons/bi";

const Homepage = () => {
    const user_name = localStorage.getItem("user_name");

    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                <div className="p-3 border border-2 border-gray-400 rounded-md">
                    <BiBuildings />
                </div>
                <div className="items-center text-xl">Hello, {user_name}</div>
            </div>
        </div>
    );
};

export default Homepage;
