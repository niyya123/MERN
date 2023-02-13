import styles from './admin.module.scss'
import classNames from 'classnames/bind';
import SideBar from '../../components/Layout/Sidebar';
import { Outlet } from "react-router-dom";
import { TitleTab } from '../../utils/GenerateTitle';

const cx = classNames.bind(styles);

function Admin() {
    TitleTab('Quản lý ứng dụng');
    return (
        <div className="d-flex admin" id="wrapper">
            <SideBar />
            <div className={cx('content')} id="page-content-wrapper">
            <Outlet />
                {/* {children} */}
            </div>
        </div>
    );
}

export default Admin;