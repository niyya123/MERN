import React,{ useEffect, useState, useRef } from 'react';
import { hostServer, eventRequest } from '../../utils/request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dialog, { DialogOK } from '../../components/DeleteConfirm/Dialog';
import PaginationAdmin from '../../components/PaginationAdmin/Pagination';

import { ceil } from 'lodash';
import { toast } from 'react-toastify'
import { faWrench,faFileEdit,faTrashAlt, faPlusCircle,faXmarkCircle, faCalendarCheck, faCalendar } from '@fortawesome/free-solid-svg-icons';
import {Form,Button} from 'react-bootstrap'
import './adminevent.css';

function AdminEvent() {

    const getInitialState = () => {
        const value = "Mở đăng ký";
        return value;
    };

    var index = 1;

    const [eventList, setEventList] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const [name,setName] = useState();
    const [description,setDescription] = useState();
    const [imageurl,setImageurl] = useState();
    const [datebegin,setDatebegin] = useState();
    const [dateend,setDateend] = useState();
    const [status,setStatus] = useState(getInitialState);
    const [middleId,setMiddleId] = useState();

    useEffect(()=> {
        eventRequest()
            .get('/admin/event')
            .then((res)=>{
                setEventList(res.data);
                console.log(res.data)
            });
    },[]);

    const [dialog, setDialog] = useState({
        message:'',
        isLoading : false,
        nameEvent:'',
    })

    const [dialogs, setDialogs] = useState({
        message:'',
        isLoading : false,
        nameEvent:'',
    })

    const [dialogOK, setDialogOK] = useState({
        message: '',
        isLoading: false,
    });

    const idEventRef = useRef();

    const handleDialog = (message,isLoading,nameEvent)=>{
        setDialog({
            message,
            isLoading,
            nameEvent
        })
    }

    const handleDialogs = (message,isLoading,nameEvent)=>{
        setDialogs({
            message,
            isLoading,
            nameEvent
        })
    }

    const handleDialogOK = (message, isLoading) => {
        setDialogOK({
            message,
            isLoading,
        });
    };

    const handleDelete = (id,event) =>{
        const index = eventList.findIndex((p)=>p._id === id)
        handleDialog(
            `Bạn có chắc chắn muốn xóa sự kiện ${event.name} này không?`,
            true,
            `Xóa sự kiện: ${event.name}` + eventList[index].name,
        );
        idEventRef.current=id;
    }

    const handleButtonOK = (choose) => {
        if (choose) {
            handleDialogOK('', false);
        }
    };

    const handleName = (e)=>{
        setName(e.target.value)
    }

    const handleDescription = (e)=>{
        setDescription(e.target.value)
    }

    const handleImageurl = (e)=>{
        setImageurl(e.target.value)
    }

    const handleDatebegin = (e)=>{
        setDatebegin(e.target.value)
    }

    const handleDateend = (e)=>{
        setDateend(e.target.value)
    }

    const handleCreate = (e)=>{
        eventRequest().post(hostServer +`/api/admin/event/createEvent`,{
            "name":name,
            "description":description,
            "imageurl":imageurl,
            "datebegin":datebegin,
            "dateend":dateend,
            "status":status || 'Mở đăng ký'
        })
        .then((res)=>{
                    toast.success("Tạo sự kiện thành công", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
        })
        .catch((err)=>{
            toast.error("Đã xảy ra lỗi, tạo sự kiện thất bại", {
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
    }

    const handleUpdateFetch = (id,event)=>{
        const index = eventList.find((p)=>p._id === id)
        console.log(index)
        setName(index.name)
        setDescription(index.description)
        setImageurl(index.imageurl)
        setDatebegin(index.datebegin)
        setDateend(index.dateend)
        setStatus(index.status)
        setMiddleId(id)
    }

    const handleUpdate = () =>{
        eventRequest().put(hostServer +`/api/admin/event/updateEvent/${middleId}`,{
            "name":name,
            "description":description,
            "imageurl":imageurl,
            "datebegin":datebegin,
            "dateend":dateend,
            "status":status || 'Mở đăng ký'
        })
        .then((res)=>{
            toast.success("Cập nhật sự kiện thành công", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        })
        .catch((err)=>{
            toast.error("Đã xảy ra lỗi, cập nhật sự kiện thất bại", {
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
        window.location.reload();
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            setEventList(eventList.filter((p) => p._id !== idEventRef.current));
            eventRequest()
                .delete(hostServer + `/api/admin/event/deleteEvent/${idEventRef.current}`)
                .then((res) => {
                    setEventList(res.data.event);
                    toast.success("Xóa sự kiện thành công", {
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
                    toast.error("Đã xảy ra lỗi, xóa sự kiện thất bại", {
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
                setSelectedEvents(eventList);
            } else {
                setSelectedEvents([...selectedEvents, data]);
            }
        } else {
            if (name === 'allSelect') {
                setSelectedEvents([]);
            } else {
                let tempSeletedEvents = selectedEvents.filter((u) => u._id !== data._id);
                setSelectedEvents(tempSeletedEvents);
            }
        }
    };

    const handleDeleteManyEvents = (choose) => {
        console.log(selectedEvents)
        console.log(selectedEvents.length)
        console.log(selectedEvents[0]._id)
        let i = 0;
        while (i<selectedEvents.length){
            const tempId = selectedEvents[i]._id;
            eventRequest()
            .delete(hostServer + `/api/admin/event/deleteEvent/${tempId}`)
            i++
        }
        window.location.reload();
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(5);
    const firstPageIndex = (currentPage - 1) * eventsPerPage;
    const lastPageIndex = firstPageIndex + eventsPerPage;
    const dataEachPage = eventList.slice(firstPageIndex, lastPageIndex);

    const handleChangeEventsPerPage = () => {
        var queryEventsPerPage = parseInt(document.getElementById('getNumEventsPerPage').value);
        var renderEventsPerPage =
            queryEventsPerPage <= 0 ? 1 : queryEventsPerPage > eventList.length ? eventList.length : queryEventsPerPage;
            setEventsPerPage(renderEventsPerPage);
        document.getElementById('gotoPageEventNum').value = 1;
        setCurrentPage(1);
    };

    const handleGoToEventsPageNum = (e) => {
        var queryPageToGo = parseInt(document.getElementById('gotoPageEventNum').value);
        var pageToGo =
            queryPageToGo <= 0
                ? 1
                : queryPageToGo > ceil(eventList.length / eventsPerPage)
                ? ceil(eventList.length / eventsPerPage)
                : queryPageToGo;
        document.getElementById('gotoPageEventNum').value = pageToGo;
        setCurrentPage(pageToGo);
    };

    if (eventList.length === 0) return <p>Không có sự kiện nào</p>;
    return (
            <div className="body d-flex flex-column">
            <div className="">
                <div className="title rounded-3">
                    <h1 className="font_big">
                        <FontAwesomeIcon icon={faCalendarCheck} className="icon_big"/> Quản lý sự kiện
                    </h1>
                    <h2 className="font_medium">
                        <FontAwesomeIcon icon={faCalendar} className="icon_big"/> Tất cả: {eventList.length} sự kiện
                    </h2>
                </div>
                <button className="delete_selected d-flex rounded-3" onClick={() => handleDeleteManyEvents()}>
                    <FontAwesomeIcon icon={faTrashAlt} className="icon_trash"/> <p>Xóa sự kiện đã chọn</p>
                </button>
                <table className="table-bordered border-primary table_config table-striped">
                    <thead>
                        <tr className='azure-bg'>
                            <th scope="col" style={{ padding : '10px' }}>
                                <input
                                    type="checkbox"
                                    className=""
                                    name="allSelect"
                                    checked={selectedEvents?.length === eventList.length}
                                    onChange={(e) => handleCheckbox(e, eventList)}
                                ></input>
                            </th>
                            <th scope="col">#</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Ảnh minh họa</th>
                            <th scope="col">Ngày bắt đầu</th>
                            <th scope="col">Ngày kết thúc</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataEachPage.map((event) => (
                            <tr key={event._id}>
                                <td style={{ width: '3%' }}>
                                    <input
                                        type="checkbox"
                                        className=""
                                        name={event._id}
                                        checked={selectedEvents.some((u) => u._id === event._id)}
                                        onChange={(e) => handleCheckbox(e, event)}
                                    ></input>
                                </td>
                                <th scope="row" style={{ width: '4%' }}>
                                    {index++}
                                </th>
                                <td style={{ width: '5%' }}>
                                    {event.name.substring(0, 50)}
                                </td>
                                <td style={{ width: '5%',padding : '10px' }}>{event.description.substring(0, 50)}</td>
                                <td style={{ width: '10%' }}>{event.imageurl.substring(0, 50)}</td>
                                <td style={{ width: '8%' }}>{event.datebegin.substring(0, 50)}</td>
                                <td style={{ width: '8%' }}>{event.dateend.substring(0, 50)}</td>
                                <td style={{ width: '8%' }}>{event.status.substring(0, 50)}</td>
                                <td style={{ width: '12%' }}>
                                    <button className="btn btn-info" onClick={() => handleUpdateFetch(event._id,event)}>
                                        Sửa <FontAwesomeIcon icon={faFileEdit} />
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(event._id, event)}
                                    >
                                        {' '}
                                        Xóa <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {dialog.isLoading && (
                            <Dialog
                                //Update
                                nameEvent={dialog.nameEvent}
                                onDialog={areUSureDelete}
                                message={dialog.message}
                            />
                        )}
                        {dialogs.isLoading && (
                            <Dialog
                                //Update
                                nameEvent={dialogs.nameEvent}
                                onDialog={handleDeleteManyEvents}
                                message={dialogs.message}
                            />
                        )}
                        {dialogOK.isLoading && <DialogOK onDialog={handleButtonOK} message={dialogOK.message} />}
                    </tbody>
                </table>
            </div>
            <PaginationAdmin
                className="pagination"
                currentPage={currentPage}
                totalCount={eventList.length}
                itemsPerPage={eventsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
            <div className="page_tool">
                <label htmlFor="getNumEventsPerPage">Số lượng sự kiện/trang : </label>
                <input
                    className='page_input'
                    type={'number'}
                    id="getNumEventsPerPage"
                    min={1}
                    max={eventList.length}
                    defaultValue={eventsPerPage}
                ></input>
                <button className="btn btn-primary mb-2" onClick={() => handleChangeEventsPerPage()}>
                    OK
                </button>
                <br></br>
                <label htmlFor="gotoPageEventNum">Đi nhanh đến trang : </label>
                <input
                    className='page_input'
                    type={'number'}
                    id="gotoPageEventNum"
                    min={1}
                    max={ceil(eventList.length / eventsPerPage)}
                    defaultValue={1}
                ></input>
                <button className="btn btn-primary" onClick={(e) => handleGoToEventsPageNum(e)}>
                    OK
                </button>
            </div>
        <div className='form'>  
        <Form className='form_border'>
            <p className='form_title'>Form thêm hoặc cập nhật sự kiện</p>
            <Form.Group className="mb-3 form_input" controlId="formName">
                <Form.Control type="text" value={name} placeholder="Điền tên sự kiện" onChange={handleName}/>
            </Form.Group>

            <Form.Group className="mb-3 form_input" controlId="formDescription">
                <Form.Control type="text" value={description} placeholder="Điền mô tả sự kiện" onChange={handleDescription} />
            </Form.Group>
            
            <Form.Group className="form_input" controlId="formImageurl">
                <Form.Control type="text" value={imageurl} placeholder="Điền link ảnh sự kiện" onChange={handleImageurl} />
                
            </Form.Group>
            <Form.Text className="alert_text">
                Vui lòng điền link firebase của ảnh
            </Form.Text>                 
            <Form.Group className="mb-3 form_input" controlId="formDatebegin">
                <Form.Control value={datebegin} type="text" placeholder="Điền ngày bắt đầu sự kiện" onChange={handleDatebegin} />
            </Form.Group>

            <Form.Group className="mb-3 form_input" controlId="formDateend">
                <Form.Control value={dateend} type="text" placeholder="Điền ngày kết thúc sự kiện"  onChange={handleDateend}/>
            </Form.Group>

            
            <Form.Select className="mb-3 form_input" aria-label="Default select example" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Kết thúc">Kết thúc</option>
                <option value="Mở đăng ký">Mở đăng ký</option>
            </Form.Select>

            <Button className='add_button' variant="primary" type="submit" onClick={handleCreate}>
                Thêm <FontAwesomeIcon icon={faPlusCircle}/>
            </Button>

            <Button className='add_button' variant="dark" type="submit" onClick={handleUpdate}>
                Cập nhật <FontAwesomeIcon icon={faWrench}/>
            </Button>

            <Button variant="info" type="reset">
                Reset form <FontAwesomeIcon icon={faXmarkCircle}/>
            </Button>
        </Form>
        </div> 
        </div>
    );
}

export default AdminEvent;