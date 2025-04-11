import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/service/authService";

const SignUp = () => {
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userNm, setUserNm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await register(userId, userPw, userNm);
            // console.log("Signup Success:", data);
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            navigate("/login"); // 로그인 페이지로 이동
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                            User ID
                        </label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="userPw" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="userPw"
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="userNm" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="userNm"
                            value={userNm}
                            onChange={(e) => setUserNm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    이미 계정이 있으신가요?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        로그인하기
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
