import { NavLink, useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import { publicRequest } from '../../utils/request';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {faCode, faKey, faMailBulk, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './signup.module.scss';
import classNames from 'classnames/bind';
import ReCAPTCHA from 'react-google-recaptcha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TitleTab } from '../../utils/GenerateTitle';
const cx = classNames.bind(styles);

function SignUp() {
    TitleTab('Đăng ký')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const captchaRef = useRef({});
    const [form, setForm] = useState({});
    const [code, setCode] = useState({});
    const [validEmail, setValidEmail] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validPhone, setValidPhone] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [validCode, setValidCode] = useState(false);
    const [validChaptcha, setValidChaptcha] = useState(false);
    const [error, setError] = useState('');
    const [sendCode, setSendCode] = useState(false);

    const onEmailInput = (type, value) => {
        setError('');
        setForm({ ...form, [type]: `${value}` });
    };

    const onCodeInput = (name, value) => {
        setError('');
        setCode({ ...code, [name]: `${value}` });
    };

    const onChangeReCaptcha = (e) => {
        const tokenCaptcha = captchaRef.current.getValue();
        if (tokenCaptcha) setValidChaptcha(true);
        else setValidChaptcha(false);
        setForm({ ...form, tokenCaptcha: tokenCaptcha });
    };

    const onSignup = (e) => {
        e.preventDefault();
        if (error) return;
        if (!(validEmail && validName && validPassword && validPhone && validChaptcha )) {
            if (!validEmail) setError('Invalid email information, please check again!');
            else if (form.password !== form.verifyPassword) setError("Password mismatch!");
            else if (!validPassword || !validConfirmPassword) setError('Invalid password information, please check again!');
            else if (!validName) setError('Invalid name information, please check again!');
            else if (!validPhone) setError('Invalid phone information, please check again!');
            else if (!validChaptcha) setError('Check your recaptcha!');
        } else {
            publicRequest
                .post("account/signup", form)
                .then((res) => {
                if (res.status === 202) {
                    setError(res.data.message);
                } else setSendCode(true);
                })
                .catch((err) => {
                    setError("System catched error, try again!");
                });
        }
    };

    const handleSendCode = (e) => {
        e.preventDefault();
        if (!validCode) {
          setError("Enter the valid code");
        } else {
            publicRequest
                .post("account/signup/verifyCode", { ...form, ...code })
                .then((res) => {
                if (res.status === 202) {
                    setError(res.data.message);
                } else {
                    setError(res.data.message)
                    navigate("/signin");
                }
                })
                .catch((err) => {
                    setError("System catched error, try again!");
                });
        }
    };

    return (
        <>
            <div className={cx('container_signin')}>
                <div className={cx('signin')}>
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className={cx('form_wrapper')}>
                            <form className={cx(sendCode ? "hide" : "")}>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Sign Up To NT3 System</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faMailBulk}
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidEmail(value)}
                                ></TextInputField>
                                <TextInputField
                                    icon={faUser}
                                    type="text"
                                    placeholder="Enter your name"
                                    name="name"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidName(value)}
                                ></TextInputField>
                                 <TextInputField
                                    icon={faPhone}
                                    type="phone"
                                    placeholder="Enter your phone number"
                                    name="phone"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidPhone(value)}
                                ></TextInputField>
                                <TextInputField
                                    icon={faKey}
                                    type="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidPassword(value)}
                                ></TextInputField>
                                <TextInputField
                                    icon={faKey}
                                    type="password"
                                    placeholder="Enter your confirm password"
                                    name="verifyPassword"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidConfirmPassword(value)}
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
                                    onClick={(e) => onSignup(e)}
                                    value="Sign Up"
                                ></input>
                                <div>
                                    <label>Or</label>
                                </div>
                                <div className={cx('login_footer')}>
                                    <NavLink to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <span>Already have an account? Sign in now! </span>
                                    </NavLink>
                                </div>
                            </form>

                            <form className={cx(sendCode ? "" : "hide")}>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Verify Code To NT3 System</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faCode}
                                    type="text"
                                    placeholder="Enter the verify code"
                                    name="code"
                                    getInput={onCodeInput}
                                    setValid={(value) => setValidCode(value)}
                                ></TextInputField>

                                <input
                                    type="submit"
                                    onClick={(e) => handleSendCode(e)}
                                    value="Verify"
                                ></input>
                                <div>
                                    <label>Or</label>
                                </div>
                                <div className={cx('login_footer')}>
                                    <NavLink to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <span>Already have an account? Sign in now! </span>
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

export default SignUp;
