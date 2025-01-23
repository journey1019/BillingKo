import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/service/authService";

const Login = ({ setAuth }) => {
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(userId, userPw);

            // 로그인 성공 시 토큰 저장
            localStorage.setItem("token", data.user_token);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("user_name", data.user_nm);
            localStorage.setItem("token_expired", data.token_expired);

            // 상태 업데이트
            setAuth(true);

            // 홈페이지로 이동
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="userId"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="userPw"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
