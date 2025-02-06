const DateStampCell = ({ cell }) => {
    const value = cell.getValue(); // 중첩 호출 수정

    const date = new Date(value); // ISO 형식인지 확인

    // 날짜와 시간 포맷팅
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 2024-12-01 11:46:14
    return (
        <span>
            {`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`}
        </span>
    );
}
export default DateStampCell;