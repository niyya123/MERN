import classNames from 'classnames/bind';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputForm from '../../components/InputForm/InputForm';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { publicRequest, userRequest } from '../../utils/request';
import { signinSuccess } from '../../redux/userRedux';
import storage from '../../utils/firebaseConfig';
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import styles from './Profile.module.scss';
import { CircularProgress } from '@mui/material';
import { TitleTab } from '../../utils/GenerateTitle';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
const cx = classNames.bind(styles);

const genders = [
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];
function Profile() {
    TitleTab('Thông tin người dùng');
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState();
    const [image, setImage] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [gender, setGender] = useState();
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [birthday, setBirthday] = useState();
    const [detail, setDetail] = useState('');
    const user = useSelector((state) => state.user.current);
    
    const [preview, setPreview] = useState();
    const [imageAsFile, setImageAsFile] = useState('');
    const [imageAsUrl, setImageAsUrl] = useState('');
    const [percent, setPercent] = useState(0);
    const provinceEle = useRef();
    const districtEle = useRef();
    const wardEle = useRef();
    const detailEle = useRef();
    const disPatch = useDispatch();

    const showError = (e, err) => {
        if (e.target && e.target.parentElement) e.target.parentElement.parentElement.getElementsByClassName('error-message-line')[0].innerText = err;
    };

    const showErrorAddress = (e, err) => {
        e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('error-message-line',)[0].innerText = err;
    };

    const handleErrorPhone = (e) => {
        const regex = /^0\d{9}$/;
        if (phone === '') {
            showError(e, 'This field cannot be left blank!');
        } else if (!regex.test(phone)) {
            showError(e, 'Incorrect phone number format');
        }
    };

    const handleErrorName = (e) => {
        if (name === '') {
            showError(e, 'This field cannot be left blank!');
        }
    };

    const handleErrorEmail = (e) => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        if (email === '') {
            showError(e, 'This field cannot be left blank!');
        } else if (!regex.test(email)) {
            showError(e, 'This field must be email!');
        }
    };

    const handleName = (e) => {
        setName(e.target.value);
        showError(e, '');
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
        showError(e, '');
    };

    const handlePhone = (e) => {
        setPhone(e.target.value);
        showError(e, '');
    };

    const handleGender = (e) => {
        setGender(e.target.value);
    };
    const handleBirthday = (e) => {
        setBirthday(e.target.value);
    };
    const handleProvince = () => {
        publicRequest
            .get(`address/district?province=${provinceEle.current.value}`)
            .then((res) => {
                setDistrict(res.data);
                districtEle.current.value = '';
                wardEle.current.value = '';
                detailEle.current.disabled = true;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleDistrict = () => {
        publicRequest
            .get(`address/district/ward?province=${provinceEle.current.value}&district=${districtEle.current.value}`)
            .then((res) => {
                setWard(res.data);
                detailEle.current.disabled = true;
            })
            .catch((err) => {
                showError(err);
            });
    };
    const handleWard = () => {
        detailEle.current.disabled = false;
    };

    const handleDetail = (e) => {
        setDetail(e.target.value);
        showErrorAddress(e, '');
    };

    const handleErrorDetail = (e) => {
        if (detail === '') {
            showErrorAddress(e, 'This field cannot be left blank!');
        }
    };
    const getFileClick = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImageAsFile(undefined);
            return;
        }
        const fileName = e.target.files[0];
        setImageAsFile(fileName);
    }

    useEffect(() => {
        if (!imageAsFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(imageAsFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageAsFile])

    const handleFireBaseUpload = (e) => {
        e.preventDefault();
        console.log(imageAsFile);
        if (imageAsFile === '' || imageAsFile === null || imageAsFile === undefined || !imageAsFile) {
            showError(`Not an image, the image file is a ${typeof imageAsFile}`);
        }
        const storageRef = ref(storage, `images/${imageAsFile?.name}`)
        const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
        uploadTask.on(
            'state_changed',
            async (snapShot) => {
                console.log(snapShot);
                const percents = await Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
                setPercent(percents);
            },
            (err) => {
                console.log(err);
            },
            async () => {
                const firebaseURL = await getDownloadURL(uploadTask.snapshot.ref);
                if (firebaseURL) {
                    setImageAsUrl(firebaseURL);
                }
            },
        );
    };

    const checkError = () => {
        let check = true;
        const error = document.querySelectorAll('.error-message-line');
        error.forEach((item) => {
            if (item.innerText !== '') check = false;
        });
        return check;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFireBaseUpload(e);
        if (
            (provinceEle.current.value !== '' && districtEle.current.value === '') ||
            (provinceEle.current.value !== '' && wardEle.current.value === '')
        ) {
        } else if (checkError()) {
            userRequest()
                .post(`user/update/${user._id}`, {
                    username: name,
                    phone: phone,
                    gender: gender,
                    birthday: birthday,
                    email: email,
                    image: imageAsUrl,
                    province: provinceEle.current.value,
                    district: districtEle.current.value,
                    ward: wardEle.current.value,
                    addressDetail: detail,
                })
                .then((res) => {
                    setImageAsFile(null)
                    disPatch(signinSuccess({...res.data, token: user.token}));
                    toast.success("Successfully updated", {
                        position: "top-right",
                        theme: 'colored',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                });
        } else {
            toast.error("PLease fulfill the information", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }
    };

    useEffect(() => {
        userRequest()
            .get(`user/profile/` + user._id)
            .then((res) => {
                setProvince(res.data.province);
                setDistrict(res.data.district);
                setWard(res.data.ward);
                setName(res.data.user.name);
                setImage(res.data.user.image);
                setEmail(res.data.user.email);
                setPhone(res.data.user.phone);
                setBirthday(res.data.user.birthday);
                setGender(res.data.user.gender);
                setDetail(user.address.addressdetail);
                setLoading(false);
                if (user.address.province !== '') {
                    if (provinceEle.current && provinceEle.current.value !== '') provinceEle.current.value = user.address.province;
                    if (districtEle.current && districtEle.current.value !== '') districtEle.current.value = user.address.district;
                    if (wardEle.current && wardEle.current.value !== '') wardEle.current.value = user.address.ward;
                } else {
                    detailEle.current.disabled = true;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [user]);

    return !loading ? (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <div className={cx('avatar-wrap')}>
                    <img src={(preview === null || preview === undefined) ? image : preview} alt={imageAsFile? imageAsFile.name : image} className={cx('avatar')} />
                </div>
                <div style={{"marginTop":"5px"}}>
                    <input type="file" accept="image/*" className='btn btn-outline-primary' onClick={(e) => getFileClick(e) } />
                    {percent > 0 && <p>{percent} "% done"</p>}
                </div>
                <h2 className={cx('user_name')}>{name}</h2>
            </div>
            <div className={cx('profile_form')}>
                <h1 className={cx('profile_heading')}>Thông tin cá nhân</h1>
                <div className={cx('input-wrap')}>
                    <div>
                        <div className={cx('reg_line_header')}>
                            <span>Tên</span>
                        </div>
                        <InputForm
                            type="text"
                            placeholder="Name"
                            name="username"
                            small
                            value={name? name : ""}
                            onChange={handleName}
                            onBlur={handleErrorName}
                        />
                    </div>
                    <p className="error-message-line"></p>
                </div>
                <div className={cx('input-wrap')}>
                    <div>
                        <div className={cx('reg_line_header')}>
                            <span>Email</span>
                        </div>
                        <InputForm
                            type="text"
                            placeholder="Email"
                            name="email"
                            small
                            value={email? email : ""}
                            onChange={handleEmail}
                            onBlur={handleErrorEmail}
                        />
                    </div>
                    <p className="error-message-line"></p>
                </div>
                <div className={cx('input-wrap')}>
                    <div>
                        <div className={cx('reg_line_header')}>
                            <span>Số điện thoại</span>
                        </div>
                        <InputForm
                            type="text"
                            placeholder="Số điện thoại"
                            small
                            value={phone ? phone : ""}
                            onChange={handlePhone}
                            onBlur={handleErrorPhone}
                        />
                    </div>
                    <p className="error-message-line"></p>
                </div>

                <div className={cx('reg_col')}>                     
                    <div className={cx('reg_grid')}>
                        <div className={cx('reg_line_header')}>
                            <span>Ngày sinh</span>
                        </div>
                        <input
                            type="date"
                            className={cx('birthday')}
                            name="birthday"
                            defaultValue={birthday? birthday: "2001-01-01"}
                            min="1920-01-01"
                            max="2022-12-26"
                            onChange={handleBirthday}
                        />
                    </div>
                    <p className="error-message-line"></p>
                </div>

                <div className={cx('reg_col')}>
                    <div className={cx('reg_grid')}>
                        <div className={cx('reg_line_header')}>
                            <span>Giới tính</span>
                        </div>
                        {genders?.map((item, index = 0) => (
                            <div className={cx('gender')} key={index++}>
                                <label htmlFor={item.value}>{item.label}</label>
                                <input
                                    type="radio"
                                    id={item.value}
                                    defaultValue={item.value}                     
                                    checked={item.value === gender ? true : false}
                                    onChange={(e) => handleGender(e)}
                                />
                            </div>
                        ))}
                        <p className="error-message-line"></p>
                    </div>
                </div>
                <div className={cx('reg_col')}>
                    <div className={cx('reg_line_header')}>
                        <span>Địa chỉ</span>
                    </div>
                    <div className={cx('reg_grid')}>
                        <select
                            id="address__province"
                            name="address__province"
                            className={cx('address__province')}
                            defaultValue={user && user.address?.province ? user.address.province : ""}
                            data={user && user.address?.province ? user.address.province : ""}
                            ref={provinceEle}
                            onChange={handleProvince}
                        >
                            <option disabled value="">Tỉnh/Thành Phố</option>
                            {province?.map((item, index = 0) => {
                                return (
                                    <option value={item.name} key={index++}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            id="address__district"
                            name="address__district"
                            className={cx('address__district')}
                            defaultValue={user && user.address?.district ? user.address.district : ""}
                            data={user && user.address?.district ? user.address.district : ""}
                            onChange={handleDistrict}
                            ref={districtEle}
                        >
                            <option disabled value="" id="district__default">
                                Quận/Huyện
                            </option>
                            {district?.map((item, index) => {
                                return (
                                    <option value={item.name} key={index}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            id="address__ward"
                            name="address__ward"
                            className={cx('address__ward')}
                            defaultValue={user && user.address?.ward ? user.address.ward : ""}
                            data={user && user.address?.ward ? user.address.ward : ""}
                            onChange={handleWard}
                            ref={wardEle}
                        >
                            <option disabled value="" id="ward__default">
                                Phường/Xã
                            </option>
                            {ward?.map((item, index) => {
                                return (
                                    <option value={item.name} key={index}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <input
                            name="address__detail"
                            className={cx('address__detail')}
                            type="text"
                            placeholder="Địa chỉ nhà cụ thể:"
                            defaultValue={detail ? detail : ""}
                            onChange={handleDetail}
                            onBlur={handleErrorDetail}
                            ref={detailEle}
                        />
                    </div>
                    <p className="error-message-line"></p>
                </div>
                <div className={cx('changePassBtn reg_col')}>
                    <ChangePassword/>
                </div>
                <Button className={cx('custom_btn')} onClick={handleSubmit}>
                    Cập nhật
                </Button>
            </div>
        </div>
    ) : (
        <div className={cx('loading')}>
            <CircularProgress />
        </div>
    );
}

export default Profile;
