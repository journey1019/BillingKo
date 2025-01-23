import { Routes, Route } from "react-router-dom";

import RootLayout from "@/components/layout/RootLayout.jsx";
import Homepage from "@/pages/Homepage.jsx";
import AccountPage from "@/pages/AccountPage.jsx";
import DevicePage from '@/pages/DevicePage.jsx';
import PricePage from '@/pages/PricePage.jsx';

const App = () => {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* 기본 경로 */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/device" element={<DevicePage />} />
        <Route path="/price" element={<PricePage />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
