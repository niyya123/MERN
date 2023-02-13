import styles from './home.module.scss'
import classNames from 'classnames/bind';
import { TitleTab } from '../../utils/GenerateTitle';

const cx = classNames.bind(styles);
function Home() {
    TitleTab('Trang chủ');
    return (
        <div>

            <div id="carouselExampleCaptions" className={cx('carousel', 'slide', 'my-carousel')} data-bs-interval="2000">
                <div className={cx('carousel-indicators')}>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className={cx('active')} aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                </div>
                <div className={cx('carousel-inner')}>
                    <div className={cx('carousel-item', 'active')}>
                        <img src={require('../../assets/images/slide_04.jpg')} className={cx('d-block', 'w-100', 'my-img')} alt="..." />
                        <div className={cx('carousel-caption', 'd-none', 'd-md-block', 'my-carousel-caption')}>
                            <h4>Tòa nhà hành chính vào lúc bình minh</h4><br />
                        </div>

                    </div>
                    <div className={cx('carousel-item')}>
                        <img src={require('../../assets/images/slide_02.jpg')} className={cx('d-block', 'w-100', 'my-img')} alt="..." />
                        <div className={cx('carousel-caption', 'd-none', 'd-md-block', 'my-carousel-caption')}>
                            <h4>Tòa nhà hành chính vào buổi trưa</h4><br />
                        </div>
                    </div>
                    <div className={cx('carousel-item')}>
                        <img src={require('../../assets/images/slide_03.jpg')} className={cx('d-block', 'w-100', 'my-img')} alt="..." />
                        <div className={cx('carousel-caption', 'd-none', 'd-md-block', 'my-carousel-caption')}>
                            <h4>Tòa nhà hành chính vào lúc hoàng hôn</h4><br />
                        </div>
                    </div>
                    <div className={cx('carousel-item')}>
                        <img src={require('../../assets/images/slide_01.jpg')} className={cx('d-block', 'w-100', '.my-img')} alt="..." />
                        <div className={cx('carousel-caption', 'd-none', 'd-md-block', 'my-carousel-caption')}>
                            <h4>Tòa nhà hành chính về đêm</h4><br />
                        </div>
                    </div>

                </div>
                <button className={cx('carousel-control-prev', 'my-prev')} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className={cx('carousel-control-prev-icon', 'my-prev-icon')} aria-hidden="true"></span>
                    <span className={cx('visually-hidden')}>Previous</span>
                </button>
                <button className={cx('carousel-control-next', 'my-next')} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className={cx('carousel-control-next-icon', 'my-next-icon')} aria-hidden="true"></span>
                    <span className={cx('visually-hidden')}>Next</span>
                </button>
            </div>
            <br />
            <div className={cx('container', 'mb-5')}>
                <div className={cx('row')}>
                    <div className={cx('col-7')}>
                        <h4>Giới thiệu về tòa nhà hành chính:</h4>
                        <ul className={cx('list-group', 'list-group-flush')}>
                            <li className={cx('list-group-item')}><b>Vị trí:</b> Tọa lạc tại số 24 Trần Phú, phường Thạch Thang, quận Hải Châu, thành phố Đà Nẵng</li>
                            <li className={cx('list-group-item')}><b>Thời gian:</b> Khởi công từ tháng 11/2008 và chính thức khánh thành vào ngày 8/9/2014</li>
                            <li className={cx('list-group-item')}><b>Vốn đầu tư:</b> 2.321 tỷ VND</li>
                            <li className={cx('list-group-item')}><b>Chủ đầu tư:</b> UBND Thành phố Đà Nẵng</li>
                            <li className={cx('list-group-item')}><b>Tên gọi khác:</b> "Tòa tháp bắp"</li>
                            <li className={cx('list-group-item')}><b>Diện tích:</b> 65.234 m2 và độ cao là 166.9m</li>
                            <li className={cx('list-group-item')}><b>Số tầng:</b> 34 tầng nổi và 2 tầng hầm</li>
                            <li className={cx('list-group-item')}><b>Thành tích:</b> Tòa nhà cao nhất miền Trung</li>
                            <li className={cx('list-group-item')}><b>Chức năng:</b> Tòa nhà này là nơi làm việc của 24 sở ban ngành của thành phố Đà Nẵng, được cho là công trình có ý nghĩa đặc biệt quan trọng. Đến năm 2016, chi phí vận hành của tòa nhà này là khoảng 1 tỷ đồng mỗi tháng.</li>
                        </ul>
                    </div>
                    <div className={cx('col-5')}>
                        <img className={cx('imageHome')} src={require('../../assets/images/image_trangchu_01.jpg')} width="100%" alt="" />
                    </div>
                </div>
            </div>
            <div className={cx('container', 'mb-5')}>
                <div className={cx('row')}>
                    <div className={cx('col-5')}>
                        <img className={cx('imageHome')} src={require('../../assets/images/image_trangchu_02.jpg')} width="100%" alt="" />
                    </div>
                    <div className={cx('col-7')}>
                        <h4>Chúng tôi cung cấp những tiện ích gì cho bạn:</h4>

                        <ul className={cx('my-list', 'list-group-flush')}>
                            <li className={cx('my-list-group-item')}><b>Xem lát cắt tòa nhà</b></li>
                            <li className={cx('my-list-group-item')}><b>Xem sơ đồ tòa nhà</b></li>
                            <li className={cx('my-list-group-item')}><b>Xem bản đồ 3D</b></li>
                            <li className={cx('my-list-group-item')}><b>Xem danh sách sự kiện</b></li>
                            <li className={cx('my-list-group-item')}><b>Đặt vé tham quan tòa nhà</b></li>
                            <li className={cx('my-list-group-item')}><b>....</b></li>

                        </ul>
                    </div>
                </div>
            </div>
            <div className={cx('d-flex', 'justify-content-center', 'container', 'mb-3')}>
                <iframe title="toanhahanhchinh" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.7774563290445!2d108.22035646465152!3d16.077034088876058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142183a5894c2cf%3A0x8578be2e5e010d0e!2zVHJ1bmcgdMOibSBIw6BuaCBjaMOtbmggxJDDoCBO4bq1bmcsIDI0IMSQLiBUcuG6p24gUGjDuiwgVGjhuqFjaCBUaGFuZywgSOG6o2kgQ2jDonUsIMSQw6AgTuG6tW5nIDU1MDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1667793843181!5m2!1svi!2s" width="100%" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div >
    );
}

export default Home;