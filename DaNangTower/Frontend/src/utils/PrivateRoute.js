import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


export default function PrivateRoute ()  {
    const userPrivate = useSelector((state) => state.user);
    const userAuth = userPrivate.current;
    return userAuth ? <Outlet></Outlet> : <Navigate to="/signin"></Navigate>;
};
