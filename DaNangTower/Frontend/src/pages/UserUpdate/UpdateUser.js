import React, { useRef } from 'react';
import './UpdateUser.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { userRequest, hostServer, publicRequest } from "../../utils/request";
import { toast } from "react-toastify";

function UpdateUser() {
    const params = useParams();
    const [user, setUser] = useState([]);
    const [district, setdistrict] = useState([]);
    const [province, setaddress] = useState([]);
    const [ward, setward] = useState([]);
    const [isAdmin, setIsAdmin] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [birthday, setBirthday] = useState();
    const [done, setDone] = useState(false);
    const [error, setError] = useState(false);

    const provinceEle = useRef();
    const districtEle = useRef();
    const wardEle = useRef();
    const detailEle = useRef();
    console.log(params)

    useEffect(() => {
        userRequest().get("admin/users/getUser/" + params.id).then((res) => {
            console.log(res)

            setUser(res.data.user);
            setIsAdmin(res.data.user.isAdmin);
            setName(res.data.user.name);
            setEmail(res.data.user.email);
            setPhone(res.data.user.phone);
            setBirthday(res.data.user.birthday);
            setGender(res.data.user.gender);

            provinceEle.current.value = user.address.province;
            districtEle.current.value = user.address.district;
            wardEle.current.value = user.address.ward;
            detailEle.current.value = user.address.detailEle;

        });
    }, []);

    useEffect(() => {
        publicRequest
        .get("address/getalladress")
        .then((res) => {
            setaddress(res.data.address);
        });
    }, []);

    const Getdistrictbyprovince = () => {
        var province = document.getElementById("province").value;
        provinceEle.current.value = document.getElementById("province").value;

        document.getElementById("district").value = "";
        document.getElementById("ward").value = "";
        axios.get(hostServer + '/api/address/district/' + province).then((res) => {
            setdistrict(res.data.address);
        });
    }

    const Getwardbydistrict = () => {
        var district = document.getElementById("district").value;
        districtEle.current.value = document.getElementById("district").value;

        document.getElementById("ward").value = "";
        axios.get(hostServer + '/api/address/ward/' + provinceEle.current.value + '/' + district).then((res) => {
            setward(res.data.address);
        });
    }
    const handleisAdmin = (e) => {
        setIsAdmin(e.target.checked);
    };
    const handlename = (e) => {
        setName(e.target.value);
    };
    const handlephone = (e) => {
        setPhone(e.target.value);
    };
    const handleemail = (e) => {
        setEmail(e.target.value);
    };
    const handlegender = (e) => {
        setGender(e.target.value);
    };
    const handlebirthday = (e) => {
        setBirthday(e.target.value);
    };

    const handleward = (e) => {
        wardEle.current.value = e.target.value

    };
    const handladdressdetail = (e) => {
        detailEle.current.value = e.target.value
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        userRequest()
            .put(`admin/users/update/${params.id}`, {
                isAdmin: isAdmin,
                username: name,
                phone: phone,
                gender: gender,
                birthday: birthday,
                email: email,
                province: provinceEle.current.value,
                district: districtEle.current.value,
                ward: wardEle.current.value,
                addressDetail: detailEle.current.value,
            })
            .then((res) => {
                setDone(true);
                setError(false);
                toast.success("Cập Nhật Thành Công", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            })
            .catch((err) => {
                setDone(false);
                setError(true);
                toast.error("Đã xảy ra lỗi, cập nhật thất bại", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                console.log(err)});
    };

    return (
        <div className="container mt-4 mb-4">
            <h1 className="text-center heading">Cập nhật thông tin người dùng</h1>
            {done && <h3 className="text-center text-success">Cập nhật thành công</h3>}
            {error && <h3 className="text-center text-danger">Cập nhật thất bại, thử lại sau nhé!</h3>}
            <form className="mt-4">
                <div className="mb-4 check">
                    <input className="form-check-input my-check-tag" type="checkbox" onClick={handleisAdmin} name='isAdmin' defaultChecked={user.isAdmin} id="flexCheckDefault" />
                    <label className="form-check-label label_level_1" >
                        Admin
                    </label>
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Tên người dùng</label>
                    <input type="text" className="form-control my-input-tag" id='name' onChange={handlename} name='name' defaultValue={user.name} />
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Số điện thoại</label>
                    <input type="text" className="form-control my-input-tag" id='phone' onChange={handlephone} name='phone' defaultValue={user.phone} />
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Địa chỉ email</label>
                    <input type="text" className="form-control my-input-tag" id='email' onChange={handleemail} name='email' defaultValue={user.email} />
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Giới tính</label>
                    <select className="form-select my-input-tag" name='gender' onChange={handlegender} aria-label=".form-select-sm example">
                        <option hidden defaultValue={user?.gender}>{user.gender}</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label label_level_1">Ngày sinh</label>
                    <input type="date" className="form-control my-input-tag" id='birthday' name='birthday' defaultValue={user.birthday} min="1920-01-01" max="2022-12-26" onChange={handlebirthday}/>

                </div>

                <label className="form-label label_level_1">Địa chỉ</label>

                <div className='lavel_2'>
                    <div className="mb-4">
                        <label className="form-label label_level_2">Thành phố/tỉnh</label>
                        <select className="form-select my-input-tag" id='province' ref={provinceEle} name='address.province' onChange={Getdistrictbyprovince} aria-label=".form-select-sm example">
                            <option hidden defaultValue={user.address?.province}>{user.address?.province}</option>
                            {
                                province?.map((province, index = 0) => (
                                    <option value={province.name} key={index++}>{province.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">Quận/huyện</label>
                        <select className="form-select my-input-tag" id='district' ref={districtEle} name='address.district' onChange={Getwardbydistrict} aria-label=".form-select-sm example">
                            <option id="slt-dis" hidden defaultValue={user.address?.district}>{user.address?.district}</option>
                            {
                                district.districts?.map((district, index = 0) => (
                                    <option value={district.name} key={index++}>{district.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">Phường/xã</label>
                        <select className="form-select my-input-tag" id='ward' ref={wardEle} onChange={handleward} name='address.ward' aria-label=".form-select-sm example">
                            <option hidden defaultValue={user.address?.ward}>{user.address?.ward}</option>
                            {
                                ward.wards?.map((ward, index = 0) => (
                                    <option value={ward.name} key={index++}>{ward.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">Địa chỉ cụ thể</label>
                        <input type="text" className="form-control my-input-tag" ref={detailEle} onChange={handladdressdetail} id='addressdetail' name='address.addressdetail' defaultValue={user.address?.addressdetail} />
                    </div>
                </div>

                <Link className="btn btn-primary my-bnt bnt-back" to='/admin/users'>Quay lại</Link>
                <button className="btn btn-primary my-bnt" onClick={handleSubmit}>Lưu lại</button>
            </form>
        </div>
    );
}

export default UpdateUser;
