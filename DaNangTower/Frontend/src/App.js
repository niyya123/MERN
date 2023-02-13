import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Fragment } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AdminEvent from './pages/AdminEvent';
import Event from './pages/Event';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Admin from './pages/Admin';
import DrawMap from './pages/Map';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Ticket from './pages/Ticket';
import Building from './pages/Building';
import AuthRoute from './utils/AuthRoute';
import PrivateRoute from './utils/PrivateRoute';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-bootstrap';
import AdminUser from './pages/AdminPages/AdminUser';
import AdminCard from './pages/AdminCard/AdminCard';
import SignUp from './pages/SignUp';
import UpdateUser from './pages/UserUpdate/UpdateUser';
import InsertUser from './pages/InsertUser/InsertUser';

function App() {
    const user = useSelector((state) => state.user.current);
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route path="*" element={<Error />}></Route>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/contact" element={<Contact />}></Route>
                        <Route path="/event" element={<Event />}></Route>
                        <Route path="/model" element={<DrawMap />}></Route>
                        
                        {/* Private Route */}
                        <Route path="/*" element={<PrivateRoute/>}>   
                            <Route path="user" element={<Profile/>}></Route>
                            <Route path="users/edituser/:id" element={<UpdateUser />}></Route>
                            <Route path="users/createuser" element={<InsertUser />}></Route>
                            <Route path="ticket" element={<Ticket />}></Route>
                        </Route>

                        {/* Auth Route */}
                        <Route path="/*" element={<AuthRoute />}>
                            <Route path="signin" element={<SignIn />}></Route>
                            <Route path="signup" element={<SignUp />}></Route>
                            <Route path="forgotPassword" element={<ForgotPassword />}></Route>
                        </Route>

                        {/* Admin Route */}
                        {user && user.isAdmin === true ? (
                            <Route path="/admin/*" element={<Admin />}>
                                <Route path="users" element={<AdminUser />}></Route>
                                <Route path="users/edituser/:id" element={<UpdateUser />}></Route>
                                <Route path="users/createuser" element={<InsertUser />}></Route>
                                <Route path="card" element={<AdminCard />}></Route>
                                <Route path="event" element={<AdminEvent />}></Route>
                                <Route path="building" element={<Building />}></Route>
                            </Route>
                        ) : (
                            <Fragment></Fragment>
                        )}
                    </Routes>
                    <ToastContainer></ToastContainer>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
