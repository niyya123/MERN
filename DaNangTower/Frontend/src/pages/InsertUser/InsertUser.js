import React, { useRef } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { userRequest, hostServer, publicRequest } from "../../utils/request";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import storage from '../../utils/firebaseConfig';
import './InsertUser.scss';

function InsertUser() {
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
    const [error, setError] = useState('');

    const provinceEle = useRef();
    const districtEle = useRef();
    const wardEle = useRef();
    const detailEle = useRef();

    const [preview, setPreview] = useState();
    const [imageAsFile, setImageAsFile] = useState('');
    const [imageAsUrl, setImageAsUrl] = useState('');
    const [percent, setPercent] = useState(0);

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
        if (imageAsFile === '' || imageAsFile === null || imageAsFile === undefined || !imageAsFile) {
            setError(`Not an image, the image file is a ${typeof imageAsFile}`);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFireBaseUpload(e);
        userRequest()
            .post(`admin/users/createUser`, {
                isAdmin: isAdmin,
                username: name,
                phone: phone,
                gender: gender,
                birthday: birthday,
                email: email,
                image: imageAsUrl? imageAsUrl: "https://firebasestorage.googleapis.com/v0/b/dgis-33b4f.appspot.com/o/images%2FArcGIS_logo.png?alt=media&token=685b8002-4adf-46ea-ace8-cb4602e77bb4",
                province: provinceEle.current.value,
                district: districtEle.current.value,
                ward: wardEle.current.value,
                addressDetail: detailEle.current.value,
            })
            .then((res) => {
                setDone(true);
                setError('Th??m m???i th??nh c??ng');
                toast.success("Th??m m???i th??nh c??ng", {
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
                setError('???? x??y ra l???i, th??m m???i th???t b???i!');
                toast.error("???? x???y ra l???i, th??m m???i th???t b???i", {
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
            <h1 className="text-center heading">Th??m m???i th??ng tin ng?????i d??ng</h1>
            {done && <h3 className="text-center text-success">Th??m m???i th??nh c??ng</h3>}
            {error && <h3 className="text-center text-danger">Th??m m???i th???t b???i, th??? l???i sau nh??!</h3>}
            <form className="mt-4">
                <div className="mb-4 check">
                    <input className="form-check-input my-check-tag" type="checkbox" onClick={handleisAdmin} name='isAdmin' defaultChecked={""} id="flexCheckDefault"/>
                    <label className="form-check-label label_level_1" >
                        Admin
                    </label>
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Ch???n ???nh ?????i di???n ng?????i d??ng</label>
                    <div className='mb-4'>
                        <img className="avatarFile" src={(preview === null || preview === undefined) ? "https://firebasestorage.googleapis.com/v0/b/dgis-33b4f.appspot.com/o/images%2FArcGIS_logo.png?alt=media&token=685b8002-4adf-46ea-ace8-cb4602e77bb4" : preview} alt={imageAsFile? imageAsFile.name : "https://firebasestorage.googleapis.com/v0/b/dgis-33b4f.appspot.com/o/images%2FArcGIS_logo.png?alt=media&token=685b8002-4adf-46ea-ace8-cb4602e77bb4"} />
                        <input type="file" accept="image/*" className='btn btn-outline-primary' onClick={(e) => getFileClick(e) } />
                        {percent > 0 && <p>{percent} "% done"</p>}
                    </div>                 
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">T??n ng?????i d??ng</label>
                    <input type="text" className="form-control my-input-tag" id='name' onChange={handlename} name='name' defaultValue={""} placeholder='Nh???p t??n ng?????i d??ng'/>
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">S??? ??i???n tho???i</label>
                    <input type="text" className="form-control my-input-tag" id='phone' onChange={handlephone} name='phone' defaultValue={""} placeholder='Nh???p s??? ??i???n tho???i' />
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">?????a ch??? email</label>
                    <input type="text" className="form-control my-input-tag" id='email' onChange={handleemail} name='email' defaultValue={""} placeholder='Nh???p email'/>
                </div>
                <div className="mb-4">
                    <label className="form-label label_level_1">Gi???i t??nh</label>
                    <select className="form-select my-input-tag" name='gender' onChange={handlegender} aria-label=".form-select-sm example">
                        <option hidden defaultValue={"Male"}>{"Male"}</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label label_level_1">Ng??y sinh</label>
                    <input type="date" className="form-control my-input-tag" id='birthday' placeholder='Ng??y sinh' name='birthday' defaultValue={"2001-01-01"} min="1920-01-01" max="2022-12-26" onChange={handlebirthday}/>
                </div>

                <label className="form-label label_level_1">?????a ch???</label>

                <div className='lavel_2'>
                    <div className="mb-4">
                        <label className="form-label label_level_2">Th??nh ph???/t???nh</label>
                        <select className="form-select my-input-tag" id='province' ref={provinceEle} name='address.province' onChange={Getdistrictbyprovince} aria-label=".form-select-sm example">
                            {
                                province?.map((province) => (
                                    <option value={province.name} key={province._id}>{province.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">Qu???n/huy???n</label>
                        <select className="form-select my-input-tag" id='district' ref={districtEle} name='address.district' onChange={Getwardbydistrict} aria-label=".form-select-sm example">
                            {
                                district.districts?.map((district) => (
                                    <option value={district.name} key={district._id}>{district.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">Ph?????ng/x??</label>
                        <select className="form-select my-input-tag" id='ward' ref={wardEle} onChange={handleward} name='address.ward' aria-label=".form-select-sm example">
                            {
                                ward.wards?.map((ward) => (
                                    <option value={ward.name} key={ward._id}>{ward.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label label_level_2">?????a ch??? c??? th???</label>
                        <input type="text" className="form-control my-input-tag" ref={detailEle} onChange={handladdressdetail} id='addressdetail' name='address.addressdetail' placeholder='Nh???p ?????a ch??? c??? th???' defaultValue={""} />
                    </div>
                </div>

                <Link className="btn btn-primary my-bnt bnt-back" to='/admin/users'>Quay l???i</Link>
                <button className="btn btn-primary my-bnt" onClick={handleSubmit}>Th??m m???i</button>
            </form>
        </div>
    );
}

export default InsertUser;
