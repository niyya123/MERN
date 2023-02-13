import { NavLink, useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import { publicRequest, userRequest } from '../../utils/request';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signinStart, signinSuccess, signinFail } from '../../redux/userRedux';
import { faKey, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import styles from './signin.module.scss';
import classNames from 'classnames/bind';
import ReCAPTCHA from 'react-google-recaptcha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { TitleTab } from '../../utils/GenerateTitle';
const cx = classNames.bind(styles);

function SignIn() {
    TitleTab('Đăng nhập');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const captchaRef = useRef({});
    const [form, setForm] = useState({});
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validChaptcha, setValidChaptcha] = useState(false);
    const [error, setError] = useState('');
    const { isFetching } = useSelector((state) => state.user);

    console.log(isFetching);
    const handleInput = (type, value) => {
        setError('');
        setForm({ ...form, [type]: `${value}` });
    };

    const onChangeReCaptcha = (e) => {
        const tokenCaptcha = captchaRef.current.getValue();
        if (tokenCaptcha) setValidChaptcha(true);
        else setValidChaptcha(false);
        setForm({ ...form, tokenCaptcha: tokenCaptcha });
    };

    const onSignin = (e) => {
        e.preventDefault();
        if (error) return;
        if (!(validEmail && validPassword && validChaptcha)) {
            if (!validEmail) setError('Invalid email information, please check again!');
            else if (!validPassword) setError('Invalid password information, please check again!');
            else if (!validChaptcha) setError('Check your recaptcha!');
        } else {
            console.log(form);
            dispatch(signinStart());
            publicRequest
                .post('account/signin', form)
                .then((res) => {
                    if (res.status === 202) {
                        captchaRef.current.reset();
                        setError(res.data.message);
                        dispatch(signinFail(res.data));
                    } else if (res.status === 200) {
                        dispatch(signinSuccess(res.data));
                        setTimeout(() => {
                            userRequest()
                                .get('/')
                                .then(() => {});
                            navigate('/');
                        }, 200);
                    }
                })
                .catch((res) => {
                    captchaRef.current.reset();
                    setError(res.data);
                    dispatch(signinFail(res.data));
                });
        }
    };

    const googleLogin = () => {
        window.open(process.env.REACT_APP_SERVER_PATH + '/api/auth/google', '_self');
    };

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_SERVER_PATH + '/api/auth/signin/success', { withCredentials: true })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(signinSuccess(res.data));
                    setTimeout(() => {
                        userRequest()
                            .get('/')
                            .then(() => {});
                        navigate('/');
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <div className={cx('container_signin')}>
                {isFetching && (
                    <div className={cx("loading")}>
                        <CircularProgress />
                    </div>
                )}
                <div className={cx('signin')}>
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className={cx('form_wrapper')}>
                            <form>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Sign In To NT3 System</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faMailBulk}
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    getInput={handleInput}
                                    setValid={(value) => setValidEmail(value)}
                                ></TextInputField>
                                <TextInputField
                                    icon={faKey}
                                    type="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    getInput={handleInput}
                                    setValid={(value) => setValidPassword(value)}
                                ></TextInputField>
                                <ReCAPTCHA
                                    name="tokenCaptcha"
                                    className={cx('recaptcha')}
                                    size="normal"
                                    sitekey={process.env.REACT_APP_SITE_KEY}
                                    ref={captchaRef}
                                    onChange={(e) => onChangeReCaptcha(e)}
                                />
                                <input
                                    className={cx('signinBtn')}
                                    type="submit"
                                    onClick={(e) => onSignin(e)}
                                    value="Sign In"
                                ></input>
                                <div className={cx('forgot_password')}>
                                    <NavLink to="/forgotPassword" className={cx('forgot_password')}>
                                        <span>Forgot password?</span>
                                    </NavLink>
                                </div>
                                <div>
                                    <label>Or</label>
                                </div>
                                <div className={cx('login_icon')} onClick={googleLogin}>
                                    <NavLink className={cx('login_icon')}>
                                        <span>
                                            <FontAwesomeIcon
                                                className={cx('googleLogin')}
                                                icon={faGoogle}
                                            ></FontAwesomeIcon>{' '}
                                        </span>{' '}
                                        <span>Login with Google</span>
                                    </NavLink>
                                </div>
                                <div className={cx('login_footer')}>
                                    <NavLink to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <span>No account? Sign up for new joiner! </span>
                                    </NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignIn;
