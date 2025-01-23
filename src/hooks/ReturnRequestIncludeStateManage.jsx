import axios from "axios";

async function ReturnRequestIncludeStateManage(urls, params, setLoading) {
    const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;
    const headers = {
        "Content-Type": 'application/json;charset=UTF-8',
        "Accept":"application/json",
        "Authorization": "Bearer " + token,
    };

    try{
        // API 요청이 시작될 때 로딩 상태를 true로 설정
        setLoading(true);

        const response = await axios.get(urls,{
            headers: headers,
            params: params,
            responseType: "json",
        });

        // API 요청이 완료되면 로딩 상태를 false 로 변경
        setLoading(false);

        // 성공 시, 데이터를 반환
        return response.data.response;
    } catch(error) {
        // 에러 발생 시, 로딩 상태를 false로 설정
        setLoading(false);

        // 에러 발생 시, 적절한 처리를 수행하거나 null을 반환
        return null;
    }
}
export default ReturnRequestIncludeStateManage;