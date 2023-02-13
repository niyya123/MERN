import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './textinputfield.scss';

function TextInputField({ icon, type, placeholder, name, getInput, setValid }) {
    const [value, setValue] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    
    const onShowPwd = () => {
        setShowPwd((value) => !value);
    };

    const onTextChange = (e, name) => {
        getInput(e.target.name, e.target.value);
        setValue(e.target.value);
        if (name === 'email') onEmailTextChange(e.target.value);
        else if (name === "name" || name === "code") onNameTextChange(e.target.value);
        else if (name === "phone") onPhoneTextChange(e.target.value);
        else if (name === "verifyPassword" || name === 'newPassword' || name === 'currentPassword' || name === 'password' ) onPwdTextChange(e.target.value);
    };
    const onNameTextChange = (value) => {
        if (value === "") {
          setError("This field can not be left blank!");
          setValid(false);
        } else {
          setError("");
          setValid(true);
        }
      };
    const onEmailTextChange = (value) => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (value === '') {
            setValid(false);
            setError('This field can not be left blank!');
        } else if (!regex.test(value)) {
            setValid(false);
            setError('Invalid email!');
        } else {
            setError('');
            setValid(true);
        }
    };
    const onPwdTextChange = (value) => {
        if (value === '') {
            setError('This field can not be left blank!');
            setValid(false);
        } else if (value.length < 6) {
            setError('Password must contain at least 6 chars');
            setValid(false);
        } else {
            setError('');
            setValid(true);
        }
    };

    const onPhoneTextChange = (value) => {
        const regex = /^0\d{9}$/;
        if (value === "") {
            setError("This field can not be left blank!");
            setValid(false);
        } else if (!regex.test(value)) {
            setValid(false);
            setError("Incorrect phone number format");
        } else {
            setError("");
            setValid(true);
        }
      };
   
    return (
        <div>
            <div className="text-input row">
                <FontAwesomeIcon icon={icon} className="icon col-1" />
                {type === 'password' ? (
                    <>
                        <input
                            value={value}
                            className="col-8"
                            type={showPwd ? 'text' : 'password'}
                            placeholder={placeholder}
                            onChange={(e) => onTextChange(e, name)}
                            name={name}
                       />
                        <FontAwesomeIcon
                            icon={showPwd ? faEye : faEyeSlash}
                            className="icon col-1 icon_eye"
                            onClick={onShowPwd}
                        />
                    </>
                ) : (
                    <input
                        value={value}
                        className="col-9"
                        type={type}
                        placeholder={placeholder}
                        onChange={(e) => onTextChange(e, name)}
                        name={name}
                    />
                )}
            </div>
            <p className="error">{error}</p>
        </div>
    );
}

export default TextInputField;
