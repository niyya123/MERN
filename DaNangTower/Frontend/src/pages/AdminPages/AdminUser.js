import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faFileEdit, faTrashAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons';

import PaginationAdmin from '../../components/PaginationAdmin/Pagination';
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { hostServer, userRequest } from '../../utils/request';
import Dialog, { DialogOK } from '../../components/DeleteConfirm/Dialog';
import { Link, useNavigate } from 'react-router-dom';
import { ceil } from 'lodash';
import { toast } from 'react-toastify'
import styles from './AdminUser.scss';
import classNames from 'classnames/bind';
import { CircularProgress } from '@mui/material';
const cx = classNames.bind(styles); 

function AdminUser() {
    var index = 1;
    const [userList, setUserList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        userRequest()
            .get('/admin/users')
            .then((res) => {             
                setUserList(res.data);
            });
    }, []);

    const [dialog, setDialog] = useState({
        message: '',
        isLoading: false,
        nameUser: '',
    });
    const [dialogs, setDialogs] = useState({
        message: '',
        isLoading: false,
        nameUser: '',
    });
    const [dialogOK, setDialogOK] = useState({
        message: '',
        isLoading: false,
    });
    const idUserRef = useRef();
    const handleDialog = (message, isLoading, nameUser) => {
        setDialog({
            message,
            isLoading,
            nameUser,
        });
    };
    const handleDialogs = (message, isLoading, nameUser) => {
        setDialogs({
            message,
            isLoading,
            nameUser,
        });
    };
    const handleDialogOK = (message, isLoading) => {
        setDialogOK({
            message,
            isLoading,
        });
    };
    const handleDelete = (id, user) => {
        //Update
        const index = userList.findIndex((p) => p._id === id);
        handleDialog(
            `B???n c?? ch???c ch???n mu???n x??a ${user.isAdmin ? 'qu???n tr??? vi??n' : 'ng?????i d??ng'} ${user.name} n??y kh??ng?`,
            true,
            `X??a: ${user.isAdmin ? 'Qu???n tr??? vi??n ' : 'Ng?????i d??ng '}` + userList[index].name,
        );
        idUserRef.current = id;
    };

    const handleDeleteMany = () => {
        handleDialogs('B???n c?? ch???c ch???n mu???n x??a h???t ng?????i d??ng ???? ch???n?', true);
    };

    const handleButtonOK = (choose) => {
        if (choose) {
            handleDialogOK('', false);
        }
    };

    const areUSureDelete = (choose) => {
        if (choose) {
            setUserList(userList.filter((p) => p._id !== idUserRef.current));
            userRequest()
                .delete(hostServer + `/api/admin/users/deleteUser/${idUserRef.current}`)
                .then((res) => {
                    setUserList(res.data.user);
                    toast.success("X??a ng?????i d??ng th??nh c??ng", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                })
                .catch((err) => {
                    toast.error("???? x???y ra l???i, x??a ng?????i d??ng th???t b???i", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    console.log(err);
                });
            handleDialog('', false);
        } else {
            handleDialog('', false);
        }
    };

    const handleCheckbox = (e, data) => {
        const { name, checked } = e.target;
        if (checked) {
            if (name === 'allSelect') {
                setSelectedUsers(userList);
            } else {
                setSelectedUsers([...selectedUsers, data]);
            }
        } else {
            if (name === 'allSelect') {
                setSelectedUsers([]);
            } else {
                let tempSeletedUsers = selectedUsers.filter((u) => u._id !== data._id);
                setSelectedUsers(tempSeletedUsers);
            }
        }
    };
    const handleDeleteManyUsers = (choose) => {
        if (choose) {
            if (selectedUsers.length !== 0) {
                const ids = [];
                selectedUsers.forEach((element) => {
                    ids.push(element._id);
                });
                setUserList(userList.filter((x) => selectedUsers.indexOf(x) === -1));
                userRequest()
                    .delete(hostServer + '/api/admin/users/deleteUsers', { data: ids })
                    .then((res) => {
                        setUserList(res.data.user);
                        toast.success("X??a ng?????i d??ng th??nh c??ng", {
                          position: "top-center",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                    })
                    .catch((err) => {
                        toast.error("???? x???y ra l???i, x??a ng?????i d??ng th???t b???i", {
                          position: "top-center",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                    });
                handleDialogs('', false);
            } else {
                handleDialogs('', false);
                handleDialogOK('B???n ch??a ch???n ng?????i d??ng n??o ????? x??a!', true);
            }
        } else {
            handleDialogs('', false);
        }
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(7);
    const firstPageIndex = (currentPage - 1) * usersPerPage;
    const lastPageIndex = firstPageIndex + usersPerPage;
    const dataEachPage = userList.slice(firstPageIndex, lastPageIndex);

    const handleChangeUsersPerPage = () => {
        var queryUsersPerPage = parseInt(document.getElementById('getNumUsersPerPage').value);
        var renderUsersPerPage =
            queryUsersPerPage <= 0 ? 1 : queryUsersPerPage > userList.length ? userList.length : queryUsersPerPage;
        setUsersPerPage(renderUsersPerPage);
        document.getElementById('gotoPageUserNum').value = 1;
        setCurrentPage(1);
    };
    const handleGoToUsersPageNum = (e) => {
        var queryPageToGo = parseInt(document.getElementById('gotoPageUserNum').value);
        var pageToGo =
            queryPageToGo <= 0
                ? 1
                : queryPageToGo > ceil(userList.length / usersPerPage)
                ? ceil(userList.length / usersPerPage)
                : queryPageToGo;
        document.getElementById('gotoPageUserNum').value = pageToGo;
        setCurrentPage(pageToGo);
    };

    if (userList.length === 0) return (
        <div className={cx('loading')}>
            <CircularProgress />
        </div>
    )

    const handleInsertUser = () => {
        navigate('/insertUser');
    }
    return (
        <div className={cx('listUsersAdminTitle d-flex flex-column')}>
            <div className={cx('p-3')}>
                <div className={cx('d-flex align-items-center mb-4 qlsp')}>
                    <h1 className={cx('mr-3 fw-bold UserTitle')}>
                        <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> Qu???n l?? ng?????i d??ng
                    </h1>
                    <button className={cx('btnDeleteAllUsers btn btn-danger')} onClick={() => handleDeleteMany()}>
                        <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> X??a ng?????i d??ng
                    </button>                  
                    &nbsp;
                    <h2 className={cx('fw-bold totalCountPur')}>
                        (<FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> T???t c???: {userList.length} ng?????i d??ng)
                    </h2>
                </div>
                <div>
                    <Link className={cx('btnDeleteAllUsers btn btn-info')} style={{"marginBottom":"10px"}} to={`/admin/users/createuser`}>
                        <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon> Th??m ng?????i d??ng
                    </Link>
                </div>
                <table className={cx('table tableOfUser table-striped table-hover border-primary table-bordered')}>
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className={cx('form-check-input')}
                                    name="allSelect"
                                    checked={selectedUsers?.length === userList.length}
                                    onChange={(e) => handleCheckbox(e, userList)}
                                ></input>
                            </th>
                            <th scope="col">#</th>
                            <th scope="col">T??n</th>
                            <th scope="col">Email</th>
                            <th scope="col">S??? ??i???n tho???i</th>
                            <th scope="col">Gi???i t??nh</th>
                            <th scope="col">Ng??y sinh</th>
                            <th scope="col">?????a ch???</th>
                            <th scope="col">Vai tr??</th>
                            <th scope="col">Th???i gian c???p nh???t</th>
                            <th scope="col">T??y ch???n</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataEachPage.map((user) => (
                            <tr key={user._id}>
                                <td style={{ width: '3%' }}>
                                    <input
                                        type="checkbox"
                                        className={cx('form-check-input')}
                                        name={user._id}
                                        checked={selectedUsers.some((u) => u._id === user._id)}
                                        onChange={(e) => handleCheckbox(e, user)}
                                    ></input>
                                </td>
                                <th scope="row" style={{ width: '4%' }}>
                                    {index++}
                                </th>
                                <td style={{ width: '5%' }}>
                                    <Link to={`/admin/users/editUser/${user._id}`} className={cx('linkToUser')}>
                                        {user.name}
                                    </Link>
                                </td>
                                <td style={{ width: '1%' }}>{user.email}</td>
                                <td style={{ width: '5%' }}>{user.phone}</td>
                                <td style={{ width: '5%' }}>{user.gender}</td>
                                <td style={{ width: '8%' }}>{user.birthday}</td>
                                <td style={{ width: '11%' }}>
                                    {user.address.addressdetail === '' ? '' : `${user.address.addressdetail},`}{' '}
                                    {user.address.ward === '' ? '' : `${user.address.ward},`}{' '}
                                    {user.address.district === '' ? '' : `${user.address.district},`}{' '}
                                    {user.address.province === '' ? '' : `${user.address.province}`}
                                </td>
                                <td style={{ width: '8%' }}>
                                    {user.isAdmin === true ? 'Qu???n tr??? vi??n' : 'Ng?????i d??ng'}
                                </td>
                                <td style={{ width: '8%' }}>
                                    {format(new Date(user.updatedAt), 'yyyy-MM-dd kk:mm:ss')}
                                </td>

                                <td style={{ width: '12%' }}>
                                    <Link className={cx('formMethod')} to={`/admin/users/editUser/${user._id}`}>
                                        <button className={cx('formMethod btnEditUser btn btn-outline-primary')}>
                                            S???a <FontAwesomeIcon icon={faFileEdit} />
                                        </button>
                                    </Link>
                                    &nbsp;
                                    <button
                                        className={cx(' formMethod btnEditUser btn btn-outline-danger')}
                                        onClick={() => handleDelete(user._id, user)}
                                    >
                                        {' '}
                                        X??a <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {dialog.isLoading && (
                            <Dialog
                                //Update
                                nameUser={dialog.nameUser}
                                onDialog={areUSureDelete}
                                message={dialog.message}
                            />
                        )}
                        {dialogs.isLoading && (
                            <Dialog
                                //Update
                                nameUser={dialogs.nameUser}
                                onDialog={handleDeleteManyUsers}
                                message={dialogs.message}
                            />
                        )}
                        {dialogOK.isLoading && <DialogOK onDialog={handleButtonOK} message={dialogOK.message} />}
                    </tbody>
                </table>
            </div>
            <PaginationAdmin
                className={cx('pagination-bar')}
                currentPage={currentPage}
                totalCount={userList.length}
                itemsPerPage={usersPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
            <div className={cx('divCustomBtn')}>
                <label htmlFor="getNumUsersPerPage">S??? l?????ng ng?????i d??ng/trang: </label>
                <input
                    type={'number'}
                    id="getNumUsersPerPage"
                    min={1}
                    max={userList.length}
                    defaultValue={usersPerPage}
                ></input>
                <button className={cx('myCustomBtn btn btn-outline-primary')} onClick={() => handleChangeUsersPerPage()}>
                    OK
                </button>
                <br></br>
                <label htmlFor="gotoPageUserNum">??i nhanh ?????n trang: </label>
                <input
                    type={'number'}
                    id="gotoPageUserNum"
                    min={1}
                    max={ceil(userList.length / usersPerPage)}
                    defaultValue={1}
                ></input>
                <button className={cx('myCustomBtn btn btn-outline-primary')} onClick={(e) => handleGoToUsersPageNum(e)}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default AdminUser;
