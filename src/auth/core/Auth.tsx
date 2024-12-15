import {FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction, ReactNode} from 'react'
import {LayoutSplashScreen} from '../../extras/splash'
import {UserCRM} from "../../crm/types";
import {RequestGetCurrentUser} from "../../crm/api";
import {AuthKratosModel, getKratosAuth, kratosLogout} from "../";
import {SaveReferral} from "../referral";
import * as queryString from "querystring";
import React from 'react';


type WithChildren = {
    children?: ReactNode
}


type AuthContextProps = {
    auth: AuthKratosModel | undefined
    saveAuth: (auth: AuthKratosModel | undefined) => void
    currentUser: UserCRM | undefined
    setCurrentUser: Dispatch<SetStateAction<UserCRM | undefined>>
    logout: () => void
}

const initAuthContextPropsState = {
    auth: undefined,
    saveAuth: () => {
    },
    currentUser: undefined,
    setCurrentUser: () => {
    },
    logout: () => {
    },
} as AuthContextProps;

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
    return useContext(AuthContext)
}

const CookieCleaner = () => {
    const authPrefix = "csrf"
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        if (name.substring(0,authPrefix.length) == authPrefix){
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    });
}

const AuthProvider: FC<WithChildren> = ({children}) => {
    const [auth, setAuth] = useState<AuthKratosModel | undefined>()
    const [currentUser, setCurrentUser] = useState<UserCRM | undefined>()

    const logout = () => {
        kratosLogout().then().catch((e: any) => {
            console.log("can't do logout, error:", e);
        }).finally(() => {
            setAuth(undefined)
            setCurrentUser(undefined)
            CookieCleaner()
            console.log("logout done");
        });
    }

    const saveAuth = (auth: AuthKratosModel | undefined) => {
        if (auth) {
            setAuth(auth)
        } else {
            logout();
        }
    }

    return (
        <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

const AuthInit: FC<WithChildren> = ({children}) => {
    const {auth, saveAuth, logout, currentUser, setCurrentUser} = useAuth()
    const [showSplashScreen, setShowSplashScreen] = useState(true)

    useEffect(() => {
        CookieCleaner();
        SaveReferral();
        getKratosAuth().then((session) => {
            if (!session) {
                setShowSplashScreen(false)
            }
            saveAuth(session);
        }).catch((e: any) => {
            logout();
            CookieCleaner();
            console.log(e);
            setShowSplashScreen(false)
        });
    }, []);

    useEffect(() => {
        CookieCleaner();
        if (auth) {
            RequestGetCurrentUser().then((user) => {
                if (!user) {
                    logout();
                }
                if (auth.identity) {
                    const email = auth.identity.traits.email;
                    auth.identity.verifiable_addresses?.forEach((address) => {
                        if (address.value == email && address.verified) {
                            // email is verified
                            (user as UserCRM).email = auth.identity?.traits.email;
                        }
                    })
                }
                setCurrentUser(user);
            }).catch((e: any) => {
                logout();
                CookieCleaner();
                console.log(e);
            }).finally(() => {
                setShowSplashScreen(false)
            });
        }
    }, [auth]);
    return showSplashScreen ? <LayoutSplashScreen/> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
