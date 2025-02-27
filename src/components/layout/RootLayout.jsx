import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';
import Footer from './Footer';

const RootLayout = ({ children }) => {
    return (
        <div className="h-full bg-gray-100">
            <Navbar />

            <div className="flex-1 bg-gray-100 pt-[80px] pl-16"> {/* pt-[125px] -> Navbar(w. breadcrumbs)*/}
                <main className="min-h-screen">
                    <div className="mx-auto max-w-[calc(100vw-4rem)] px-4">{children}</div>
                    {/*<div className="container mx-auto">{children}</div>*/}
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
