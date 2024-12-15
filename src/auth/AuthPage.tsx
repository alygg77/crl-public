import {Navigate, Route, Routes} from 'react-router-dom'
import React from 'react';
import {useAuth} from "./core/Auth";
import {MappingPaths} from "../constants/mapping.paths";
import {Logout} from "./Logout";


const AuthPage = () => {
    const {auth} = useAuth()
    const authCheck = !auth;
    const verifyPath = '../' + MappingPaths.PUBLIC.VERIFICATION +
        '?email=' + auth?.identity?.traits.email;
    const UnAuthRedirect = <Navigate to={MappingPaths.PUBLIC.LOGIN}/>;
    const AuthRedirect = <Navigate to={verifyPath}/>;

    return (
        <Routes>
            <Route>
                <Route path={MappingPaths.PUBLIC.REGISTRATION} element={<Registration/>}/>
                <Route path={MappingPaths.PUBLIC.VERIFICATION} element={<Verification/>}/>
                {/* TODO: Setting in map path*/}
                <Route path='settings' element={<AuthSettings/>}/>
                <Route path={MappingPaths.PUBLIC.LOGIN} element={authCheck ? <Login/> : AuthRedirect}/>
                <Route path={MappingPaths.PUBLIC.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                <Route path={MappingPaths.PRIVATE.LOGOUT} element={<Logout/>}/>
                <Route index element={authCheck ? UnAuthRedirect : AuthRedirect}/>
            </Route>
        </Routes>
    )
}

export {AuthPage}