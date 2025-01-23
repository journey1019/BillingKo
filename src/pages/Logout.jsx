import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setAuth }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 인증 정보 제거
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("token_expired");

        // 상태 업데이트
        setAuth(false);

        // 로그인 페이지로 이동
        navigate("/login");
    }, [navigate, setAuth]);

    return null;
};

export default Logout;
