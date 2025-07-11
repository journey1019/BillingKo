/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            zIndex: {
                '60': '60',  // 객체 형태로 수정
                '70': '70',  // 필요한 경우 추가 가능
                '100': '100',
            },
        },
    },
    plugins: [],
};
