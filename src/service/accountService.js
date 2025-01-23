// src/service/accountService.js
export const fetchAccountData = async () => {
  const response = await fetch("/data/account.json", {
    cache: "force-cache", // 캐싱 활성화
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
};
