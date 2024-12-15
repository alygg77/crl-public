import axios from "axios";
import {configBaseURL} from "../constants/mapping.paths";
import {MERCHANT_GUID} from "../constants/merchant";
import {
    ClientMeta,
    PartnerMeta,
    CategoryCRM,
    CreateEntityData, CRMPaymentResponse, DemandCRM, DemandMeta,
    Entity,
    EntityData,
    NewCRMObject, Payer, ReferralCampaignInterface, ReferralMeta,
    ServiceCRM, ServiceMeta, SocialMedia, StateCRM, SuccessCriteria, UpdateDemand, UpdateService,
    UserCRM
} from "./types";
import {EntityType} from "./constants";

export const RequestGetDemandsRequest = async (checkedList: string[],
                                 selectedSort: string,
                                 from: number | undefined,
                                 to: number | undefined,
                                 offset: number | undefined,
                                 limit: number | undefined,
                                 minPrice: number | undefined,
                                 maxPrice: number | undefined,
                                 searchQuery: string): Promise<DemandCRM[]> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/public/merchants/${MERCHANT_GUID}/demands`;

    const queryParams = [];
    if (checkedList.length > 0) {
        queryParams.push(`categories=${checkedList.join(',')}`);
    }
    if (selectedSort) {
        queryParams.push(`sort=${selectedSort}`);
    }
    if (typeof minPrice === 'number' && minPrice === minPrice) {
        queryParams.push(`price_min=${minPrice}`);
    }
    if (typeof maxPrice === 'number' && maxPrice === maxPrice) {
        queryParams.push(`priceMax=${maxPrice}`);
    }
    if (searchQuery !== "") {
        queryParams.push(`search=${searchQuery}`)
    }
    if (typeof from == 'number') {
        queryParams.push(`from=${from}`)
    }
    if (typeof to == 'number') {
        queryParams.push(`to=${to}`)
    }
    if (typeof offset == 'number') {
        queryParams.push(`offset=${offset}`)
    }
    if (typeof limit == 'number') {
        queryParams.push(`limit=${limit}`)
    }
    const queryString = queryParams.join('&');
    const fullApiUrl = `${apiUrl}?${queryString}`;

    try {
        const data = await axios.get(fullApiUrl)
        return data.data as DemandCRM[]
    } catch (e) {
        const err = new Error('Error fetching offers: ' + e)
        console.error(err)
        throw err
    }
}

export const requestGetDemandsByClient = async (clientGuid: string, states: string[]): Promise<DemandCRM[]> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/clients/${clientGuid}/demands`;
    const queryParams = [];

    if (states.length > 0) {
        queryParams.push(`states=${states.join(',')}`);
    }

    const queryString = queryParams.join('&');
    const fullApiUrl = `${apiUrl}?${queryString}`;

    try {
        const data = await axios.get(fullApiUrl);
        return data.data as DemandCRM[];
    } catch (e) {
        const err = new Error('Error fetching partner\'s offers: ' + e);
        console.error(err);
        throw err;
    }
}
export const RequestGetOffers = async (checkedList: string[],
                                states: string[],
                                selectedSort: string,
                                from: number | undefined,
                                to: number | undefined,
                                offset: number | undefined,
                                limit: number | undefined,
                                minPrice: number | undefined,
                                maxPrice: number | undefined,
                                searchQuery: string): Promise<ServiceCRM[]> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/public/merchants/${MERCHANT_GUID}/services`;

    const queryParams = [];
    if (checkedList.length > 0) {
        queryParams.push(`categories=${checkedList.join(',')}`);
    }
    if (states.length > 0) {
        queryParams.push(`states=${states.join(',')}`);
    }
    if (selectedSort) {
        queryParams.push(`sort=${selectedSort}`);
    }
    if (typeof minPrice === 'number' && minPrice === minPrice) {
        queryParams.push(`price_min=${minPrice}`);
    }
    if (typeof maxPrice === 'number' && maxPrice === maxPrice) {
        queryParams.push(`price_max=${maxPrice}`);
    }
    if (searchQuery !== "") {
        queryParams.push(`search=${searchQuery}`)
    }
    if (typeof from == 'number') {
        queryParams.push(`from_time=${from}`)
    }
    if (typeof to == 'number') {
        queryParams.push(`to_time=${to}`)
    }
    if (typeof offset == 'number') {
        queryParams.push(`offset=${offset}`)
    }
    if (typeof limit == 'number') {
        queryParams.push(`limit=${limit}`)
    }
    const queryString = queryParams.join('&');
    const fullApiUrl = `${apiUrl}?${queryString}`;

    try {
        const data = await axios.get(fullApiUrl)
        return data.data as ServiceCRM[]
    } catch (e) {
        const err = new Error('Error fetching offers: ' + e)
        console.error(err)
        throw err
    }
}

export const requestGetOffersByPartner = async (partnerGuid: string, states: string[]): Promise<ServiceCRM[]> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/partners/${partnerGuid}/services`;
    const queryParams = [];

    if (states.length > 0) {
        queryParams.push(`states=${states.join(',')}`);
    }

    const queryString = queryParams.join('&');
    const fullApiUrl = `${apiUrl}?${queryString}`;

    try {
        const data = await axios.get(fullApiUrl);
        return data.data as ServiceCRM[];
    } catch (e) {
        const err = new Error('Error fetching partner\'s offers: ' + e);
        console.error(err);
        throw err;
    }
}

export const RequestGetPartnerByGuid = async (guid: string) => {
    const apiUrl = `${configBaseURL.crmBaseURL}/partners/${guid}`;

    try {
        const response = await axios.get(apiUrl)
        return response.data as Entity
    } catch (e) {
        const err = new Error('Error fetching offers: ' + e)
        console.error(err)
        throw err
    }

}

export const RequestGetCurrentUser = async (): Promise<UserCRM | undefined> => {
    try {
        const query = await fetch(configBaseURL.crmBaseURL + '/users/');

        const response = await query.json();
        const user = response as UserCRM;

        if (user.agents && Object.keys(user.agents).length > 0) {
            const guid = user.agents[Object.keys(user.agents)[0]].guid
            const agents = await requestGetEntity(EntityType.agents, guid)
            user.agents = {[guid]: agents} as Entity
            const payerID = (agents as EntityData).payer_id
            if (payerID && payerID.length > 0) {
                if (!user.payer) {
                    user.payer = {[payerID]: {}} as Payer;
                }
                user.payer[payerID].agents = {[guid]: agents} as Entity
            }
        }
        if (user.clients && Object.keys(user.clients).length > 0) {
            const guid = user.clients[Object.keys(user.clients)[0]].guid
            const clients = await requestGetEntity(EntityType.clients, guid)
            user.clients = {[guid]: clients} as Entity
            const payerID = (clients as EntityData).payer_id
            if (payerID && payerID.length > 0) {
                if (!user.payer) {
                    user.payer = {[payerID]: {}} as Payer;
                }
                user.payer[payerID].clients = {[guid]: clients} as Entity
            }
        }
        if (user.partners && Object.keys(user.partners).length > 0) {
            const guid = user.partners[Object.keys(user.partners)[0]].guid
            const partners = await requestGetEntity(EntityType.partners, guid)
            user.partners = {[guid]: partners} as Entity
            const payerID = (partners as EntityData).payer_id
            if (payerID && payerID.length > 0) {
                if (!user.payer) {
                    user.payer = {[payerID]: {}} as Payer;
                }
                user.payer[payerID].partners = {[guid]: partners} as Entity
            }
        }
        if (user.payer == null) {
            // crate payer if it isn't available
            const agentID = user.agents && Object.keys(user.agents).length > 0 ?
                user.agents[Object.keys(user.agents)[0]].guid : null
            const clientID = user.clients && Object.keys(user.clients).length > 0 ?
                user.clients[Object.keys(user.clients)[0]].guid : null
            const partnerID = user.partners && Object.keys(user.partners).length > 0 ?
                user.partners[Object.keys(user.partners)[0]].guid : null
            // create payer
            const payerID = await requestCreatePayer(agentID, clientID, partnerID);
            user.payer = {} as Payer;
            user.payer[payerID] = {
                agents: user.agents,
                clients: user.clients,
                partners: user.partners
            }
        }
        console.log(user)

        return user as UserCRM;
    } catch (e: any) {
        console.log(e.message)
    }
    return undefined;
}

export const RequestValidateUserInfo = (user: UserCRM | undefined): boolean | undefined => {
    if (user) {
        if (user.first_name == '') {
            return false
        }
        if (user.last_name == '') {
            return false
        }
        if (user.clients && user.partners && user.agents) {
            return Object.keys(user.clients).length != 0 &&
                Object.keys(user.partners).length != 0 &&
                Object.keys(user.agents).length != 0;
        } else {
            return false
        }
    }
    return undefined;
}

export const RequestUpdateCurrentUser = async (user: UserCRM) => {
    try {
        const data = {
            first_name: user.first_name,
            last_name: user.last_name,
        }
        const res = await fetch(configBaseURL.crmBaseURL + '/users/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error('AUTH.VALIDATION.INVALID_COOKIES');
        }
    } catch (error: any) {
        console.error('Error uploading data:', error);
        throw new Error('AUTH.VALIDATION.INVALID_COOKIES');
    }
}

export const requestGetEntity = async (type: string, id: string) => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/' + type + '/' + id + '/')
        if (!response.ok) {
            throw new Error("can't get entity type: " + type + ', id: ' + id + ", status is " + response.status)
        }
        return await response.json()
    } catch (error) {
        console.error("can't get entity: ", type, 'id: ', id, ', error', error)
        throw new Error("can't get entity type: " + type + ', id: ' + id + ', error ' + error)
    }
}

const requestCreateEntity = async (type: string, data: CreateEntityData) => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/' + type + '/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error("can't create entity type: " + type + ", status is " + response.status)
        }
    } catch (error) {
        console.error("can't create entity: ", type, ', error', error)
        throw new Error("can't create entity type: " + type + ', error ' + error)
    }
}

const requestUpdateEntity = async (type: string, id: string, data: CreateEntityData) => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/' + type + '/' + id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error("can't update entity type: " + type + ', id: ' + id + ", status is " + response.status)
        }
    } catch (error) {
        console.error("can't update entity: ", type, 'id: ', id, ', error', error)
        throw new Error("can't create entity type: " + type + ', id: ' + id + ', error ' + error)
    }
}
const requestCreatePayer = async (agentID: string|null, clineID: string|null, partnerID: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"agent_id": agentID, "client_id": clineID, "partner_id": partnerID}),
        })
        if (!response.ok) {
            throw new Error("can't create payer, for agentID: " + agentID + ', clientID: ' + clineID +
                ', partnerID: ' + partnerID + ", status is " + response.status)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error: any) {

    }
    return "";
}

const requestGetPayerInfo = async (payerID: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/' + payerID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error("can't get payer, for get payer: " + payerID + ", status is " + response.status)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error: any) {

    }
    return "";
}

const requestUpdatePayerInfo = async (payerID: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/' + payerID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        if (!response.ok) {
            throw new Error("can't update payer, for payerID: " + payerID + ", status is " + response.status)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error: any) {

    }
    return "";
}

const requestCreateTransaction = async (payerID: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/' + payerID + '/transactions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        if (!response.ok) {
            throw new Error("can't create transaction, for payerID: " + payerID + ", status is " + response.status)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error: any) {

    }
    return "";
}

const requestGetTransaction = async (payerID: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/' + payerID + '/transactions/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error("can't get transactions, for payerID: " + payerID + ", status is " + response.status)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error: any) {

    }
    return "";
}

export const RequestMakePayment = async (payerID: string|null, purchaseType: string|null, guid: string|null): Promise<string> => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + '/payments/' + payerID + '/' + purchaseType + '/' + guid, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        if (!response.ok) {
            throw new Error("can't make purchase, for payerID: " + payerID + ', for: ' + purchaseType +
                ', with GUID: ' + guid + ", status is " + response.status)
        }
        const resp = await response.json() as CRMPaymentResponse;
        console.log(response);
        return resp.how;
    } catch (error: any) {
        return "";
    }
    return "";
}

export const CreateOrUpdateEntitiesForCurrentUser = async (data: CreateEntityData) => {
    try {
        const user = await RequestGetCurrentUser()
        if (!user) { // TODO: localize error
            throw new Error('AUTH.VALIDATION.INVALID_COOKIES');
        }
        const createOrUpdateEntity = async (type: keyof UserCRM) => {
            const entity = user[type];
            if (!entity || Object.keys(entity).length === 0) {
                await requestCreateEntity(type, data);
                if (data.avatar) {
                    await RequestUploadAvatarForEntity(type, user.identity, data.avatar)
                }
            } else {
                await requestUpdateEntity(type, Object.keys(entity)[0], data);
            }
        }

        await createOrUpdateEntity(EntityType.clients as keyof UserCRM);
        await createOrUpdateEntity(EntityType.partners as keyof UserCRM);
        await createOrUpdateEntity(EntityType.agents as keyof UserCRM);
    } catch (error: any) {
        console.error('Error creating Entities:', error);
        throw new Error('AUTH.VALIDATION.INVALID_COOKIES');
    }
    if (data.avatar) {
        const user = await RequestGetCurrentUser()
        if (user) {
            await RequestUploadAvatarForEntity(EntityType.users, user?.identity, data.avatar);
        }
        if (user?.agents && Object.keys(user?.agents).length > 0) {
            await RequestUploadAvatarForEntity(EntityType.agents, Object.keys(user?.agents)[0], data.avatar);
        }
        if (user?.clients && Object.keys(user?.clients).length > 0) {
            await RequestUploadAvatarForEntity(EntityType.clients, Object.keys(user?.clients)[0], data.avatar);
        }
        if (user?.partners && Object.keys(user?.partners).length > 0) {
            await RequestUploadAvatarForEntity(EntityType.partners, Object.keys(user?.partners)[0], data.avatar);
        }
    }
}

export const RequestUpdateClientWithMetaData = async (client: EntityData, details: string,
                                                   socialMedia: { [platform: string]: string[] }) => {
    const metaData = {bh_client: {social_media: {}}} as ClientMeta;
    metaData.bh_client.social_media = socialMedia;
    metaData.bh_client.details = details;
    try {
        const data = {
            email: client.email,
            name: client.name,
            meta_data: metaData
        }
        const response = await fetch(configBaseURL.crmBaseURL + `/clients/${client.guid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    } catch (error) {
        console.error('Error updating data: ', error)
    }
}

export const RequestUpdatePartnersWithMetaData = async (partner: EntityData, details: string,
                                                 socialMedia: { [platform: string]: string[] }) => {
    const metaData = {bh_partner: {social_media: {}}} as PartnerMeta;
    metaData.bh_partner.social_media = socialMedia
    metaData.bh_partner.details = details

    try {
        const data = {
            email: partner.email,
            name: partner.name,
            meta_data: metaData
        }
        const response = await fetch(configBaseURL.crmBaseURL + `/partners/${partner.guid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    } catch (error) {
        console.error('Error updating data: ', error)
    }
}

export const RequestUpdateReferralCampaignList =
    async (agents: EntityData, referralCampaigns: ReferralCampaignInterface) => {
        const metaData = {bh_referral: {model_list: {}}} as ReferralMeta;
        metaData.bh_referral.model_list = referralCampaigns

        try {
            const data = {
                email: agents.email,
                name: agents.name,
                meta_data: metaData
            }
            const response = await fetch(configBaseURL.crmBaseURL + `/agents/${agents.guid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        } catch (error) {
            console.error('Error updating data: ', error)
        }
    }

export const RequestCreateOffer = async (partnerGuid: string,
                                  name: string, description: string, categories: string[],
                                  price: number, socialMedia: SocialMedia,
): Promise<string | undefined> => {

    try {
        const meta = {bh_service: {social_media: socialMedia}} as ServiceMeta;

        // Upload all offer data
        const data = {
            name: name,
            description: description,
            categories: categories,
            price: price as number,
            meta_data: meta,
        }
        console.log(data)
        const response =
            await fetch(configBaseURL.crmBaseURL + '/partners/' + partnerGuid + '/services', {
                method: 'POST',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            });

        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(response);
        return resp.id;
    } catch (error) {
        console.log(error)
        throw new Error("can't create offer, err: " + error);
    }
}

export const RequestUploadImagesForCommerce = async (commerceType: string, fileList: File[], serviceGuid: string): Promise<string[]> => {
    let images = {} as string[];
    try {
        for (const image of fileList) {
            try {
                const imageID = await RequestUploadImage(commerceType, image, serviceGuid)
                if (images && images.length > 0) {
                    images.push(imageID);
                } else {
                    images = [imageID];
                }
            } catch (error) {
                console.error('Error uploading image', error);
                throw new Error("can't upload images, err: " + error)
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error("can't upload images, err: " + error)
    }
    return images;
}

export const RequestUploadImage = async (type: string, image: File, entityGuid: string): Promise<string> => {
    let imageID = '';
    try {
        console.log(image);
        const formData = new FormData();
        formData.append(
            "image",
            image,
        );
        const imageValue = formData.get("image");
        console.log(imageValue)

        const imgResponse = await axios
            .post(`${configBaseURL.crmBaseURL}/images/${type}/${entityGuid}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

        console.log(imgResponse.data)
        imageID = imgResponse.data['id'] as string;
    } catch (error) {
        console.error(error)
        throw new Error("can't upload image, err: " + error)
    }
    return imageID;
}

export const RequestUpdateOfferState = async (offerID: string, state: string) => {
    try {
        const data = {
            state: state,
        }
        const response = await fetch(
            configBaseURL.crmBaseURL + `/services/${offerID}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    } catch (error) {
        console.error('Error updating offer status', error);
        throw new Error("can't update offer status, err: " + error)
    }
}

export const RequestUpdateModelState = async (modelID: string, state: string) => {
    try {
        const data = {
            state: state,
        }
        const response = await fetch(
            configBaseURL.crmBaseURL + `/demand/${modelID}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    } catch (error) {
        console.error('Error updating offer status', error);
        throw new Error("can't update offer status, err: " + error)
    }
}

export const RequestDeleteOffer = async (service: ServiceCRM) => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + `/services/${service.guid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error("can't delete offer, err: " + response.statusText)
        }
    } catch (error) {
        console.error('Error deleting offer', error);
        throw new Error("can't delete offer, err: " + error)
    }
}

export const RequestCreateDemand = async (clientID: string,
                                   name: string, description: string,
                                   categories: string[], budget: number,
                                   successCriteria: SuccessCriteria): Promise<string | undefined> => {
    try {
        const meta = {bh_model: {success_criteria: successCriteria}} as DemandMeta;

        // Upload all offer data
        const data = {
            name: name,
            description: description,
            categories: categories,
            budget: budget as number,
            meta_data: meta,
        }
        console.log(data)
        const response =
            await fetch(configBaseURL.crmBaseURL + '/clients/' + clientID + '/demands', {
                method: 'POST',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as NewCRMObject;
        console.log(resp);
        return resp.id;
    } catch (error) {
        console.log(error)
        throw new Error("can't create offer, err: " + error);
    }
}

export const RequestUpdateDemand = async (demandID: string,
                                   name: string, description: string,
                                   categories: string[], budget: number,
                                   successCriteria: SuccessCriteria) => {
    try {
        const meta = {bh_model: {success_criteria: successCriteria}} as DemandMeta;

        // Upload all offer data
        const data = {
            name: name,
            description: description,
            categories: categories,
            budget: budget as number,
            meta_data: meta,
        }
        console.log(data)
        const response =
            await fetch(configBaseURL.crmBaseURL + '/demands/' + demandID, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }

    } catch (error) {
        console.log(error)
        throw new Error("can't create offer, err: " + error);
    }
}

export const RequestDeleteDemand = async (demand: DemandCRM) => {
    try {
        const response = await fetch(configBaseURL.crmBaseURL + `/demands/${demand.guid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error("can't delete demand, err: " + response.statusText)
        }
    } catch (error) {
        console.error('Error deleting demand', error);
        throw new Error("can't delete demand, err: " + error)
    }
}
/**
 * Uploads an avatar image for a given entity.
 * @async
 * @param {string} entityType - The type of the entity (e.g., users, agents, clients, partners).
 * @param {string} entityGUID - The unique identifier of the entity.
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<string>} - The ID of the uploaded image.
 * @throws {Error} - If the image upload fails.
 */
export const RequestUploadAvatarForEntity = async (entityType: string, entityGUID: string, file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append(
            "image",
            file,
        );

        try {
            const imgResponse = await axios
                .post(`${configBaseURL.crmBaseURL}/images/${entityType}/${entityGUID}/avatar`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            console.log(imgResponse.data)
            return imgResponse.data['id'] as string
        } catch (error) {
            console.error('Error uploading image', error);
            throw error;
        }
    } catch (error) {
        console.error(error)
        throw new Error('can not upload image, err:' + error)
    }
}

export const RequestGetCategories = async (): Promise<CategoryCRM[]> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/public/merchants/${MERCHANT_GUID}/tags`;
    try {
        const data = await axios.get(apiUrl)
        return data.data as CategoryCRM[]
    } catch (e) {
        const err = new Error('Error fetching offers: ' + e)
        console.error(err)
        throw err
    }
}

export const RequestDeleteMediaByID = async (mediaGUID: string) => {
    try {
        try {
            const imgResponse = await axios
                .delete(`${configBaseURL.crmBaseURL}/images/content/${mediaGUID}`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            console.log(imgResponse.data)
        } catch (error) {
            console.error('Error deleting image', error);
            throw error;
        }
    } catch (error) {
        console.error(error)
        throw new Error('can not delete image, err:' + error)
    }
}

export const requestGetModelByGuid = async (guid: string): Promise<DemandCRM> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/demands/${guid}`;
    try {
        const data = await axios.get(apiUrl)
        return data.data as DemandCRM
    } catch (e) {
        const err = new Error('Error fetching model: ' + e)
        console.error(err)
        throw err
    }
}
export const requestGetOfferByGuid = async (guid: string): Promise<ServiceCRM> => {
    const apiUrl = `${configBaseURL.crmBaseURL}/services/${guid}`;
    try {
        const data = await axios.get(apiUrl)
        console.log(data)
        return data.data as ServiceCRM
    } catch (e) {
        const err = new Error('Error fetching offer: ' + e)
        console.error(err)
        throw err
    }
}

export const requestUpdateOffer = async (service: UpdateService, guid: string): Promise<StateCRM> => {
    try {
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/services/${guid}`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(service)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as ServiceCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const requestUpdateOfferState = async (guid: string, state: string): Promise<ServiceCRM> => {
    try {
        const data = {
            state: state
        }
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/services/${guid}/state`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as ServiceCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const requestUpdateModel = async (service: UpdateDemand, guid: string): Promise<DemandCRM> => {
    try {
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/demands/${guid}`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(service)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as DemandCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const requestUpdateModelState = async (guid: string, state: string): Promise<StateCRM> => {
    try {
        const data = {
            state: state
        }
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/demands/${guid}/state`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as StateCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const RequestLinkDemandToService = async (demandGuid: string, serviceGuid: string): Promise<StateCRM> => {
    try {
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/demands/${demandGuid}/services/${serviceGuid}`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as StateCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const RequestLinkServiceToDemand = async (serviceGuid: string, demandGuid: string): Promise<StateCRM> => {
    try {
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/services/${serviceGuid}/demands/${demandGuid}`, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as StateCRM;
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}

export const RequestGetLinkedServices = async (demandGuid: string): Promise<ServiceCRM[]> => {
    try {
        const response =
            await fetch(`${configBaseURL.crmBaseURL}/demands/${demandGuid}/services`, {
                method: 'GET',
                headers:
                    {
                        'Content-Type': 'application/json',
                    },
            });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const resp = await response.json() as ServiceCRM[];
        console.log(resp);
        return resp;
    } catch (error) {
        console.error('Error uploading image', error);
        throw error;
    }
}