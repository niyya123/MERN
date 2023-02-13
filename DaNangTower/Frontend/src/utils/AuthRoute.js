import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AuthRoute () {
    const userAuth = useSelector((state) => state.user.current);
    return userAuth ? <Navigate to="/"></Navigate> : <Outlet></Outlet>;
};

