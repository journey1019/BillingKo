import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Footer from './Footer';

const RootLayout = ({ children }) => {
    return (
        <div className="h-full bg-gray-100">
            {/* Sidebar 포함 Navbar */}
            <Navbar />

            {/* 페이지 콘텐츠 */}
            <div className="flex-1 pt-[112px] bg-gray-100">
                <main className="min-h-screen">
                    <div className="container mx-auto">{children}</div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

RootLayout.propTypes = {
    children: PropTypes.node.isRequired, // children은 ReactNode로 정의
};

export default RootLayout;
