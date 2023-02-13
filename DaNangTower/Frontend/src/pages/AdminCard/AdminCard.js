import { faFileEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userRequest } from '../../utils/request';
import styles from './AdminCard.module.scss';
import { Typography } from '@mui/material';
import { createCard, deleteCard, deleteManyCards, getAllCard, updateCard } from '../../redux/cardRedux';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { current } from '@reduxjs/toolkit';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
const cx = classNames.bind(styles);
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'center',
};

function AdminUser() {
    var index = 1;
    const [userList, setUserList] = useState([]);
    const [eventList, setEventList] = useState({});
    const [selectEventValue, setSelectEventValue] = useState('');
    const [selectUserValue, setSelectUserValue] = useState('');
    const [idCardActive, setIdCardActive] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openCreateCard, setOpenCreateCard] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const { currentCards, loading } = useSelector((state) => state.card);
    const dispatch = useDispatch();

    //pagination
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    const cardItemPerPage = (cards, currentPage) => {
        return cards.slice((currentPage - 1) * 6, currentPage * 6);
    };
    //delete one card
    const handleOpen = (idCard) => {
        setOpen(true);
        setIdCardActive(idCard);
    };
    const handleClose = () => setOpen(false);

    const handleDelete = async () => {
        dispatch(deleteCard(idCardActive));
        setOpen(false);
    };

    //delete many card
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);

    const handleDeleteMany = async () => {
        dispatch(deleteManyCards(selectedCards));
        setOpenDelete(false);
        setSelectedCards([]);
    };

    //update card
    const handleOpenUpdate = (idCard) => {
        setOpenUpdate(true);
        setIdCardActive(idCard);
    };
    const handleCloseUpdate = () => setOpenUpdate(false);

    const handleUpdate = () => {
        dispatch(
            updateCard({
                idCard: idCardActive,
                idEvent: selectEventValue,
            }),
        );
        setOpenUpdate(false);
    };

    //create card

    const handleOpenCreateCard = () => {
        setOpenCreateCard(true);
    };
    const handleCreateCard = () => {
        dispatch(createCard({
            idUser: selectUserValue,
            idEvent: selectEventValue,
        }))
        setOpenCreateCard(false)
    };
    const handleCloseCreateCard = () => {
        setOpenCreateCard(false);
    };
    const handleChangeInput = (e) => {
        if (selectedCards.includes(e.target.value)) {
            setSelectedCards(selectedCards.filter((card) => card !== e.target.value));
        } else {
            setSelectedCards((prev) => [...prev, e.target.value]);
        }
    };

    const handleSelectedAll = () => {
        if (selectedCards.length === cardItemPerPage(currentCards, page).length) {
            setSelectedCards([]);
        } else {
            setSelectedCards(cardItemPerPage(currentCards, page).map((card) => card._id));
        }
    };
    useEffect(() => {
        //get all cards
        dispatch(getAllCard());
    }, [dispatch]);

    useEffect(() => {
        //get all events
        userRequest()
            .get('/admin/event')
            .then((res) => {
                setEventList(res.data);
                setSelectEventValue(res.data[0]._id);
            });
        userRequest()
            .get('/admin/users')
            .then((res) => {
                setUserList(res.data);
                setSelectUserValue(res.data[0]._id);
            });
    }, []);

    return loading ? (
        <div className={cx('loading')}>
            <CircularProgress />
        </div>
    ) : (
        <div className={cx('listUsersAdminTitle d-flex flex-column')}>
            <div className={cx('p-3')}>
                <div className={cx('d-flex align-items-center mb-4 qlsp')}>
                    <LocalActivityOutlinedIcon style={{ fontSize: '36px', color: '#fff' }} />
                    <h2 className={cx('ms-2 fw-bold UserTitle')}>Quản lý vé</h2>
                    <h2 className={cx('fw-bold totalCountPur')} style={{ marginLeft: 'auto' }}>
                        (<LocalActivityOutlinedIcon /> Tất cả: {currentCards.length} vé)
                    </h2>
                    <button className={cx('btn-create')} onClick={handleOpenCreateCard}>
                        <AddCircleOutlineRoundedIcon /> Tạo vé
                    </button>
                    <button className={cx('btnDeleteAllUsers btn btn-danger')} onClick={handleOpenDelete}>
                        <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> Xóa vé
                    </button>
                    &nbsp;
                </div>
                <table className={cx('table tableOfUser table-striped table-hover border-primary table-bordered')}>
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className={cx('form-check-input')}
                                    name="allSelect"
                                    checked={selectedCards.length === cardItemPerPage(currentCards, page).length}
                                    onChange={handleSelectedAll}
                                />
                            </th>
                            <th scope="col">#</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Ngày sinh</th>
                            <th scope="col">Danh sách sự kiện</th>
                            <th scope="col">Tùy chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cardItemPerPage(currentCards, page).map((card) => (
                            <tr key={card._id}>
                                <td style={{ width: '3%' }}>
                                    <input
                                        type="checkbox"
                                        className={cx('form-check-input')}
                                        checked={selectedCards.includes(card._id)}
                                        value={card._id}
                                        onChange={handleChangeInput}
                                    />
                                </td>
                                <th scope="row" style={{ width: '4%' }}>
                                    {index++}
                                </th>
                                <td style={{ width: '5%' }}>
                                    <Link to={`/admin/users/editUser/1`} className={cx('linkToUser')}>
                                        {card.user?.name}
                                    </Link>
                                </td>
                                <td style={{ width: '1%' }}>{card.user?.email}</td>
                                <td style={{ width: '5%' }}>{card.user?.phone}</td>
                                <td style={{ width: '5%' }}>{card.user?.gender}</td>
                                <td style={{ width: '8%' }}>{card.user?.birthday}</td>
                                <td style={{ width: '24%' }}>
                                    {card.list_event.map((event, index) => (
                                        <p key={index}>{event.name}</p>
                                    ))}
                                </td>

                                <td style={{ width: '14%' }}>
                                    <button
                                        className={cx('formMethod btnEditUser btn btn-outline-primary')}
                                        onClick={() => handleOpenUpdate(card._id)}
                                    >
                                        Thêm <FontAwesomeIcon icon={faFileEdit} />
                                    </button>
                                    &nbsp;
                                    <button
                                        className={cx(' formMethod btnEditUser btn btn-outline-danger')}
                                        onClick={() => handleOpen(card._id)}
                                    >
                                        {' '}
                                        Xóa <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={cx('pagination')}>
                    <Pagination
                        count={
                            currentCards.length % 6 > 0
                                ? Math.floor(currentCards.length / 6) + 1
                                : currentCards.length / 6
                        }
                        page={page}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
                        Bạn có chắc chắn muốn xóa vé này ?
                    </Typography>
                    <div className={cx('actions')}>
                        <button style={{ backgroundColor: 'red' }} onClick={handleDelete}>
                            Có
                        </button>
                        <button onClick={handleClose}>Không</button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
                        Bạn có chắc chắn muốn xóa những vé đã chọn ?
                    </Typography>
                    <div className={cx('actions')}>
                        <button style={{ backgroundColor: 'red' }} onClick={handleDeleteMany}>
                            Có
                        </button>
                        <button onClick={handleCloseDelete}>Không</button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 className={cx('heading')}>Thêm sự kiện</h2>
                    <p>Chọn sự kiện bạn muốn thêm vào vé : </p>
                    <div>
                        <span className={cx('title')}>Sự kiện</span>
                        <select
                            value={selectEventValue}
                            onChange={(e) => setSelectEventValue(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            {eventList.length > 0 &&
                                eventList.map((event, index) => (
                                    <option value={event._id} key={index}>
                                        {event.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={cx('actions')}>
                        <button style={{ backgroundColor: 'blue' }} onClick={handleUpdate}>
                            Thêm
                        </button>
                        <button onClick={handleCloseUpdate}>Không</button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openCreateCard}
                onClose={handleCloseCreateCard}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2>Tạo vé</h2>
                    <div>
                        <span className={cx('title')}>Người dùng</span>
                        <select
                            value={selectUserValue}
                            onChange={(e) => setSelectUserValue(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            {userList.length > 0 &&
                                userList.map((user, index) => (
                                    <option value={user._id} key={index}>
                                        {user.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <span className={cx('title')}>Sự kiện</span>
                        <select
                            value={selectEventValue}
                            onChange={(e) => setSelectEventValue(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            {eventList.length > 0 &&
                                eventList.map((event, index) => (
                                    <option value={event._id} key={index}>
                                        {event.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={cx('actions')}>
                        <button style={{ backgroundColor: 'blue' }} onClick={handleCreateCard}>
                            Thêm
                        </button>
                        <button onClick={handleCloseCreateCard}>Không</button>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default AdminUser;
