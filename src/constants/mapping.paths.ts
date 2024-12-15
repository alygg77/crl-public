import * as process from "node:process";
interface ConfigBaseURL {
    kratosSelfServiceURL: string;
    crmBaseURL: string;
    baseURL: string;
    basePath: string;  // More information is needed to define this properly
}

export const baseURL = 'http://127.0.0.1:4455'

export const getNavigateFullPath = (path: string) => `${'/'}${path}`;

export const configBaseURL: ConfigBaseURL = {
    kratosSelfServiceURL: baseURL + '/_auth',
    crmBaseURL: baseURL + '/crm/api/v1',
    baseURL: baseURL,
    basePath: '/ui'
}


export const MappingPaths = {
    ERROR: 'error',
    PUBLIC: {
        AUTH: 'auth',
        LOGIN: 'login',
        REGISTRATION: 'registration',
        VERIFICATION: 'verification',
        FORGOT_PASSWORD: 'forgot-password',
        TERMS_AND_CONDITION: 'tos'
    },
    PRIVATE: {
        DASHBOARD: 'dashboard',
        LOGOUT: 'logout'
    }
};
