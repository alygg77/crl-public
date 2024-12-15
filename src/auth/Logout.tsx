import {useEffect} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {useAuth} from './core/Auth'
import {useIntl} from "react-intl";
import React from 'react';

export function Logout() {
    const intl = useIntl();
    const {logout, auth} = useAuth();

    useEffect(() => {
        logout()
    }, [])

    if (auth) {
        return (
            <div>
                <span className='indicator-progress' style={{display: 'block'}}>
                    {intl.formatMessage({id: 'GENERAL.WAIT'})}{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>

            </div>


        )
    }

    return (
        <Routes>
            <Route index element={<Navigate to='MappingPaths.PUBLIC.LOGIN'/>}/>
        </Routes>
    )
}
