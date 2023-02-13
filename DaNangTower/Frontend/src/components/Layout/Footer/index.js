import './footer.scss';

function Footer() {
    return (
        <div>
            <footer className="bg-dark text-white pt-5 pb-4">
                <div className="container text-md-left">
                    <div className="row text-md-left">
                        <div className="col-md-3 col-lg-3 col-xl-3 mx-auto ">
                            <h5 className="text-uppercase mb-4 font-weight-bold text-warning text-left">
                                Tính năng nổi bật
                            </h5>
                            <p>
                                <a href="/#" className="text-white text-left">
                                    Xem sơ đồ tòa nhà
                                </a>
                            </p>
                            <p>
                                <a href="/#" className="text-white text-left">
                                    Xem sự kiện tòa nhà
                                </a>
                            </p>
                            <p>
                                <a href="/#" className="text-white text-left">
                                    Tham quan tòa nhà
                                </a>
                            </p>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3 mx-auto ">
                            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">GIS App</h5>
                            <p>
                                Sai số thấp
                                <br />
                                Trải nghiệm tuyệt vời
                                <br />
                                Tính năng hữu dụng
                            </p>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto ">
                            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Liên hệ với chúng tôi</h5>
                            <p>
                                <i className="fas fa-home mr-3"></i> Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức,
                                Thành phố Hồ Chí Minh
                            </p>
                            <p>
                                <i className="fas fa-envelope mr-3"></i> nhom3_GIS@gmail.com
                            </p>

                            <p>
                                <i className="fas fa-print mr-3"></i> 012 345 6789
                            </p>
                        </div>

                        <hr className="mb-4" />

                        <div className="row align-items-center">
                            <div className="col-md-7 col-lg-8">
                                <p>© 2015 - Bản quyền thuộc về Công ty TNHH NT3 System</p>
                            </div>

                            <div className="col-md-5 col-lg-4">
                                <div className="text-center text-md-right">
                                    <ul className="list-unstyled list-inline">
                                        <li className="list-inline-item">
                                            <a href="/#" className="btn-floating btn-sm text-white">
                                                <i className="fab fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="/#" className="btn-floating btn-sm text-white">
                                                <i className="fab fa-google-plus"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="/#" className="btn-floating btn-sm text-white">
                                                <i className="fab fa-linkedin-in"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="/#" className="btn-floating btn-sm text-white">
                                                <i className="fab fa-youtube"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="/#" className="btn-floating btn-sm text-white">
                                                <i className="fab fa-github"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
