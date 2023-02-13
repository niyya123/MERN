import styles from './Ticket.module.scss';
import classNames from 'classnames/bind';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import images from '../../assets/images';
import MailIcon from '@mui/icons-material/Mail';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import Barcode from 'react-barcode';
import { useEffect, useState } from 'react';
import { userRequest } from '../../utils/request';
import { useSelector } from 'react-redux';
import { TitleTab } from '../../utils/GenerateTitle';

const cx = classNames.bind(styles);

function Ticket() {
    TitleTab('Vé sự kiện');
    const [card, setCard] = useState({});
    const user = useSelector((state) => state.user.current);

    const getListEventName = (card) => {
        if (card.list_event) {
            return card.list_event.map((event) => event.name).join(', ');
        }
        return;
    };
    useEffect(() => {
        userRequest()
            .post('/admin/card/findCard', { idUser: user._id })
            .then((res) => {
                setCard(res.data.card);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [user._id]);

    return (
        <div className={cx('wrapper')}>
            {!card._id ? (
                <p>Bạn chưa có vé. Vui lòng liên hệ quản trị viên để tạo vé</p>
            ) : (
                <>
                    <h2 style={{ margin: '32px' }}>Thông tin vé</h2>
                    <div className={cx('card')}>
                        <span className={cx('user-name')}>JAME JOHNSON DEO</span>
                        <span className={cx('user-position')}>PROJECT MANAGER</span>
                        <div className={cx('info')}>
                            <PermIdentityIcon sx={{ color: 'blue' }} />
                            <div className={cx('text')}>No.{card.user?._id}</div>
                        </div>
                        <div className={cx('info')}>
                            <LocalActivityOutlinedIcon sx={{ color: 'blue' }} />
                            <div className={cx('text')}>{getListEventName(card)}</div>
                        </div>
                        <div className={cx('info')}>
                            <LocalPhoneIcon sx={{ color: 'blue' }} />
                            <div className={cx('text')}>{card.user?.phone}</div>
                        </div>
                        <div className={cx('info')}>
                            <MailIcon sx={{ color: 'blue' }} />
                            <div className={cx('text')}>{card.user?.email}</div>
                        </div>
                        <div className={cx('company-wrap')}>
                            <div className={cx('company')}>
                                <img src={images.Town} alt="" />
                                <span className={cx('company-name')}>MANAGE BUILDING</span>
                            </div>
                        </div>
                        <Barcode value={card.user?._id} height="48" marginTop="12" />
                    </div>
                </>
            )}
        </div>
    );
}

export default Ticket;
