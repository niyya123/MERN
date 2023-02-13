import React,{ useEffect, useState} from 'react';
import { eventRequest } from '../../utils/request';
import {} from '@fortawesome/react-fontawesome';
import PaginationAdmin from '../../components/PaginationAdmin/Pagination';
import {} from '@fortawesome/free-solid-svg-icons';
import {Card,ListGroup} from 'react-bootstrap'
import '../Event/event.css';
import { TitleTab } from '../../utils/GenerateTitle';

function Event() {
    TitleTab('Sự kiện');
    const [eventList, setEventList] = useState([]);

    useEffect(()=> {
        eventRequest()
            .get('/admin/event')
            .then((res)=>{
                setEventList(res.data);
            });
    },[]);

    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(4);
    const firstPageIndex = (currentPage - 1) * eventsPerPage;
    const lastPageIndex = firstPageIndex + eventsPerPage;
    const dataEachPage = eventList.slice(firstPageIndex, lastPageIndex);

    if (eventList.length === 0) return <p>Không có sự kiện nào</p>;

    return (
        <>
        <div className='body1'>
            {dataEachPage.map((event) => (
                <div key={event._id} className="event_layout1">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={event.imageurl} />
                        <Card.Body>
                            <Card.Title>{event.name}</Card.Title>
                            <Card.Text>
                                {event.description}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Ngày bắt đầu : {event.datebegin}</ListGroup.Item>
                            <ListGroup.Item>Ngày kết thúc : {event.dateend}</ListGroup.Item>
                            <ListGroup.Item>Tình trạng : {event.status}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>
            ))}
        </div>
        <PaginationAdmin
            className="pagination"
            currentPage={currentPage}
            totalCount={eventList.length}
            itemsPerPage={eventsPerPage}
            onPageChange={(page) => setCurrentPage(page)}/>
        </>
    )
}

export default Event