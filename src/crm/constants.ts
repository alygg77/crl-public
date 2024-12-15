import * as Yup from "yup";
import {MediaListInterface} from "./types";
import {loadEnv} from "vite";

export const toAbsoluteUrl = (pathname: string) =>
    window.location.origin + pathname;

export const EntityType = {
    agents: "agents",
    clients: "clients",
    partners: "partners",
    merchants: "merchants",
    users: "users"
}
export const CommerceType = {
    demands: "demands",
    products: "products",
    goods: "goods",
    services: "services"
}

export const SERVICE_STATES = {
    created: "created",
    ready: "ready",
    approved: "approved",
    accepted: "accepted",
    selected: "selected",
    published: "published",
    bought: "bought",
    pending_issuer_approval: "pending_issuer_approval",
    delivering: "delivering",
    delivered: "delivered",
    admin_help: "admin_help",
    rejected: "rejected",
    canceled: "canceled",
};
export const DemandsCriteriaVersion = "V1"

export enum CriteriaActions {
    FreeContent = "free_content",
    IncludeContent = "include_content",
    FixedContent = "fixed_content",
}

export enum CriteriaCheck {
    ProveLink = "prove_link",
}
export const DEFAULT_IMAGE_URL = toAbsoluteUrl('/media/icons/duotune/ecommerce/ecm007.svg');

export const SocialMediaList: MediaListInterface = {
    facebook: {
        title: 'FaceBook',
        link: 'https://www.facebook.com/',
        placeholder: "fb profile id",
        validator: Yup.string().required('required'),
        logo: 'bi bi-facebook'
    },
    instagram: {
        title: 'Instagram',
        link: 'https://www.instagram.com/',
        placeholder: "instagram account",
        validator: Yup.string().required('required'),
        logo: 'bi bi-instagram'
    },
    twitter: {
        title: 'Twitter',
        link: 'https://twitter.com/',
        placeholder: "@twitter account",
        validator: Yup.string().required('required'),
        logo: 'bi bi-twitter'
    },
    x: {
        title: 'X',
        link: 'https://x.com/',
        placeholder: "@x account",
        validator: Yup.string().required('required'),
        logo: 'bi bi-twitter-x'
    },
    youtube: {
        title: 'YouTube',
        link: 'https://www.youtube.com/',
        placeholder: "youtube user id",
        validator: Yup.string().required('required'),
        logo: 'bi bi-youtube'
    },
    reddit: {
        title: 'reddit',
        link: 'https://www.reddit.com/',
        placeholder: "reddit user id",
        validator: Yup.string().required('required'),
        logo: 'bi bi-reddit'
    },
    linkedin: {
        title: 'LinkedIn',
        link: 'https://www.linkedin.com/',
        placeholder: "LinkedIn profile",
        validator: Yup.string().required('required'),
        logo: 'bi bi-linkedin'
    },

    medium: {
        title: 'Medium',
        link: 'https://medium.com/',
        placeholder: "@medium account",
        validator: Yup.string().required('required'),
        logo: 'bi bi-medium'
    },
    tiktok: {
        title: 'TikTok',
        link: 'https://www.tiktok.com/',
        placeholder: "@tiktok account",
        validator: Yup.string().required('required'),
        logo: 'bi bi-tiktok'
    },
    telegram: {
        title: 'Telegram',
        link: 'https://telegram.org/',
        placeholder: "telegram account",
        validator: Yup.string().matches(/^@[a-zA-Z0-9_]{5,32}$/,
            'Invalid Telegram username').required('required'),
        logo: 'bi bi-telegram'
    },
    web: {
        title: 'Web Resources',
        link: '',
        placeholder: "https://your-resources.web",
        validator: Yup.string().matches(/^https:\/\/[A-Za-z0-9\.-]{2,256}\.[a-z]{2,16}\b([-A-Za-z0-9@:%_\+.~#?&//=]*)/,
            'Invalid HTTPS URL').required('required'),
        logo: 'bi bi-globe2'
    },
};
