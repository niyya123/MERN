import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTrashRestore, faUserAlt } from '@fortawesome/free-solid-svg-icons';

import PaginationAdmin from '../../components/PaginationAdmin/Pagination';
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { hostServer, buildingRequest } from '../../utils/request';
import Dialog, { DialogOK } from '../../components/DeleteConfirm/Dialog';
import { ceil } from 'lodash';
import { toast } from 'react-toastify'
import styles from './Building.module.scss';
import classNames from 'classnames/bind';
import { CircularProgress } from '@mui/material';
const cx = classNames.bind(styles);

function Building() {
    var index = 1;
    const [buildingList, setbuildingList] = useState([]);

    useEffect(() => {
        buildingRequest()
            .get('/building/getAllBuilding')
            .then((res) => {
                setbuildingList(res.data);
            });
    }, []);

    const [dialog, setDialog] = useState({
        message: '',
        isLoading: false,
        nameBuilding: '',
    });

    const [dialogOK, setDialogOK] = useState({
        message: '',
        isLoading: false,
    });
    const idBuildingRef = useRef();
    const handleDialog = (message, isLoading, nameBuilding) => {
        setDialog({
            message,
            isLoading,
            nameBuilding,
        });
    };

    const handleDialogOK = (message, isLoading) => {
        setDialogOK({
            message,
            isLoading,
        });
    };
    const handleDelete = (id, building) => {

        const index = buildingList.findIndex((p) => p._id === id);
        handleDialog(
            `Bạn có chắc chắn muốn ${building.isDeleted? 'khôi phục' : 'xóa'} ${building.buidingName} này không?`,
            true,
            `Xóa: ${building.buidingName}` + buildingList[index].buidingName,
        );
        idBuildingRef.current = id;
    };

    const handleButtonOK = (choose) => {
        if (choose) {
            handleDialogOK('', false);
        }
    };

    const areUSureDelete = (choose) => {
        if (choose) {
            buildingRequest()
                .put(hostServer + `/api/building/updateBuilding/${idBuildingRef.current}`)
                .then((res) => {
                    setbuildingList(res.data);
                    toast.success("Xóa tòa nhà thành công", {
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
                    toast.error("Đã xảy ra lỗi, xóa tòa nhà thất bại", {
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

    

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [buildingsPerPage, setUsersPerPage] = useState(7);
    const firstPageIndex = (currentPage - 1) * buildingsPerPage;
    const lastPageIndex = firstPageIndex + buildingsPerPage;
    const dataEachPage = buildingList.slice(firstPageIndex, lastPageIndex);

    const handleChangeUsersPerPage = () => {
        var queryUsersPerPage = parseInt(document.getElementById('getNumUsersPerPage').value);
        var renderUsersPerPage =
            queryUsersPerPage <= 0 ? 1 : queryUsersPerPage > buildingList.length ? buildingList.length : queryUsersPerPage;
        setUsersPerPage(renderUsersPerPage);
        document.getElementById('gotoPageUserNum').value = 1;
        setCurrentPage(1);
    };
    const handleGoToUsersPageNum = (e) => {
        var queryPageToGo = parseInt(document.getElementById('gotoPageUserNum').value);
        var pageToGo =
            queryPageToGo <= 0
                ? 1
                : queryPageToGo > ceil(buildingList.length / buildingsPerPage)
                    ? ceil(buildingList.length / buildingsPerPage)
                    : queryPageToGo;
        document.getElementById('gotoPageUserNum').value = pageToGo;
        setCurrentPage(pageToGo);
    };



    if (buildingList.length === 0) return (
        <div className={cx('loading')}>
            <CircularProgress />
        </div>
    )
    return (
        <div className={cx('listUsersAdminTitle d-flex flex-column')}>
            <div className={cx('p-3')}>
                <div className={cx('d-flex align-items-center mb-4 qlsp')}>
                    <h1 style={{ width: '800px', textAlign: 'left' }} className={cx('mr-3 fw-bold UserTitle')}>
                        <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> Quản lý tòa nhà
                    </h1>
                    <h2 style={{ width: '800px', textAlign: 'right' }} className={cx('fw-bold totalCountPur')}>
                        (<FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> Tất cả: {buildingList.length} tòa nhà)
                    </h2>
                </div>
                <table className={cx('table tableOfUser table-striped table-hover border-primary table-bordered')}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên tòa nhà</th>
                            <th scope="col">Trạng thái</th>
                            {/* <th scope="col">Thời gian cập nhật</th> */}
                            <th scope="col">Tùy chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataEachPage.map((building) => (
                            <tr key={building._id}>

                                <th scope="row" >
                                    {index++}
                                </th>
                                <td >
                                    {building.buidingName}
                                </td>
                                <td >{building.isDeleted ? 'Đã xóa' : 'Chưa xóa'}</td>
                                {/* <td >
                                    {format(new Date(building.updatedAt), 'yyyy-MM-dd kk:mm:ss')}
                                </td> */}

                                <td>

                                    {building.isDeleted ?
                                        <button
                                            className={cx(' formMethod btnEditUser btn btn-outline-primary')}
                                            onClick={() => handleDelete(building._id, building)}
                                        >
                                            {' '}
                                            Khôi phục <FontAwesomeIcon icon={faTrashRestore} />
                                        </button>
                                        :
                                        <button
                                            className={cx(' formMethod btnEditUser btn btn-outline-danger')}
                                            onClick={() => handleDelete(building._id, building)}
                                        >
                                            {' '}
                                            Xóa <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))}
                        {dialog.isLoading && (
                            <Dialog
                                nameUser={dialog.nameUser}
                                onDialog={areUSureDelete}
                                message={dialog.message}
                            />
                        )}

                        {dialogOK.isLoading && <DialogOK onDialog={handleButtonOK} message={dialogOK.message} />}
                    </tbody>
                </table>
            </div>
            <PaginationAdmin
                className={cx('pagination-bar')}
                currentPage={currentPage}
                totalCount={buildingList.length}
                itemsPerPage={buildingsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
            <div className={cx('divCustomBtn')}>
                <label htmlFor="getNumUsersPerPage">Số lượng tòa nhà/trang: </label>
                <input
                    type={'number'}
                    id="getNumUsersPerPage"
                    min={1}
                    max={buildingList.length}
                    defaultValue={buildingsPerPage}
                ></input>
                <button className={cx('myCustomBtn btn btn-outline-primary')} onClick={() => handleChangeUsersPerPage()}>
                    OK
                </button>
                <br></br>
                <label htmlFor="gotoPageUserNum">Đi nhanh đến trang: </label>
                <input
                    type={'number'}
                    id="gotoPageUserNum"
                    min={1}
                    max={ceil(buildingList.length / buildingsPerPage)}
                    defaultValue={1}
                ></input>
                <button className={cx('myCustomBtn btn btn-outline-primary')} onClick={(e) => handleGoToUsersPageNum(e)}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default Building;
