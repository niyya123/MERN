import './sidebar.scss'
import { useNavigate } from 'react-router-dom';



function Sidebar() {
    const navigate = useNavigate();
    const handleUserClick = () => {
        navigate('/admin/users');
    };
    const handleCardClick = () => {
        navigate('/admin/card');
    };
    const handleEventClick = () => {
        navigate('/admin/event');
    };
    const handleBuildingClick = () => {
        navigate('/admin/building');
    };
    return (
        <div className="d-flex" id="wrapper">
            <div className="border-end bg-white " id="sidebar-wrapper">
                <div className="sidebar-heading border-bottom bg-light my-title">Admin</div>
                <div className="list-group list-group-flush my-sidebar">
                    <button className="list-group-item list-group-item-action list-group-item-light p-3" onClick={handleUserClick}>Quản lý người dùng</button>
                    <button className="list-group-item list-group-item-action list-group-item-light p-3" onClick={handleCardClick}>Quản lý vé</button>
                    <button className="list-group-item list-group-item-action list-group-item-light p-3" onClick={handleEventClick}>Quản lý sự kiện</button>
                    <button className="list-group-item list-group-item-action list-group-item-light p-3" onClick={handleBuildingClick}>Quản lý tòa nhà</button>
                </div>
            </div>
        </div>

    );
}

export default Sidebar;