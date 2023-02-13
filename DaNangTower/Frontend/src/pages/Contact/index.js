import styles from './contact.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot,
    faEnvelope,
    faPhone,

} from '@fortawesome/free-solid-svg-icons';
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { TitleTab } from '../../utils/GenerateTitle';

const cx = classNames.bind(styles);


function Contact() {
    TitleTab('Liên hệ');
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_2njhwgp', 'template_uhw90wp', form.current, 'dCw5SZmUM1Te6hs1X')
            .then((result) => {
                alert("Đã gửi phản hồi thành công");
                document.getElementById("HoTen").value = "";
                document.getElementById("email").value = "";
                document.getElementById("content").value = "";
            }, (error) => {
            });
    };


    return (<h2>
        <div className={cx('contact')}>
            <div className={cx('my-container', 'container')} >
                <div className={cx('contactInfo')}>
                    <div className={cx('box')}>
                        <div className={cx('icon')}><FontAwesomeIcon icon={faLocationDot} /></div>
                        <div className={cx('text')}>
                            <h3>Địa chỉ</h3>
                            <p>Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức <br />Thành phố Hồ Chí Minh</p>
                        </div>
                    </div>
                    <div className={cx('box')}>
                        <div className={cx('icon')}><FontAwesomeIcon icon={faEnvelope} /></div>
                        <div className={cx('text')}>
                            <h3>Email</h3>
                            <p> nhom3_GIS@gmail.com</p>
                        </div>
                    </div>
                    <div className={cx('box')}>
                        <div className={cx('icon')}><FontAwesomeIcon icon={faPhone} /></div>
                        <div className={cx('text')}>
                            <h3>Số điện thoại</h3>
                            <p>0123 456 789</p>
                        </div>
                    </div>
                </div>
                <div className={cx('contactForm')}>
                    <form ref={form} onSubmit={sendEmail}>
                        <h2>Gửi Phản hồi</h2>
                        <div className={cx('inputBox')}>
                            <input type="text" id='HoTen' name="user_name" required="required" />
                            <span>Họ tên</span>
                        </div>
                        <div className={cx('inputBox')}>
                            <input type="text" id='email' name="user_email" required="required" />
                            <span>Email</span>
                        </div>
                        <div className={cx('inputBox')}>
                            <input type="text" id='content' name="message" required="required" />
                            <span>Nội dung phản hồi</span>
                        </div>
                        <div className={cx('inputBox')}>
                            <input type="submit" value="Gửi" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </h2 >);
}

export default Contact;