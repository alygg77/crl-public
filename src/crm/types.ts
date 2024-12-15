import * as Yup from "yup";

export type CreateEntityData = {
    email: string,
    name: string,
    avatar: File | undefined,
    background: File | undefined
}

export type SocialMedia = {
    [platform: string]: string[]; //Mapping array (social media => array of accounts).
}

export type ClientMeta = {
    bh_client: {
        details: string
        social_media: SocialMedia
    }
}

export type PartnerMeta = {
    bh_partner: {
        details: string
        social_media: SocialMedia
    }
}

export type BHService = {
    social_media: SocialMedia
}

export type ServiceMeta = {
    applicantsGuid: string[]
    bh_service: {
        social_media: SocialMedia
    }
}

export type DemandMeta = {
    applicantsGuid: string[]
    bh_model: {
        success_criteria: SuccessCriteria;
    }
}
export type SocialMediaChanel = {
    [media: string]: { Amount: number }
}
export type ContentMediaCRM = {
    [name: string]: {
        id: string
        type: string
    }
}
export type ContentMediaAPP = {
    [name: string]: {
        id: string
        type: string
        file: File
    }
}

export type CriteriaV1 = {
    Action: string
    Content: string
    ContentMedia: ContentMediaAPP
    SocialMediaChanel: SocialMediaChanel
    Check: string
}

export type CriteriaV1CRM = {
    Action: string
    Content: string
    ContentMedia: ContentMediaCRM
    SocialMediaChanel: SocialMediaChanel
    Check: string
}

interface Criteria {
}

export type SuccessCriteria = {
    Version: string
    Criteria: CriteriaV1CRM
}

export type EntityData = {
    name: string;
    guid: string;
    email: string;
    avatar: string,
    background: string,
    state: string,
    payer_id: string,

    merchant: {
        guid: string,
        name: string
    },

    blockReason: {
        blockedByUserId: string,
        reason: string,
        description: string
    },

    meta_data: object;
};

export type NewCRMObject = {
    id: string;
}

export interface Entity {
    [guid: string]: EntityData
}

export type Category = {
    category: string,
    description: string,
    guid: string
}

export type OptionType = {
    label: string,
    value: string,
}

export type ServiceCRM = {
    updated_at: string,
    guid: string,
    name: string,
    description: string,
    price: number,
    categories: Category[],

    images: [
        string
    ],

    partner: EntityData,

    state: string

    meta_data: {},
}

export type UpdateService = {
    name: string,
    description: string,
    price: number,
    categories: string[],
    meta_data: {},
}

export type DemandCRM = {
    updated_at: string,
    guid: string,
    name: string,
    description: string,
    budget: number,
    categories: Category[],

    images: [
        string
    ],

    client: EntityData,

    state: string

    meta_data: DemandMeta,

}


export type UpdateDemand = {
    name: string,
    description: string,
    budget: number,
    categories: string[],
    meta_data: {},
}

export type Payer = {
    [payerID: string]: {
        agents: Entity | null,
        clients: Entity | null,
        partners: Entity | null,
    }
}

export type CRMPaymentResponse = {
    how: string
}

export type UserMeta = {
    bh_subscription: {
        expire_date: number
        subscription_level: number
    }
}

export type UserCRM = {
    first_name: string,
    last_name: string,
    identity: string,
    email: string,
    avatar: string,
    payer: Payer | null,
    is_blocked: boolean,

    agents: Entity,

    clients: Entity,

    partners: Entity,

    merchants: Entity,

    meta_data: {}
}

export type CategoryCRM = {
    created_at: string,
    updated_at: string,
    guid: string,
    category: string,
    description: string,
    num_child: number
}

export type StateCRM = {
    state: string
}
export type Media = {
    title: string,
    link: string,
    logo: string,
    placeholder: string,
    validator: Yup.StringSchema,
};

export interface MediaListInterface {
    [name: string]: Media
}

export type ReferralCampaign = {
    utm_source: string,
    utm_medium: string,
    utm_campaign: string
};

export interface ReferralCampaignInterface {
    // name is a hash of utm_source + utm_medium + utm_model
    [name: string]: ReferralCampaign
}


export type ReferralMeta = {
    bh_referral: {
        model_list: ReferralCampaignInterface
    }
}
