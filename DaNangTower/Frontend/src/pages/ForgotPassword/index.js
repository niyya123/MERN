import { Link, useNavigate } from 'react-router-dom';
import TextInputField from '../../components/TextInputField';
import { publicRequest } from '../../utils/request';
import { useState } from 'react';
import { faCode, faKey, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import styles from './forgot-password.scss';
import classNames from 'classnames/bind';
import { TitleTab } from '../../utils/GenerateTitle';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(styles);

function ForgotPassword() {
    TitleTab('Quên mật khẩu');
    const navigate = useNavigate();
    const [formEmail, setFormEmail] = useState({});
    const [formCode, setFormCode] = useState({});
    const [formPassword, setFormPassword] = useState({});
    const [openCodeForm, setOpenSendCode] = useState(false);
    const [openEmailForm, setOpenEmailForm] = useState(true);
    const [openSetPassword, setOpenSetPassword] = useState(false);
    const [error, setError] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [validCode, setValidCode] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validVerifyPassword, setValidVerifyPassword] = useState(false);

    const onEmailInput = (type, value) => {
        setError('');
        setFormEmail({ ...formEmail, [type]: `${value}` });
    };

    const onCodeInput = (name, value) => {
        setError('');
        setFormCode({ ...formCode, [name]: `${value}` });
    };
    
    const onPwdInput = (name, value) => {
        setError('');
        setFormPassword({ ...formPassword, [name]: `${value}` });
    };

    const onSubmitEmail = (e) => {
        e.preventDefault();
        if (validEmail) {
          publicRequest
            .post("account/forgotPassword", formEmail)
            .then((res) => {
              if (res.status === 202) {
                setError(res.data.message);
              } else {
                setOpenEmailForm(false);
                setOpenSendCode(true);
                setError(res.data.message);
                setOpenSetPassword(false);
              }
            })
            .catch(() => {
              setError("System error, try again later!,");
            });
        }
      };
      const onSubmitCode = (e) => {
        e.preventDefault();
        if (validCode) {
          publicRequest
            .post("account/forgotPassword/verifyCode", { ...formEmail, ...formCode })
            .then((res) => {
              if (res.status === 202) {
                setError(res.message);
              } else {
                setOpenSendCode(false);
                setOpenSetPassword(true);
              }
            })
            .catch(() => {
              setError("System error, try again later!");
            });
        }
      };
      const onSubmitPwd = (e) => {
        e.preventDefault();
        if (!(validPassword && validVerifyPassword)) {
          setError("Please enter all information!");
        } else if (formPassword.password !== formPassword.verifyPassword) {
          setError("Passwords did not match!");
        } else {
          publicRequest
            .post("account/forgotPassword/changePassword", {...formPassword, ...formEmail})
            .then((res) => {
              if (res.status === 202) {
                setError(res.message);
              } else if (res.status === 200) {
                navigate("/signin");
              }
            })
            .catch((err) => {
              setError("System error, try again later");
            });
        }
      };

    return (
        <>
            <div className={cx('container_signin')}>
                <div className={cx('signin')}>
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className={cx('form_wrapper')}>
                            <form className={openEmailForm ? '' : 'hide'}>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Forgot Password</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faMailBulk}
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    getInput={onEmailInput}
                                    setValid={(value) => setValidEmail(value)}
                                ></TextInputField>
                                <input
                                    type="submit"
                                    onClick={(e) => {
                                        onSubmitEmail(e);
                                    }}
                                    value="Submit"
                                ></input>
                                <div className={cx('forgot_password')}>
                                <Link to="/signin" className={cx('forgot_password')}>
                                    <span>Already have an account? Sign in here</span>
                                </Link>
                            </div>
                            </form>

                            <form className={openCodeForm ? '' : 'hide'}>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Verify Code</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faCode}
                                    type="text"
                                    placeholder="Enter verified code"
                                    name="code"
                                    getInput={onCodeInput}
                                    setValid={(value) => setValidCode(value)}
                                ></TextInputField>

                                <input type="submit" onClick={(e) => onSubmitCode(e)} value="Verify"></input>
                                <div className={cx('forgot_password')}>
                                <Link to="/signin" className={cx('forgot_password')}>
                                    <span>Already have an account? Sign in here</span>
                                </Link>
                            </div>
                            </form>

                            <form className={openSetPassword ? '' : 'hide'}>
                                <div className={cx('water_mark')}>Da Nang Official Central</div>
                                <div className={cx('form_title')}>Change Password</div>
                                <p className={cx('form_error')}>{error}</p>
                                <TextInputField
                                    icon={faKey}
                                    type="password"
                                    placeholder="Enter new password"
                                    name="password"
                                    getInput={onPwdInput}
                                    setValid={(value) => setValidPassword(value)}
                                ></TextInputField>

                                <TextInputField
                                    icon={faKey}
                                    type="password"
                                    placeholder="Confirm password"
                                    name="verifyPassword"
                                    getInput={onPwdInput}
                                    setValid={(value) => setValidVerifyPassword(value)}
                                ></TextInputField>

                                <input type="submit" onClick={(e) => onSubmitPwd(e)} value="Change password"></input>
                                <div className={cx('forgot_password')}>
                                <Link to="/signin" className={cx('forgot_password')}>
                                    <span>Already have an account? Sign in here</span>
                                </Link>
                            </div>
                            </form>
                            
                            {/* <div>
                                    <label>Or</label>
                                </div> */}
                            {/* <div className={cx('login_icon')} onClick={googleLogin}>
                                    <Link to="../loginWithGoogle" className={cx('login_icon')}>
                                        <FontAwesomeIcon icon={'google-plus'}></FontAwesomeIcon>
                                        <span>Login with Google</span>
                                    </Link>
                                </div> */}
                            {/* <div className="login_footer">
                                    <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <p>No account? Sign up for new joiner! </p>
                                    </Link>
                                </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
