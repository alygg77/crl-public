import {redirect} from "react-router-dom";
import {AxiosError} from "axios";
import axios from '@ory/kratos-client/node_modules/axios';
import {
    Configuration,
    FrontendApi,
    GenericError,
    RegistrationFlow, VerificationFlow, LoginFlow, RecoveryFlow, SettingsFlow,
    SuccessfulNativeRegistration,
    UpdateVerificationFlowWithCodeMethod,
    ContinueWithVerificationUi, ContinueWithVerificationUiActionEnum,
    RecoveryFlowState,
    UpdateRecoveryFlowBody, UpdateRecoveryFlowWithCodeMethodMethodEnum,
    FrontendApiUpdateLogoutFlowRequest,
    UiNodeGroupEnum, UiNodeTypeEnum, UiNodeInputAttributesTypeEnum, UpdateSettingsFlowBody, SuccessfulNativeLogin
} from '@ory/kratos-client';
import {configBaseURL, getNavigateFullPath, MappingPaths} from '../../constants/mapping.paths';
import {AuthKratosModel, KratosForm} from "../";
import {
    ErrorBrowserLocationChangeRequired,
    UpdateRecoveryFlowWithCodeMethod,
    UiNodeInputAttributes, NeedsPrivilegedSessionError
} from "@ory/kratos-client/api";

const configuration = new Configuration({
    basePath: configBaseURL.kratosSelfServiceURL,
    baseOptions: {
        withCredentials: true,
    },
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("error is: " + error)

        // check for axios@0.21 Error
        if (error?.isAxiosError) {
            if (error?.response?.status === 401) {
                const searchParams = new URLSearchParams();
                searchParams.append('from', window.location.pathname);
                if (error?.response?.data?.error?.message) {
                    searchParams.append('message', error.response.data.error.message);
                }
            }
        } else {
            console.log(error)
        }

        return Promise.reject(error);
    },
);

export const kratos = new FrontendApi(configuration);
export const EAuthLoginFlowId = {
    SessionAlreadyAvailable: 'session_already_available',
    SecurityCsrfViolation: 'security_csrf_violation',
    SessionAal1Required: 'session_aal1_required',
    SecurityIdentityMismatc: 'security_identity_mismatch',
};
export const parseKratosFlowUINodes =
    (flow :RegistrationFlow | VerificationFlow | LoginFlow | RecoveryFlow | SettingsFlow) : KratosForm => {
        const kratosForm = {} as KratosForm;
        flow.ui.nodes.forEach((node) => {
            if (node.group === UiNodeGroupEnum.Oidc) {
                // skip oids group.
                return null;
            }
            if (node.type === UiNodeTypeEnum.Input) {
                const attributes = node.attributes as UiNodeInputAttributes
                switch (attributes.type) {
                    case UiNodeInputAttributesTypeEnum.Text:
                        switch (attributes.name) {
                            case 'traits.first_name':
                                kratosForm.first_name = attributes.value;
                                break;
                            case 'traits.last_name':
                                kratosForm.last_name = attributes.value;
                                break;
                        }
                        break;
                    case UiNodeInputAttributesTypeEnum.Hidden:
                        switch (attributes.name) {
                            case 'csrf_token':
                                kratosForm.csrf_token = attributes.value;
                                break;
                        }
                        break;
                    case UiNodeInputAttributesTypeEnum.Email:
                        switch (attributes.name) {
                            case 'traits.email':
                                kratosForm.email = attributes.value;
                                break;
                        }
                        break;
                    case UiNodeInputAttributesTypeEnum.Checkbox:
                        switch (attributes.name) {
                            case 'traits.tos':
                                kratosForm.tos = attributes.value;
                                break;
                        }
                        break;
                    case UiNodeInputAttributesTypeEnum.Password:
                        switch (attributes.name) {
                            case 'password':
                                kratosForm.password = attributes.value;
                                break;
                        }
                        break;
                }
            }
        })
        return kratosForm
    }
export const getKratosAuth: () => Promise<AuthKratosModel | undefined> = async (): Promise<AuthKratosModel | undefined> => {
    try {
        const session = await kratos.toSession()
        return session.data as AuthKratosModel;
    } catch (e: any) {
        console.log("can't get session")
    }
    return undefined
}

export const kratosRegistrationFlowLoader = async () => {
    try {
        console.log("call kratos registration");
        const response = await kratos.createBrowserRegistrationFlow();
        return {
            flow: response.data,
        };
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        if (data.error) {
            if ((data.error as GenericError).id === EAuthLoginFlowId.SessionAlreadyAvailable) {
                return redirect(getNavigateFullPath(MappingPaths.PRIVATE.DASHBOARD));
            }
        }

        if (data.ui) {
            return data;
        }

        throw e;
    }
};

export const kratosVerificatationFlowLoader = async () => {
    try {
        console.log("call kratos verification");
        const response = await kratos.createBrowserVerificationFlow();
        return {
            flow: response.data,
        };
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        if (data.error) {
            if ((data.error as GenericError).id === EAuthLoginFlowId.SessionAlreadyAvailable) {
                return redirect(getNavigateFullPath(MappingPaths.PRIVATE.DASHBOARD));
            }
        }

        if (data.ui) {
            return data;
        }

        throw e;
    }
};

export const kratosLoginFlowLoader = async () => {
    try {
        console.log("call kratos login");

        const response = await kratos.createBrowserLoginFlow();
        return {
            flow: response.data,
        };
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        console.log(data);
        if (data.error) {
            if ((data.error as GenericError).id === EAuthLoginFlowId.SessionAlreadyAvailable) {
                return redirect(getNavigateFullPath(MappingPaths.PRIVATE.DASHBOARD));
            }
        }

        if (data.ui) {
            return data;
        }

        throw e;
    }
};

export const kratosRecoveryFlowLoader = async () => {
    try {
        console.log("call kratos recovery");
        const response = await kratos.createBrowserRecoveryFlow();
        return {
            flow: response.data,
        };
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        if (data.error) {
            if ((data.error as GenericError).id === EAuthLoginFlowId.SessionAlreadyAvailable) {
                return redirect(getNavigateFullPath(MappingPaths.PRIVATE.DASHBOARD));
            }
        }

        if (data.ui) {
            return data;
        }

        throw e;
    }
};

export const kratosSettingsFlowLoader = async () => {
    try {
        console.log("call kratos settings");
        const response = await kratos.createBrowserSettingsFlow();
        return {
            flow: response.data,
        };
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }
        const {data} = e.response;
        if (data.error) {
            if ((data.error as GenericError).id === EAuthLoginFlowId.SessionAlreadyAvailable) {
                return redirect(getNavigateFullPath(MappingPaths.PRIVATE.DASHBOARD));
            }
        }
        if (data.ui) {
            return data;        }

        throw e;
    }
};

export const kratosLogout = async () => {
    try {
        console.log("call kratos logout");
        const response = await kratos.createBrowserLogoutFlow();
        await kratos.updateLogoutFlow({token: response.data.logout_token} as FrontendApiUpdateLogoutFlowRequest);
        return {};
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }
        console.log(e);
        throw e;
    }
};

export const kratosRegister = async (values: KratosForm) => {
    try {
        const response = await kratos.updateRegistrationFlow({
            flow: `${values.flow_id}`,
            updateRegistrationFlowBody: {
                csrf_token: `${values.csrf_token}`,
                password: `${values.password}`,
                method: `${values.method}`,
                traits: {
                    email: `${values.email}`,
                    tos: values.tos
                }
            }
        });
        const result = response.data as SuccessfulNativeRegistration;
        console.log(result)
        if (result.continue_with) {
            result.continue_with.forEach((value) => {
                if (value.action === ContinueWithVerificationUiActionEnum.ShowVerificationUi) {
                    const verificationValue = value as ContinueWithVerificationUi
                    window.location.href = (verificationValue.flow.url as string) + "&email=" +`${values.email}`
                    return
                }
            })
        }
        return
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }
        const {data} = e.response;
        console.log(data);
        if (data.error) {
            return {
                errors: [(data.error as GenericError).reason],
            };
        }
        if (data.ui) {
            const {ui} = data as RegistrationFlow;
            if (ui.messages) {
                const generalErrors = ui.messages.map((message) => message.text);
                const nodeErrors = ui.nodes.map((node) => node.messages.map((message) => message.text)).flat();
                return {
                    flow: data as RegistrationFlow,
                    errors: [...generalErrors, ...nodeErrors],
                };
            }
            return {
                flow: data as RegistrationFlow,
            };
        }

        throw e;
    }
};

export const kratosVerificationWithCode = async (body: UpdateVerificationFlowWithCodeMethod, flow_id: string) => {
    try {
        console.log(body)
        const result = await kratos.updateVerificationFlow({
            flow: flow_id,
            updateVerificationFlowBody: body
        });
        console.log(result)
        return result.data as VerificationFlow;
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;

        if (data.error) {
            return {
                errors: [(data.error as GenericError).reason],
            };
        }

        if (data.ui) {
            const {ui} = data as RegistrationFlow;
            if (ui.messages) {
                const generalErrors = ui.messages.map((message) => message.text);
                const nodeErrors = ui.nodes.map((node) => node.messages.map((message) => message.text)).flat();

                return {
                    errors: [...generalErrors, ...nodeErrors],
                };
            }
        }

        throw e;
    }
};

export const kratosLogin = async (values: KratosForm): Promise<number> => {
    try {
        const response = await kratos.updateLoginFlow({
            flow: `${values.flow_id}`,
            updateLoginFlowBody: {
                csrf_token: `${values.csrf_token}`,
                password: `${values.password}`,
                method: `${values.method}`,
                identifier: `${values.email}`
            }
        });
        return response.status
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        const status = (e as AxiosError)?.response?.status
        if (data.error && status) {
            console.log((data.error as GenericError).reason);
        }

        if (data.ui && status) {
            const {ui} = data as LoginFlow;
            if (ui.messages) {
                const generalErrors = ui.messages.map((message) => message.text);
                const nodeErrors = ui.nodes.map((node) => node.messages.map((message) => message.text)).flat();

                console.log([...generalErrors, ...nodeErrors]);
            }
        }
        return status ? status : 500;
    }
};
export const kratosRecovery = async (values: KratosForm, state: RecoveryFlowState) => {
    try {
        const body = {
            csrf_token: `${values.csrf_token}`,
            method: `${values.method}` as UpdateRecoveryFlowWithCodeMethodMethodEnum
        } as UpdateRecoveryFlowBody | UpdateRecoveryFlowWithCodeMethod;

        if(state === RecoveryFlowState.ChooseMethod) {
            body.email = values.email
        } else if (state === RecoveryFlowState.SentEmail) {
            (body as UpdateRecoveryFlowWithCodeMethod).code = values.code
        } else if (state === RecoveryFlowState.PassedChallenge) {

        }
        const response = await kratos.updateRecoveryFlow({
            flow: `${values.flow_id}`,
            updateRecoveryFlowBody: body
        });

        const result = response.data;
        console.log(result)
        return result as RecoveryFlow
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        console.log(data)
        if (e.response?.status === 422) {
            const err = data as ErrorBrowserLocationChangeRequired
            window.location.href = err.redirect_browser_to as string
            return
        }
        if (data.error) {
            return {
                errors: [(data.error as GenericError).reason],
            };
        }

        if (data.ui) {
            const {ui} = data as RegistrationFlow;
            if (ui.messages) {
                const generalErrors = ui.messages.map((message) => message.text);
                const nodeErrors = ui.nodes.map((node) => node.messages.map((message) => message.text)).flat();

                return {
                    errors: [...generalErrors, ...nodeErrors],
                };
            }
        }
        throw e;
    }
};
export const kratosSettings = async (body: UpdateSettingsFlowBody, flowID: string) => {
    try {
        const response = await kratos.updateSettingsFlow({
            flow: `${flowID}`,
            updateSettingsFlowBody: body
        });
        const result = response.data;
        console.log(result)
        return result as SettingsFlow
    } catch (e: any) {
        // check for axios@0.21 Error
        if (!e.isAxiosError) {
            throw e;
        }

        const {data} = e.response;
        console.log(data)
        if (e.response?.status === 422) {
            const err = data as ErrorBrowserLocationChangeRequired
            window.location.href = err.redirect_browser_to as string
            return
        }
        if (data.error) {
            if ((data.error as GenericError).code == 403 ) {
                console.log(data.redirect_browser_to)
                console.log(data)
                if (data.redirect_browser_to) {
                    window.location.href = data.redirect_browser_to
                    return
                }
            }
            throw new Error((data.error as GenericError).reason);
        }

        if (data.ui) {
            const {ui} = data as RegistrationFlow;
            if (ui.messages) {
                const generalErrors = ui.messages.map((message) => message.text);
                const nodeErrors = ui.nodes.map((node) => node.messages.map((message) => message.text)).flat();

                // Make a string error with generalErrors and nodeErrors
                const errorString = 'errors: ' + [...generalErrors, ...nodeErrors].join(',');

                throw new Error(errorString);
            }
        }
        throw e;
    }
};
