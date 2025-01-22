import RootLayout from "@/components/layout/RootLayout.jsx";


const App = () => {
    return (
      <RootLayout>
        {/* 자유롭게 페이지 컴포넌트를 추가 */}
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold">Welcome to the Billing App!</h1>
          <p className="mt-2 text-gray-600">This is the main content area.</p>
        </div>
      </RootLayout>
    );
};

export default App;
