import { NavLink, useNavigate } from 'react-router-dom';
import './header.scss';
import Tippy from '@tippyjs/react/headless';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useState } from 'react';
import Button from '../../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../../redux/userRedux';
import { hostServer, publicRequest, userRequest } from '../../../utils/request';

function Header() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.current);

    const navigateAdmin = () => {
        navigate('admin/users');
    };

    const navigateSignin = () => {
        navigate('signin');
    };

    const navigateSignup = () => {
        navigate('signup');
    };

    const onSignout = () => {
        dispatch(signout(user));
        userRequest()
            .get('account/signout')
            .then(() => {   
                setTimeout(() => {
                }, 300);
                navigate('/');
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
        setVisible(false);
    };

    const onViewProfile = () => {
        navigate('user');
        setVisible(false);
    };

    const onViewTicket = () => {
        userRequest()
            .get(`${user._id}/ticket`)
            .then(() => {
                console.log('User ticket profile');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mynavbar">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to={'/'}>
                    <img className="logo" src={require('../../../assets/images/Town.png')} alt=""></img>
                </NavLink>
                <button
                    className="navbar-toggler collapsed my-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/'}>
                                Trang chủ
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/event'}>
                                Sự kiện
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/contact'}>
                                Liên hệ
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/model'}>
                                Mô hình
                            </NavLink>
                        </li>
                    </ul>

                    <form className="d-flex" style={{ marginTop: '15px' }}>
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    </form>
                    <div className="account d-flex">
                        {!user && (
                            <button type="button" className="btn btn-outline-success me-2 my-button" onClick={navigateSignup}>
                                Đăng ký
                            </button>
                        )}
                        {!user && (
                            <button type="button" className="btn btn-warning me-2 my-button" onClick={navigateSignin}>
                                Đăng nhập
                            </button>
                        )}
                        {user && user.isAdmin === true && (
                            <button type="button" className="btn btn-info my-button" onClick={navigateAdmin}>
                                Admin
                            </button>
                        )}
                        {user != null && (
                            <Tippy
                                visible={visible}
                                interactive
                                onClickOutside={() => setVisible(false)}
                                render={(attrs) => (
                                    <div className="box" tabIndex="-1" {...attrs}>
                                        <div className="popup">                                          
                                            <Button leftIcon={<PersonOutlineOutlinedIcon />} onClick={onViewProfile}>
                                                Thông tin cá nhân
                                            </Button>                                        
                                            <Button leftIcon={<LocalActivityOutlinedIcon />} onClick={onViewTicket} to="/ticket">
                                                Thông tin vé
                                            </Button>
                                            <Button leftIcon={<LoginOutlinedIcon />} divider onClick={onSignout}>
                                                Đăng xuất
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            >
                                <div className="avatar-wrap" onClick={() => setVisible(!visible)}>
                                    <img
                                        src={user.image}
                                        alt={`avatar ${user.image}`}
                                    />
                                </div>
                            </Tippy>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
