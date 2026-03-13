import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function SideBar() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logoWrap}>
                <Logo />
            </div>
            <AppNav />

            <Outlet />

            <Footer />
        </div>
    );
}

export default SideBar;
