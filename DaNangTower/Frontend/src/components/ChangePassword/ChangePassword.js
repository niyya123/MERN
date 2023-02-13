import { faKey } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { userRequest } from '../../utils/request';
import TextInputField from '../TextInputField';
import styles from './ChangePassword.module.scss';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function ChangePassword(){
    const user = useSelector((state) => state.user.current);
    const [show, setShow] = useState(false);
    const [pass, setPass] = useState({});
    const [error, setError] = useState('');
    const [done, setDone] = useState('');
    const [validPassword, setValidNewPassword] = useState(false);
    const [validCurrentPassword, setValidCurrentPassword] = useState(false);
    const [validVerifyPassword, setValidVerifyPassword] = useState(false);  
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onPwdInput = (name, value) => {
        setError('');
        setPass({ ...pass, [name]: `${value}` });
    };

    const submit = (e) =>{
        e.preventDefault();
        console.log(validCurrentPassword, validPassword, validVerifyPassword)
        if (!(validCurrentPassword && validPassword && validVerifyPassword)){
            if (pass.newPassword !== pass.verifyPassword) setError('Mật khẩu mới không khớp') //
            else if (!validCurrentPassword) setError('Mật khẩu hiện tại không hợp lệ, mời kiểm tra lại!')
            else if (!validPassword) setError('Mật khẩu mới không hợp lệ, mời kiểm tra lại!')
            else if (!validVerifyPassword) setError('Mật khẩu xác nhận không hợp lệ, mời kiểm tra lại!')
        }
        else {     
            userRequest()
            .post(`user/profile/${user._id}/changePass`, {...pass, ...user})
            .then(res => {
                if (res.status === 200){
                    setDone("Thành công!");
                    setError("");
                    setTimeout(()=>{
                        handleClose();
                        setDone('');
                    }, 500)
                    
                }
                else if (res.status === 202) {
                    setDone('');
                    setError(res.data.message);

                }
            })
            .catch((err) => {
                setDone('');
                setError(err.message);
            })
        }
    }

    return (
        <div className={cx('changepwdbtn')}>
            <Button className={cx('openModal')} variant="success" onClick={handleShow}>
                Đổi mật khẩu
            </Button>
            <Modal show={show} className={cx('formChangePass')}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className={cx('text-danger')} style={{'marginBottom': '10px'}}>{error}</div>}
                    {done && <div className={cx('text-success')} style={{'marginBottom': '10px'}}>{done}</div>}
                    <TextInputField
                        icon={faKey}
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        name="currentPassword"
                        getInput={onPwdInput}
                        setValid={(value) => setValidCurrentPassword(value)}
                    ></TextInputField>

                    <TextInputField
                        icon={faKey}
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        name="newPassword"
                        getInput={onPwdInput}
                        setValid={(value) => setValidNewPassword(value)}
                    ></TextInputField>

                    <TextInputField
                        icon={faKey}
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        name="verifyPassword"
                        getInput={onPwdInput}
                        setValid={(value) => setValidVerifyPassword(value)}
                    ></TextInputField>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>Đóng</Button>
                    <Button variant="primary" onClick={(e)=> {submit(e); handleShow();}}>Thay đổi</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ChangePassword;
